---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-10T14:10:33-04:00
lastmod: 2017-10-10T14:10:33-04:00
title: "Incorporating prettier into your development workflow"
tags:
  - 'nodejs'
  - 'prettier'
---

[Prettier][prettier] is a JavaScript code formatter that supports many newer
language features such as ES2017, JSX, TypeScript, and others. It's great
because you end up with a much more consistent codebase and not have to worry
about formatting. The author of that package wrote a very detailed blog post
explaining all the benefits and I highly recommend you [check it
out!][prettier-blog-post]. You can also try it out in the [prettier
playground][prettier-playground] to get a feel for how it works.

Like other cli-tools, you have the option of installing it globally or locally
- I prefer the latter as it gives me more control over version upgrades as well
as a more consistent experience for all developers of the codebase.
``` bash
$ yarn add --dev prettier
```

Prettier uses [cosmoconfig][cosmoconfig] for config file support which means it
supports using `package.json` to store your configuration. This is the
`prettier` section of the package.json file we currently use at
[Switchboard][switchboard-website]:
``` js
"prettier": {
  "trailingComma": "es5",
  "bracketSpacing": false,
  "singleQuote": true,
  "printWidth": 120
}
```

Your repository structure will be unique and it is a good idea to make it
easier for your developers to run prettier. In JavaScript projects, npm scripts
are the ideal place for these kind of "makefile style" targets.

We use the following `prettier` target for Switchboard (in package.json):
``` js
"scripts": {
  // ...
  "prettier": "prettier --write \"{frontend,backend,website/assets/js}/**/*.js\""
},
```

(Switchboard uses a monorepo structure which is the reason for that zany [file
 glob][node-glob-primer]!)

The script target allows a developer to run `yarn run prettier` and not have to
worry about supplying & escaping globs on the command line.

Of course all this tooling is moot if developers don't actually run prettier
(hey sometimes we forget!). There are integrations available for common IDEs
such as [vim][vim-prettier], [emacs][prettier-emacs], and
[sublime][sublime-prettier].

There is also the option of running the `prettier` command as a post-commit
hook locally. This has the downside of needing all your developers to add this
post-commit hook to their local checked-out repos, and unfortunately you still
don't really have a way of verifying the final output.

I am personally a fan of **option 3** - validating that `prettier` was run by
the developer during the CI build. This takes a bit of the belt-and-suspenders
approach by allowing developers to choose whatever system works for them
locally, but validating the result centrally.

This is where the `prettier-check` cli-tool comes in handy.
``` bash
$ yarn add --dev prettier-check
```

This tool proxies all supplied arguments into prettier which makes it perfect
for enforcing a consistent codebase!

Create a new target to validate that prettier was run by the developer in
package.json.
``` js
"scripts": {
  // ...
  "prettier": "prettier --write \"{frontend,backend,website/assets/js}/**/*.js\"",
  "prettier-check": "prettier-check \"{frontend,backend,website/assets/js}/**/*.js\""
},
```

On your CI system, `yarn run prettier-check` will now fail your build if
prettier was not by the developer on the checked-in code!

This setup has an interesting side-effect of enforcing repository-specific
prettier settings. I'll demonstrate this with an example. Using the config we
described above, suppose you ran the following command:
``` bash
$ `npm bin`/prettier --no-config --write "{frontend,backend,website/assets/js}/**/*.js"
```

You would find that a subsequent invocation of `yarn run prettier-check` will
fail your build even though prettier was run. The reason of course is that
**prettier was not run with the repository-specific settings and is therefore
invalid.**

The point I'm trying to demonstrate is that having a validation step on your CI
system enforces a much more consistent codebase and keeps things simpler.

[prettier]: https://github.com/prettier/prettier
[prettier-playground]: https://prettier.io/playground
[cosmoconfig]: https://github.com/davidtheclark/cosmiconfig
[switchboard-website]: https://goswitchboard.com
[vim-prettier]: https://github.com/prettier/vim-prettier
[prettier-emacs]: https://github.com/prettier/prettier-emacs
[sublime-prettier]: https://packagecontrol.io/packages/JsPrettier
[prettier-blog-post]: http://jlongster.com/A-Prettier-Formatter
[node-glob-primer]: https://github.com/isaacs/node-glob/blob/master/README.md#glob-primer
