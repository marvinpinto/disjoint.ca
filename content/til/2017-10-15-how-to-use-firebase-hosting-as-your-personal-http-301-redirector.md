---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-15T17:50:00-04:00
lastmod: 2017-10-15T17:50:00-04:00
title: "How to use Firebase Hosting as your personal HTTP 301 redirector"
tags:
  - 'firebase'
---

[Firebase Hosting][firebase-hosting] from Google comes bundled with a very
generous [free tier][firebase-pricing] for all your website/single-page-app
hosting needs.  Among its features are custom domains, managed TLS
certificates, and advanced configuration options.

This is perfect for a low-maintenance domain you need parked or redirected as
Firebase provisions and manages your TLS certificates for you. Which translates
to not needing to worry about or manage certificate renewals! Another cool
side-effect is that Firebase by default redirects all http requests to https.
Using it as a redirector means that both your http and https requests get
redirected to your new domain without any extra effort on your part!

I'll give you a brief walkthrough of how to set this up along with a few
examples - 301-redirect `irchooky.org` to `disjoint.ca/projects/irchooky`.

### Setup

Create a new project in your [Firebase Console][firebase-console]. I called my
project `irc-hooky`. After the creation process is finished head over to the
`Hosting` section (on the left). Click the `Get Started` button and keep
clicking `Continue` to follow the on-screen prompts. **You don't actually have
to do anything on your local machine just yet**.

You should now see an option to `Connect Domain`. Click on the connect button
and fill out the domain you wish to redirect from. After you click `Continue`,
you will need to verify the ownership of this domain via a DNS TXT record.
After DNS verification is finished and your TLS certificate has been
provisioned, you will see a `Connected` message under Status.

### Deployment

While your TLS certificate is being provisioned you can get the other pieces
ready to go. Create a `firebase.json` file with contents similar to the
following:
``` js
{
  "hosting": {
    "public": "firebase",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "redirects": [
      {
        "source": "/",
        "destination": "https://disjoint.ca/projects/irc-hooky",
        "type": 301
      },
      {
        "source": "/**",
        "destination": "https://disjoint.ca/projects/irc-hooky",
        "type": 301
      }
    ]
  }
}
```

You will want to replace `https://disjoint.ca/projects/irc-hooky` with your
redirect destination.

If you don't already have `firebase-tools` installed locally:
``` bash
$ npm install -g firebase-tools
```

Login to firebase via the CLI. The `--no-localhost` option here allows you to
copy/paste the resulting auth token back into your terminal session.
``` bash
firebase login --no-localhost
```

Create a `firebase` directory with the following `index.html` file:
``` html
<!DOCTYPE html>
<html><body></body></html>
```

You are now ready to deploy your redirector!
``` bash
$ firebase --project "irc-hooky" deploy
```
Replace `irc-hooky` there with your Firebase Hosting project name.

### Verification

Assuming everything went off without a hitch, you should see your domain
redirects working as you expect.
``` bash
$ curl -v https://irchooky.org
* Rebuilt URL to: https://irchooky.org/
* Hostname was NOT found in DNS cache
* Connected to irchooky.org (151.101.65.195) port 443 (#0)
* successfully set certificate verify locations:
*   CAfile: none
  CApath: /etc/ssl/certs
* SSLv3, TLS handshake, Client hello (1):
* SSLv3, TLS handshake, Server hello (2):
* SSLv3, TLS handshake, CERT (11):
* SSLv3, TLS handshake, Server key exchange (12):
* SSLv3, TLS handshake, Server finished (14):
* SSLv3, TLS handshake, Client key exchange (16):
* SSLv3, TLS change cipher, Client hello (1):
* SSLv3, TLS handshake, Finished (20):
* SSLv3, TLS change cipher, Client hello (1):
* SSLv3, TLS handshake, Finished (20):
* SSL connection using ECDHE-RSA-AES128-GCM-SHA256
* Server certificate:
* 	 subject: CN=irchooky.org
* 	 start date: 2017-10-15 18:03:44 GMT
* 	 expire date: 2018-01-13 18:03:44 GMT
* 	 subjectAltName: irchooky.org matched
* 	 issuer: C=US; O=Let's Encrypt; CN=Let's Encrypt Authority X3
* 	 SSL certificate verify ok.
> GET / HTTP/1.1
> User-Agent: curl/7.35.0
> Host: irchooky.org
> Accept: */*
> 
< HTTP/1.1 301 Moved Permanently
* Server nginx is not blacklisted
< Server: nginx
< Content-Type: text/html; charset=utf-8
< X-Powered-By: Express
< Cache-Control: max-age=3600
< Strict-Transport-Security: max-age=31556926
< Location: https://disjoint.ca/projects/irc-hooky
< Content-Length: 53
< Accept-Ranges: bytes
< Date: Sun, 15 Oct 2017 21:33:45 GMT
< Via: 1.1 varnish
< Connection: keep-alive
< X-Served-By: cache-mdw17350-MDW
< X-Cache: HIT
< X-Cache-Hits: 1
< X-Timer: S1508103226.970407,VS0,VE0
< 
* Connection #0 to host irchooky.org left intact
Redirecting to https://disjoint.ca/projects/irc-hooky
```


[firebase-hosting]: https://firebase.google.com/products/hosting
[firebase-pricing]: https://firebase.google.com/pricing
[firebase-console]: https://console.firebase.google.com
