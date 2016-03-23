---
date: 2016-03-22T19:09:32-04:00
tags:
  - emberjs
  - "ember-simple-auth"
  - jwt
title: Chaining Authentication in an Ember App
---

This is something that comes in very handy when you need to use multiple
authenticators but don't necessarily care about keeping the state of the
_first_ authenticator around. I'll explain what this means with an example!

Building from the example from [GitHub Social Authentication with Ember Simple
Auth and Torii][1], imagine that the mechanism you chose to authenticate
requests with your backend was [JSON Web Tokens][2]. In the GitHub OAuth flow,
the _authorizationCode_ you receive back after the initial redirect
needs to be exchanged for an _access token_. This access token will
act as the OAuth Bearer Token for all authenticated GitHub requests.

The problem here is that in order to obtain an access token, one needs to
supply GitHub both the `client_id` and `client_secret`. **The latter is a no-go
with client-side javascript apps**.

It's clear that you'll need a backend here that does the token exchange
portion. But how do you verify client sessions using just the GitHub OAuth
token?  This gets quite hairy. And with a distributed backend that does not
necessarily keep state (like [Lambda][3]), callbacks become very expensive.

Fortunately [JSON Web Tokens][2] work nicely in this setup!

**Bigger Picture**

1. Human clicks the "Login With GitHub" button inside your Ember app

1. A popup appears asking the human to grant your app permission to the human's
   GitHub account

1. GitHub then redirects that request back to your Ember app, with a
   `access_token`

1. The second (chained) authenticator takes this `access_token` and passes it
   along to _your_ backend

1. Your backend validates that this token is legit and returns a JWT back to
   the Ember app

1. Any future API requests need to use this JSON Web Token

**What does this look like in Ember?**

Install the simple auth token addon:

``` bash
ember install ember-simple-auth-token
```

From the [GitHub Social Authentication with Ember Simple Auth and Torii][1]
example, change the `login()` function in `app/controllers/application.js` to
the following:

``` js
login() {
  var _this = this;
  this.get('session').authenticate('authenticator:torii', 'github').then(function() {
    var authorizationCode = _this.get('session.data.authenticated.authorizationCode');
    var payload = {
      'password': authorizationCode
    };
    _this.get('session').authenticate('authenticator:jwt', payload);
  });
}
```

Add the following two environment variables to `config/environment.js`. Keep in
mind that `serverTokenEndpoint` and `serverTokenRefreshEndpoint` will need to
point to your real backend for production.

``` js
ENV['ember-simple-auth'] = {
  authorizer: 'authorizer:token'
};

ENV['ember-simple-auth-token'] = {
  serverTokenEndpoint: '/api/token-auth/',
  identificationField: 'username',
  passwordField: 'password',
  tokenPropertyName: 'token',
  authorizationPrefix: 'Bearer ',
  authorizationHeaderName: 'Authorization',
  headers: {},
  refreshAccessTokens: true,
  serverTokenRefreshEndpoint: '/api/token-refresh/',
  tokenExpireName: 'expires_in',
  refreshLeeway: 300,
  timeFactor: 1000
};
```

And that's it! Assuming your backend is in good shape, you should have a
functional Ember app authenticated against GitHub and your custom JWT backend!

**Testing**

Wanna test to make sure that the Ember portion of this setup actually works?
Good! Cause Ember's mock server comes in very handy here.

``` bash
ember g http-mock users
npm install --save-dev jsonwebtoken
```

Create the `server/mocks/api/token-auth.js` file with the following contents:

``` js
const util = require('util');

module.exports = function(app) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var jwt = require('jsonwebtoken');
  var apiTokenAuthRouter = express.Router();

  apiTokenAuthRouter.post('/', function(req, res) {
    console.log('body is: ' + util.inspect(req.body));
    jwt.sign(req.body, 'secret', { expiresIn: 10 }, function(token) {
      res.send({
        token: token
      });
    });
  });

  app.use(bodyParser.json());
  app.use('/api/token-auth', apiTokenAuthRouter);
};
```

Create a server/mocks/api/token-refresh.js

``` js
module.exports = function(app) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var jwt = require('jsonwebtoken');
  var apiTokenRefreshRouter = express.Router();

  apiTokenRefreshRouter.post('/', function(req, res) {
    jwt.verify(req.body.token, 'secret', function(err, decoded) {
      if (err) {
        res
          .status(401)
          .send({
            error: err
          });
      } else {
        res.send({
          token: jwt.sign(decoded, 'secret', { expiresIn: 10 })
        });
      }
    });
  });

  app.use(bodyParser.json());
  app.use('/api/token-refresh', apiTokenRefreshRouter);
};
```

Create a server/mocks/users.js

``` js
module.exports = function(app) {
  var express = require('express');
  var jwt = require('jsonwebtoken');
  var usersRouter = express.Router();

  usersRouter.get('/', function(req, res) {
    var authorizationHeader = req.headers.authorization || '';

    var token = authorizationHeader.split('Bearer ')[1];

    if (!token) {
      res.send({}, 200);
      return;
    }

    res.send(jwt.verify(token, 'secret'));
  });

  app.use('/api/users', usersRouter);
};
```

Kill and restart `ember server` and you should see all those little JWT
requests in the ember console. Neat, huh! <i class="fa fa-lightbulb-o"></i>

Check out the [ember-simple-auth-token][4] project for more details!

[1]: {{< relref "til/2016-03-21-github-social-authentication-with-ember-simple-auth-and-torii.md" >}}
[2]: https://jwt.io
[3]: https://aws.amazon.com/lambda
[4]: https://github.com/jpadilla/ember-simple-auth-token
