---
date: 2016-03-22T08:12:27-04:00
tags:
  - emberjs
  - eslint
title: Using ESLint within an EmberJS app
---

Here's what you'll need in your Ember app:

``` bash
npm install --save-dev babel-eslint eslint estraverse estraverse-fb eslint-config-google
```

This is a basic `.eslintrc` you can use to get going. Tweak the [rules][1] to
your liking -- this particular one starts with the very reasonable [Google
Style Guide][2].

``` js
{
  "extends": "google",
  "parser": "babel-eslint",
  "rules": {
    "require-jsdoc": 0
  }
}
```

You now have the option of either invoking `eslint` directly:

``` bash
$(npm bin)/eslint app/
$(npm bin)/eslint tests/
```

Or via npm:

``` bash
npm run eslint-app
npm run eslint-tests
```

Note that you'll need to update the `scripts` section of your `package.json`
file in order for the latter to work:

``` js
"scripts": {
   // ...
   "eslint-app": "eslint app/",
   "eslint-tests": "eslint tests/"
 },
```

Happy Linting! <i class="fa fa-thumbs-o-up"></i>


[1]: http://eslint.org/docs/user-guide/configuring#configuring-rules
[2]: https://github.com/google/eslint-config-google
