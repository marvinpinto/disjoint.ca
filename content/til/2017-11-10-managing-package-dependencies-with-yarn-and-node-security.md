---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-11-10T11:46:10-05:00
lastmod: 2017-11-10T11:46:10-05:00
title: "Managing package dependencies with Yarn and Node Security"
tags:
  - 'nodejs'
  - 'reactjs'
---

[Yarn][yarnpkg] has been a great alternative to [npm][npmjs] and we've been
using it at [Switchboard][switchboard-website] for quite a while.

You can get a bird's eye view of the packages that have updates available using
`yarn outdated`. As you might expect, it will check each dependency in your
`package.json` file for newer upstream versions.

{{< img src="2017-11-10-yarn-outdated.png" alt="yarn outdated" class="img-responsive">}}

From the above snippet you can see that there is a newer version of the
`aws-sdk` package. Yarn allows you to interactively step through your
dependencies and update packages individually. This is done via `yarn
upgrade-interactive --latest`, which also takes care of updating the version
numbers in your `package.json` file.

<script type="text/javascript" src="https://asciinema.org/a/9wVA33sNz7HW7N6hMmEKFN7i3.js" id="asciicast-9wVA33sNz7HW7N6hMmEKFN7i3" async></script>


### Transitive Dependencies

It is also a good idea to occasionally update your _transitive_ dependencies.
Yarn unfortunately does not have a straight-forward way of getting this done.
The "trick" here is to blow away your lockfile and do a fresh `yarn install`.

``` bash
$ rm yarn.lock && yarn install
```

This approach assumes that your `package.json` file is the source of truth for
your core dependencies and that it's updated whenever your core dependencies
are updated (using the technique mentioned initially).

<script type="text/javascript" src="https://asciinema.org/a/RNIYwtq9MljYICLcN7uoARkkY.js" id="asciicast-RNIYwtq9MljYICLcN7uoARkkY" async></script>

As always, test your app thoroughly between dependency updates to make sure
nothing breaks!


### Vulnerability Scanning

[Node Security][nsp] checks all your dependencies for known vulnerabilities and
also easily incorporates into your build/CI pipeline.
``` bash
$ yarn add --dev nsp nsp-preprocessor-yarn
```

Add it as a script target to your `package.json` file:
``` js
"scripts": {
  // ...
  "security-check": "nsp check --preprocessor yarn --reporter table"
},
```

Then run it locally or as part of your CI build using `yarn run
security-check`:

<script type="text/javascript" src="https://asciinema.org/a/1cnZpO3ldbPnO5LCFlvAGNlw9.js" id="asciicast-1cnZpO3ldbPnO5LCFlvAGNlw9" async></script>

You should ensure that your CI system runs this security check **at least once
a day**. If you need to temporarily add nsp exceptions, you can do so by adding
the advisory link URLs to your project's `.nsprc` file.

``` js
{
  "exceptions": [
    "https://nodesecurity.io/advisories/525",
    "https://nodesecurity.io/advisories/526",
    "https://nodesecurity.io/advisories/527",
    "https://nodesecurity.io/advisories/534",
    "https://nodesecurity.io/advisories/535"
  ]
}
```


[npmjs]: https://www.npmjs.com/
[yarnpkg]: https://yarnpkg.com
[switchboard-website]: https://goswitchboard.com
[nsp]: https://github.com/nodesecurity/nsp
