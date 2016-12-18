---
date: 2016-03-29T14:55:22-04:00
tags:
  - emberjs
  - s3
title: Hosting an Ember app in S3 and Cloudfront
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
---

Hosting an Ember app on S3 can be slightly challenging since routes (paths)
aren't mapped to actual files and so S3 gets quite confused. Here are a few
ways to make this work.

In your Ember app, enable the [autolocation][1] feature in `app/router/js`:

``` js
import Ember from 'ember';

// ...

Router.reopen({
  location: 'auto'
});

// ...

export default Router;
```

In your S3 website bucket, set the **Redirection Rules** to be the following:

``` xml
<RoutingRules>
    <RoutingRule>
        <Condition>
            <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
        </Condition>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>app.example.com</HostName>
            <ReplaceKeyPrefixWith>#/</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>
```

The main assumption here is that your Ember app will be served off
`https://app.example.com`. These changes should kick in whenever your
Cloudfront cache expires or an invalidation occurs.

What will happen is that whenever someone goes to
`https://app.example.com/frontpage`, they will get 301 redirected to
`https://app.example.com/#/frontpage`, which Ember will take and do the right
thing.

The extra redirection can be slightly ugly but for some use cases it beats
standing up a web server with apache/nginx/etc _just_ to host a static Ember
app.

[1]: http://emberjs.com/api/classes/Ember.Location.html#toc_autolocation
