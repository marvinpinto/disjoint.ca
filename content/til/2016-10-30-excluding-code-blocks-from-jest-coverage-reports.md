---
author_twitter_username: marvinpinto
date: 2016-10-30T10:49:03-04:00
description: Excluding code blocks from Jest coverage reports
lastmod: 2016-10-30T10:49:03-04:00
meta_image: images/marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - reactjs
  - jest
  - istanbul
title: Excluding code blocks from Jest coverage reports
---

I realized recently after poking around in the source code that [Jest][1] uses
[Istanbul][2] under the hood to generate its code coverage report (via the
`--coverage` option). This is useful for situations where you need to
legitimately ignore blocks or lines from coverage reports.

Basically, the _magic comment_ that makes this all work is:

``` javascript
/* istanbul ignore next */
```

Let's say for example you needed to ignore the following
`dispatch(actions.initiateRequest(data))` call from your coverage report as
it's not very practical to test this code-path in redux. Here's what that might
look like.

``` javascript
function mapDispatchToProps(dispatch) {
  return {
    onSubmitFunction: function(data) {
      /* istanbul ignore next */
      return dispatch(actions.initiateRequest(data));
    }
  };
}
```

Simple as that! The general form of this magic comment looks something like:

``` javascript
/* istanbul ignore <word>[non-word] [optional-docs] */
```

The Istanbul project site has some [very detailed documentation][3] explaining
this and other use-cases, read through there for how the `ignore if` and
`ignore else` options work too!

[1]: https://facebook.github.io/jest
[2]: https://github.com/gotwarlost/istanbul
[3]: https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md
