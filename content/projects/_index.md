---
date: 2017-09-22
lastmod: 2017-09-22
title: Recent Projects
---

#### Ledger Reconciler

[Ledger Reconciler][ledger-reconciler] is a Node.js command-line tool to
automatically download and reconcile your [Ledger][ledger-cli] financial
entries. It uses [Headless Chrome][headless-chrome] and the
[puppeteer][puppeteer] library to automate the task of logging into all your
bank accounts and reconciling your transactions -
[https://disjoint.ca/projects/ledger-reconciler][ledger-reconciler] <br/><br/>


#### Switchboard

[Switchboard][switchboard] is a webapp built to give people full control over
their internet-based phone number. It allows people to control exactly when and
how they are interrupted, along with regular phone-like features people have
come to expect (push messaging, call forwarding, and so on).

The backend is a Node.js application powered by a few AWS & Google services:
Lambda, API Gateway, DynamoDB, S3, Cognito, Firebase, and others.  The frontend
is a single-page-app written in React -
[https://goswitchboard.com][switchboard] <br/><br/>


#### Charlesbot

[Charlesbot][charlesbot] is a modular Slackbot written using Python 3's asyncio
framework. It was designed to be self-deployed and easily extendible via the
plugin system - [https://charlesbot.org][charlesbot] <br/><br/>


#### IRC Hooky

[IRC Hooky][irchooky] makes it easy to send custom webhook-triggered
notifications to IRC using a serverless architecture. Read more about it at
[https://irchooky.org][irchooky] and the article I wrote: [Using a Serverless
Architecture to deliver IRC Webhook Notifications][serverless-irc-blog-post].


[ledger-cli]: http://ledger-cli.org/
[puppeteer]: https://github.com/GoogleChrome/puppeteer
[headless-chrome]: https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
[ledger-reconciler]: https://disjoint.ca/projects/ledger-reconciler
[charlesbot]: https://charlesbot.org
[serverless-irc-blog-post]: {{< relref "writing/2016-02-28-serverless-irc-notifications.md" >}}
[switchboard]: https://goswitchboard.com
[irchooky]: https://irchooky.org
