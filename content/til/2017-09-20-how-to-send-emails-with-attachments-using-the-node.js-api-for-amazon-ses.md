---
author_twitter_username: marvinpinto
date: 2017-09-20T16:29:36-04:00
description: How to send emails with attachments using the Node.js API for Amazon SES
lastmod: 2017-09-21T08:21:00-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - aws
  - nodejs
title: How to send emails with attachments using the Node.js API for Amazon SES
---

Sending a regular plain text or HTML email with SES is simple enough with the
AWS SDK for Javascript.

``` js
import SES from 'aws-sdk/clients/ses';

// ...

const ses = new SES();

return ses.sendEmail({
  Source: 'source@example.com',
  ReplyToAddresses: 'source@example.com',
  Destination: {
    ToAddresses: ['bob@example.com', 'jane@example.com'],
  },
  Message: {
    Subject: {
      Data: 'Sample SES message',
    },
    Body: {
      Text: {
        Data: 'Hey folks, this is a test message from SES',
      },
    },
  },
}).promise();

```

When you need to do anything fancier than that - for example sending an email
attachment - the `sendEmail` function no longer suffices; You need to use the
[sendRawEmail][ses-send-raw-email] function instead which takes a bit more
work.

With the `sendRawEmail` function you need to create the raw mime message
yourself which can get tedious. This is where the `mailcomposer` library is
useful.

``` js
import SES from 'aws-sdk/clients/ses';
import mailcomposer from 'mailcomposer';

// ...

return Promise.resolve().then(() => {
  let sendRawEmailPromise;

  const mail = mailcomposer({
    from: 'source@example.com',
    replyTo: 'source@example.com',
    to: 'bob@example.com',
    subject: 'Sample SES message with attachment',
    text: 'Hey folks, this is a test message from SES with an attachment.',
    attachments: [
      {
        path: '/tmp/file.docx'
      },
    ],
  });

  return new Promise((resolve, reject) => {
    mail.build((err, message) => {
      if (err) {
        reject(`Error sending raw email: ${err}`);
      }
      sendRawEmailPromise = this.ses.sendRawEmail({RawMessage: {Data: message}}).promise();
    });

    resolve(sendRawEmailPromise);
  });
});
```

The npm packages related to the above examples are:

``` bash
$ npm install aws-sdk mailcomposer
```

#### Tip: mailcomposer documentation

The documentation for the [mailcomposer][github-mailcomposer] API is located
under the version tag specific to the release. For example, the v4.0.1
documentation is available at
[github.com/nodemailer/mailcomposer/blob/v4.0.1/README.md][github-mailcomposer-401].

[ses-send-raw-email]: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendRawEmail-property
[github-mailcomposer]: https://github.com/nodemailer/mailcomposer
[github-mailcomposer-401]: https://github.com/nodemailer/mailcomposer/blob/v4.0.1/README.md
