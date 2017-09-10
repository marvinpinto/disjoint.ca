---
date: "2015-11-15"
lastmod: "2017-08-28"
title: "\uf1b3 About Me"
keywords:
  - "marvinpinto"
  - "about"
  - "website"
  - "blog"
  - "contact"
menu: "main"
---

<i class="fa fa-hand-peace-o"> Hello, I'm Marvin!</i>

{{< img src="marvin-pinto-profile.jpg" alt="Marvin Pinto" height="135" width="135" class="img-responsive img-rounded pull-right">}}

I'm a software developer who lives and works in the beautiful [City of
Toronto][2]. I started my own company a little while back as part of shipping a
side project I've been working on - [Switchboard][switchboard] (more info
below). If you're looking for a consultant or to fill a full-time
development role, get in touch! I'm always up to chat.

Here's where you can find me on the Internet:

- <a href="https://twitter.com/marvinpinto"><i class="fa fa-twitter"> @marvinpinto</i></a>
- <a href="https://github.com/marvinpinto"><i class="fa fa-github"> marvinpinto</i></a>
- <i class="fa fa-comment-o"> marvinpinto</i> ([IRC Freenode][5])
- <i class="fa fa-envelope-o"> hello@pinto.im</i>
- <a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x52654E6EB0BB564B"><i class="fa fa-id-badge"> 0x52654E6EB0BB564B</i></a> (PGP Key ID)
- <a href="https://keybase.io/marvinpinto"><i class="fa fa-key"> marvinpinto</i></a> (Keybase)



### <i class="fa fa-graduation-cap"></i> Recent Projects

- **Ledger Reconciler** is a Node.js command-line tool to automatically
download and reconcile your [Ledger][ledger-cli] financial entries. It uses
[Headless Chrome][headless-chrome] and the [puppeteer][puppeteer] library to
automate the task of logging into all your bank accounts and reconciling your
transactions.
[https://disjoint.ca/projects/ledger-reconciler][ledger-reconciler]

- **Switchboard** is a webapp built to give people full control over their
internet-based phone number. It allows people to control exactly when and how
they are interrupted, along with regular phone-like features people have come
to expect (push messaging, call forwarding, and so on).

    The backend is a NodeJS application powered by a few AWS & Google services:
    Lambda, API Gateway, DynamoDB, S3, Cognito, Firebase, and others. The
    frontend is a single-page-app written in React.
    [https://goswitchboard.com][switchboard]

- **Charlesbot** is a modular Slackbot written using Python 3's asyncio
framework. It was designed to be self-deployed and easily extendible (via the
plugin system). More information to come! For now, read up some more on
[charlesbot.org][8] and follow along its development at <a
href="https://github.com/marvinpinto/charlesbot"><i class="fa fa-github">
marvinpinto/charlesbot</i></a>.

- **IRC Hooky** makes it easy to send custom webhook-triggered notifications to
IRC using an entirely serverless architecture. Read more about it at
[irchooky.org][9] and the article I wrote titled [Using a Serverless
Architecture to deliver IRC Webhook Notifications][10].



### <i class="fa fa-pencil-square-o"></i> Errata

The source code and content for this website both live in the <a
href="https://github.com/marvinpinto/disjoint.ca"><i class="fa fa-github">
marvinpinto/disjoint.ca</i></a> repository on GitHub. If you spot any mistakes
or catch me in an outright lie I'd love to [hear from you][4] <i class="fa
fa-thumbs-o-up"></i>



### <i class="fa fa-bullhorn"></i> Credits

- **TIL Section**: This idea was very much inspired by [des4maisons][11] and
[jbranchaud][12]'s TIL repositories on GitHub. My hope is that indexers pick
this up and it becomes helpful to other people as well.

- **Front page banner**: The original image for this lovely banner was borrowed
from the gallery at [unsplash.com][14], which [des4maisons][13] then took over
and made even more awesome!

- **Logo**: The logo for the disjoint.ca website was borrowed and adapted from
the wonderful folks at [Fairpixels][16] (via [logodust.com][15]). Look them up
for your logo needs!

- **Hugo Static Site Generator**: Can't forget to mention that this site itself
was developed using [Hugo][3] - A Fast & Modern Static Website Engine.



### <i class="fa fa-paw"></i> Lady

{{< img src="derpy-lady.jpg" class="img-responsive img-rounded pull-left" alt="Derpy Lady the Dog">}}

And last but not least this here is my derpy dog Lady! She is very awkward for
her age and completely adorable. We rescued her as a puppy from a shelter in
Ontario called [Blue Collared Canines][6] and she's been a delightful addition
to our family ever since.

If you follow me on Twitter I promise to stop tweeting about techy stuff and
stick to [doggy pictures only][1] <i class="fa fa-hand-spock-o"></i>



[1]: https://twitter.com/search?q=Lady%20OR%20dog%20from%3Amarvinpinto
[2]: https://www.google.com/search?tbm=isch&q=toronto+streets
[3]: https://gohugo.io
[4]: https://github.com/marvinpinto/disjoint.ca/issues
[5]: https://webchat.freenode.net
[6]: https://www.facebook.com/BlueCollaredCanines
[8]: https://charlesbot.org
[9]: https://irchooky.org
[10]: {{< relref "writing/2016-02-28-serverless-irc-notifications.md" >}}
[11]: https://github.com/des4maisons/til
[12]: https://github.com/jbranchaud/til
[13]: https://twitter.com/des4maisons
[14]: https://unsplash.com
[15]: http://www.logodust.com
[16]: http://fairpixels.co
[switchboard]: https://goswitchboard.com
[ledger-cli]: http://ledger-cli.org/
[headless-chrome]: https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
[puppeteer]: https://github.com/GoogleChrome/puppeteer
[ledger-reconciler]: https://disjoint.ca/projects/ledger-reconciler
