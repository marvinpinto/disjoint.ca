---
date: 2016-03-21T16:29:11-05:00
tags:
  - emberjs
  - "ember-simple-auth"
title: GitHub Social Authentication with Ember Simple Auth and Torii
meta_image: "https://s.gravatar.com/avatar/22784ea1769f025112c92c31321c6bf1?s=400"
---

I ran into a bunch of issues yesterday trying to get an Ember app to
authenticate against GitHub using [Ember Simple Auth][1] and [Torii][2]. After
a bunch of troubleshooting and research, the root cause appeared to be the
`sessionDataUpdated` event firing due to torii _also_ using `localStorage`,
which resulted in being immediately logged out (after logging in).

This [GitHub issue][3] and the folks participating in it were very helpful in
diagnosing what was going on!


**Some Workarounds I Tried**:

I tried using the torii library directly following the instructions on the
[readme][2] and this worked for the most part! Unfortunately this added a bunch
more boilerplate than I really wanted to deal with (dealing with
`localStorage`, session management, etc)

I also tried downgrading Ember Simple Auth to 1.0.1, but this seemed to cause
unrelated issues and at this point I was losing a bit of patience <i class="fa
fa-frown-o"></i>


**What worked for me!**

Basically, using a combination of the newest ember-simple-auth and torii seemed
to do the trick. I'm going to detail exactly how to get this working so
hopefully this becomes easier for the next person.

**End-to-end EmberJS Github Authentication Example**

_(Do feel free to skip over the parts you're already familiar with)_

Here is what you will need:

- [ember-cli][5] (I used version 2.4.2 for this example)
- [GitHub OAuth Application][4]

Let's start off by creating a basic ember app. We'll use this app to
demonstrate logging in and out using the GitHub OAuth flow.

``` bash
mkdir test-app
cd test-app
ember init --name test-app
```

This gets you all the basic ember boilerplate. In addition to this, we'll also
need to install Ember Simple Auth and Torii:

``` bash
ember install torii@0.8.0-beta.1
ember install git+https://github.com/rmachielse/ember-simple-auth#fix-async_stores
```

(Note that this example is using the `fix-async_stores` branch of <a
href="https://github.com/rmachielse/ember-simple-auth"><i class="fa
fa-github"> rmachielse/ember-simple-auth</i></a> to temporarily work around
[this issue][3])

Add the `torii` environment dict to `config/environment.js`. Make sure that the
`redirectUri` here matches exactly what you enter in the `Authorization
callback URL` field in your [GitHub OAuth application][4] or you will have a
bad day.

``` js
ENV['torii'] = {
  sessionServiceName: 'session',
  providers: {
    'github-oauth2': {
      apiKey: 'GitHub Client ID',
      scope: 'user',
      redirectUri: 'GitHub Authorization callback URL'
    }
  }
};
```

With that in place, generate all the ember application-related stubs:

``` bash
ember g route application
ember g controller application
ember g authenticator torii
```

Update `app/templates/application.hbs` to display the contextual login or logout link:

``` handlebars
<h1>Welcome to Ember</h1>

{{#if session.isAuthenticated}}
  <ul>
    <li>Provider: {{session.data.authenticated.provider}}</li>
    <li>GitHub token: {{session.data.authenticated.authorizationCode}}</li>
  </ul>
  <button {{action 'logout'}}>logout</button>
{{else}}
  <button {{action 'login'}}>login</button>
{{/if}}

{{outlet}}
```

Add the `ApplicationRouteMixin` to `app/routes/application.js`:

``` js
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {});
```

Add the login and logout actions to the application controller
(`app/controllers/application.js`):

``` js
import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {
    logout() {
      this.get('session').invalidate();
    },
    login() {
      this.get('session').authenticate('authenticator:torii', 'github');
    }
  }
});
```

Inject the torii service into the authenticator (`app/authenticators/torii.js`):

``` js
import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

export default ToriiAuthenticator.extend({
  torii: Ember.inject.service()
});
```

Finally, add the torii provider (`app/torii-providers/github.js`):

``` js
import GithubOauth2Provider from 'torii/providers/github-oauth2';

export default GithubOauth2Provider.extend({
  fetch(data) {
    return data;
  }
});
```

This last part is the magic that allows your `authorizationCode` to persist
between session refreshes! (was another source of yaks for me)

And that's it! Run `ember server` in your terminal and head over to
`http://localhost:4200`. You'll notice logging in and out of your app using
GitHub works as expected!

[1]: https://github.com/simplabs/ember-simple-auth
[2]: https://github.com/Vestorly/torii
[3]: https://github.com/simplabs/ember-simple-auth/issues/927
[4]: https://github.com/settings/developers
[5]: http://ember-cli.com
