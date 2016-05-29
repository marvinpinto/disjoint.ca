---
author_twitter_username: 'marvinpinto'
date: 2016-05-11T18:09:46-04:00
description: Trying to use Font Awesome icons as placeholder text in an input field for the most part does not work by default. Here's how to make this work!
lastmod: 2016-05-11T18:09:46-04:00
meta_image: "images/marvin-pinto-profile.jpg"
meta_image_height: 700
meta_image_width: 700
tags:
  - fontawesome
  - emberjs
  - css
title: Using Font Awesome icons as placeholder text in an input field
---

Trying to use Font Awesome icons as placeholder text in an input field for the
most part does not work by default.

Let's assume you have an input field that looks something like:

``` html
<input type="text" class="form-control" placeholder="&amp;#xf02c; Filter by tags">
```

This ends up looking something like:

<img src="/images/2016-05-11-placeholder-text-input-before.jpg" alt="Placeholder text before" class="img-responsive">

Which is really not what we expect. Here's how to make this work!

Add `FontAwesome` to the `font-family` for the specified CSS class
(`form-control` in this example).

``` css
.form-control {
  font-family: "FontAwesome"
}
```

Keep in mind that you probably want to **append** `FontAwesome` to the
`font-family`, instead of **overriding** it completely. If you use sass,
something along the lines of this works beautifully.

``` text
.form-control {
  font-family: append($font-family-sans-serif, "FontAwesome", "comma")
}
```

Now this is much better looking input box!

<img src="/images/2016-05-11-placeholder-text-input-after.jpg" alt="Placeholder text after" class="img-responsive">

**Ember JS**

In Ember, the above example used as-is in a template will generally do the
right thing.

The caveat here is that this _will not_ work correctly inside an Ember
component. For example, the following will not do what you expect:

``` text
{{
  text-input
  placeholder="&amp;#xf02c; Filter by tags"
}}
```

The reason being because Ember html-escapes the unicode text which results in
`"&#xf02c; Filter by tags"` as the placeholder text instead.

To work around this, set a variable in the controller (`users` in this example)
and use that variable as input when instantiating the Ember component.

For example, in `app/controllers/users.js`

``` js
import Ember from 'ember';

export default Ember.Controller.extend({
  // ...
  fontAwesomePlaceHolder: "\uf02c Filter by tags",
  // ...
});
```

Use this variable as follows:

``` text
{{
  text-input
  placeholder=fontAwesomePlaceHolder
}}
```

That's all there is to it, enjoy!
