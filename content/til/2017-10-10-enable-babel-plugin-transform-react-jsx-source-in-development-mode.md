---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-10T11:53:06-04:00
lastmod: 2017-10-10T11:53:06-04:00
title: "Enable babel-plugin-transform-react-jsx-source in development mode"
tags:
  - 'reactjs'
  - 'babel'
  - 'webpack'
---

The `babel-plugin-transform-react-jsx-source` [babel
plugin][babel-plugin-website] is very useful in development mode because it
makes it easier for you to debug component stack traces.

<br/><br/>

To give you an idea of what the _before_ and _after_ looks like ([original
source][transform-react-jsx-source-info]):

**Before:**
{{< img src="2017-10-10-babel-plugin-transform-react-jsx-source-before.jpg" alt="Component stack traces before image" class="img-responsive">}}

**After:**
{{< img src="2017-10-10-babel-plugin-transform-react-jsx-source-after.jpg" alt="Component stack traces before image" class="img-responsive">}}

It is recommended that this **only be enabled in development mode**. I am going
to walk you through setting it up with webpack.

First install the plugin and add it to your package tree.
``` bash
$ yarn add --dev babel-plugin-transform-react-jsx-source
```

In your webpack.config.js create a function that conditionally loads the
`transform-react-jsx-source` plugin depending on whether or not this is a
production build. The `babelPlugins` function we use for this purpose (at
[Switchboard][switchboard-website]) looks something like:
``` js
const babelPlugins = () => {
  let plugins = [];

  plugins.push([
    'transform-imports',
    {
      'redux-form': {
        transform: 'redux-form/es/${member}',
        preventFullImport: true,
      },
      'react-router': {
        transform: 'react-router/es/${member}',
        preventFullImport: true,
      },
      'react-router-dom': {
        transform: 'react-router-dom/es/${member}',
        preventFullImport: true,
      },
      lodash: {
        transform: 'lodash-es/${member}',
        preventFullImport: true,
      },
    },
  ]);

  if (process.env.NODE_ENV !== 'production') {
    plugins.push(['transform-react-jsx-source']);
  }

  return plugins;
};
```

Then add the above plugins to the `babel-loader` section of your webpack config
file.
``` js
loader: 'babel-loader',
options: {
  presets: [...],
  // ...
  plugins: babelPlugins(),
  cacheDirectory: true,
},
```

That's all there is to it!

[transform-react-jsx-source-info]: https://github.com/aspnet/JavaScriptServices/issues/739#issue-212256474
[switchboard-website]: https://goswitchboard.com
[babel-plugin-website]: https://babeljs.io/docs/plugins/transform-react-jsx-source
