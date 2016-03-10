---
aliases:
  - '/posts/2016/02/28/using-a-serverless-architecture-to-deliver-irc-webhook-notifications/'
  - '/posts/2016/02/28/using-a-serverless-architecture-to-deliver-irc-webhook-notifications'
date: 2016-02-28
tags:
  - aws
  - lambda
  - serverless
  - irchooky
title: Using a Serverless Architecture to deliver IRC Webhook Notifications
---

In this blog post I would like to explore the concept of a _Serverless
Architecture_ and relate it back to a project that I have been working on --
[IRC Hooky][4].

If you're not entirely familiar with some of these concepts, this isn't a
problem at all! I will do my best to explain these moving pieces and how they
fit together.



### Serverless what?

In general, the notion of _serverless architecture_ refers to running
application code on infrastructure that is fully managed by other people.

What this means is that your application, and by extension _you_, do not need
to worry about the underlying infrastructure it is running on. In a model like
this, the application for the most part just assumes that it has the underlying
machine/network/infrastructure/scaling resources it needs and only concerns
itself with higher-order logic.

In a traditional Amazon world with EC2 instances and autoscaling groups, the
_physical_ hardware component has been abstracted out into virtual components,
but infrastructure and resources are very much still a thing that
the people using them need to actively manage.

_A serverless world promises to be this magical land where
network/infrastructure/scaling will **Just Work** and the only thing that will
be an application developer's concern is the application itself._



### The Bigger Picture

In April of last year, Amazon announced that [Lambda][1] was generally
available. It didn't seem like a big deal to me at the time as I couldn't
really think of interesting use-cases to experiment with.

I felt that Lambda (at that time) was not something that was relevant to most
people. I recall it was marketed as event-driven functions for things such as:

- Automatically processing files uploaded to S3
- Acting on specific CloudWatch events
- etc.

This wasn't very compelling to me. I recall thinking that this would be an
interesting use case for a "serverless cron" sort of system, but even that
lacked the scheduler aspect (keep in mind that [Unreliable Town Clock][2] was
not yet a thing).

#### Amazon Announced API Gateway

{{< figure class="img-responsive pull-right" src="https://s3.amazonaws.com/media.disjoint.ca/you-had-me-at-autoscaling.jpg" alt="You had me at autoscaling meme" >}}

Then in early July they announced another product called [API Gateway][3].
Among other things, it was now possible to trigger Lambda functions through API
Gateway HTTP calls.

The concept of a REST-backend powered by these Lambda functions was intriguing
to me!

- No machines to manage &#10004;
- Pay only for resources consumed &#10004;
- Boilerplate for HTTP (verb) endpoints &#10004;

I was smitten!



### Definitions

Cool. So let's explore what Lambda and API Gateway are all about.

> AWS Lambda lets you run code without provisioning or managing servers. You
> pay only for the compute time you consume
>
> -- [https://aws.amazon.com/lambda][1]

Lambda functions are designed to respond to one or more AWS events. They are
time-bound to 5 minutes and you only pay for the resources you consume. Lambda
currently supports writing functions in Java, Node.js, and Python. Having to
only pay for the resources you consume is compelling because you're
_incentivized to keep your functions lean in order to manage costs_.

> Amazon API Gateway is a fully managed service that makes it easy for
> developers to create, publish, maintain, monitor, and secure APIs at any
> scale.
>
> -- [https://aws.amazon.com/api-gateway][3]

The primary selling point for API Gateway is how easy it is to setup an
endpoint. You are given the ability to implement caching and basic API
throttling without much effort -- this is a far cry from having to setup an
nginx server and doing this yourself.



### Why does this matter

In a traditional machine leasing model, one has to pay for the time in which a
box is leased. This cost does not account for the fact that this box was idle
for 60% of that time (for example). Committing to leasing a box means that you
eat the cost of idle time.

The beauty of Lambda and API Gateway is that it makes this hosting model
somewhat obsolete.



### What is IRC Hooky

{{< figure class="img-responsive" src="https://s3.amazonaws.com/media.disjoint.ca/irc-hooky-brief-overview.png" alt="IRC Hooky brief overview" >}}

IRC Hooky is a framework for Lambda-driven IRC notifications. It currently
supports Webhook events from [Github][5] and [Hashicorp Atlas][6].

At its core, IRC Hooky is a web server that listens for incoming HTTP requests
and acts on them accordingly.

It was born out of my need to receive the the same sort of GitHub-notification
integration I was used to in Slack. This would have been immensely easier if
deployed on Heroku or a traditional EC2 instance but the ongoing cost of a
passive service like this (yes, even the $7.00/month) was not worth it to me.

And seriously what fun would that have been?!

_This felt like the perfect use-case for a Lambda/API Gateway driven backend!_



### How does it work

It basically works as follows:

- Internet service X performs a POST request on the IRC Hooky endpoint
- API Gateway receives this request and triggers the IRC Hooky Lambda function
- IRC Hooky Lambda function validates the payload, asynchronously sends the IRC
message, and returns a 200 (this 200 propagates back to the caller)

(More details available on the [IRC Hooky overview][8] page)

After IRC Hooky receives and processes the event, the resulting message will
look something this this in your IRC client:

```text
15:52:43 < irchooky> GitHub Pull Request "Quiet down the Travis build logs" opened by marvinpinto https://github.com/marvinpinto/kitchensink/pull/15
```



### How much does running this cost?

The economics of running IRC Hooky (or other Lambda functions) at scale is what
is most appealing about this architecture. To give you an idea of what this
means, here is a screenshot from the [Lambda pricing example][10] page.

{{< figure class="img-responsive" src="https://s3.amazonaws.com/media.disjoint.ca/lambda-pricing-screenshot.png" alt="Lambda pricing screenshot" >}}

128MB Lambda functions are allowed to consume ~889 hours per month (37 days)
without charge, along with the first million requests free. API Gateway, on
the other hand, charges $3.50 per million API calls, along with a a free-tier
of a million API calls per month (for the first 12 months).

What does all this mean?

For most folks, **IRC Hooky will happily survive on AWS' Lambda free-tier**.
The component here that will cost more than $0.00 per month is API Gateway
($0.0000035/request).

Estimating an exaggerated 100K API calls per month will ding you ~$0.35 (per
month) with API Gateway.

Pretty neat, huh!



{{< figure class="img-responsive pull-right" src="https://s3.amazonaws.com/media.disjoint.ca/empire-wants-you.jpg" alt="The empire wants you meme" >}}
### Get Involved!

So! If IRC Hooky sounds cool to you, I invite you to contribute in any way you
would like!

- Play with the [demo][17], get a feel for how this works
- Questions? [IRC and/or email][13] work best for me!
- Bugs? [Send 'em over][14]
- New backend? [Schweet!][15]
- Code/Documentation patches? [Shipit][15]



### Parting Thoughts

I think that Lambda functions and other forms of serverless architecture will
have their place in our infrastructure. It will be another tool we'll use to
abstract out logic and reduce costs (complexity or otherwise).

We have a long way to go before this becomes mainstream but given the
innovation thus far by Amazon and other companies in this space (like
[Google][19]), I'm excited about the possibilities!

[1]: https://aws.amazon.com/lambda
[2]: https://alestic.com/2015/05/aws-lambda-recurring-schedule
[3]: https://aws.amazon.com/api-gateway
[4]: https://irchooky.org
[5]: https://irchooky.org/github.html
[6]: https://irchooky.org/atlas.html
[8]: https://irchooky.org/overview.html
[9]: https://aws.amazon.com/api-gateway/pricing
[10]: https://aws.amazon.com/lambda/pricing
[13]: {{< relref "page/about.md" >}}
[14]: https://github.com/marvinpinto/irc-hooky/issues
[15]: https://github.com/marvinpinto/irc-hooky/pulls
[17]: https://irchooky.org/demo.html
[19]: https://cloud.google.com/functions
