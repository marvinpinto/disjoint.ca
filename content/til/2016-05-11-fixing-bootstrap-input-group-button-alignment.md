---
author_twitter_username: 'marvinpinto'
date: 2016-05-11T16:48:42-04:00
description: How to set bootstrap number precision in Ember CLI
lastmod: 2016-05-11T16:48:42-04:00
meta_image: "marvin-pinto-profile.jpg"
meta_image_height: 700
meta_image_width: 700
tags:
  - emberjs
  - bootstrap
  - sass
title: Fixing Bootstrap input-group button alignment
---

If you run into a situation where your `input-group` buttons aren't quite
properly aligned (using `bootstrap-sass`), you very likely need to set the
`precision` value to 10 (default is 5).

Let's look at an example of what this looks like.

``` html
<div class="input-group">
  <div class="input-group-btn">
    <button type="button" class="btn btn-default">Send</button>
  </div>
  <input type="text" class="form-control" placeholder="Enter stuff here">
</div>
```

Assuming an `input-group` that looks like something like the example, you will
notice that the height of the **Send** button is slightly shorter than that of
input field.

{{< img src="2016-05-11-bootstrap-button-before.jpg" alt="Bootstrap Alignment Before" class="img-responsive">}}

To fix this in Ember, set the appropriate `precision` value in
`ember-cli-build.js`:

``` js
module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // ...
    sassOptions: {
      precision: 10
    }
    // ...
  });
  // ...
  return app.toTree();
};
```

Your result will look something like:

{{< img src="2016-05-11-bootstrap-button-after.jpg" alt="Bootstrap Alignment After" class="img-responsive">}}

Much better!

_If you need to set the precision using something other than ember-cli, start
by reading through some of the linked commits on [this GitHub
issue](https://github.com/twbs/bootstrap-sass/issues/409)._
