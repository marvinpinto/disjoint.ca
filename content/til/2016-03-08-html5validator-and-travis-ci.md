---
date: 2016-03-08T13:52:48-05:00
tags:
  - travisci
  - html5validator
  - java
title: html5validator and Travis CI
meta_image: "https://s.gravatar.com/avatar/22784ea1769f025112c92c31321c6bf1?s=400"
---

Here's the situation. You would like to build a [Jekyll][2] (or other) static
website on Travis and validate it using the command-line [html5validator][3]
tool; all on Travis' [container infrastructure][1].

There's a hard requirement for Java 8 here since html5validator is essentially
a wrapper around [vnu.jar][4].

This is roughly what your `.travis.yml` file will look like:

``` yaml
language: 'ruby'
sudo: false
rvm:
  - '2.3.0'

jdk:
  - 'oraclejdk8'

install:
  - 'bundle install'
  - 'pip install --user html5validator'

script:
  - 'bundle exec rake test'
  - 'bundle exec rake build'
  - 'html5validator --root public/'
```

The `jdk` directive in the `.travis.yml` file is a wrapper around the
[jdk_switcher][5] tool, which makes switching between Java's quite painless!

[1]: https://docs.travis-ci.com/user/workers/container-based-infrastructure
[2]: https://jekyllrb.com
[3]: https://github.com/svenkreiss/html5validator
[4]: https://validator.github.io/validator
[5]: https://github.com/michaelklishin/jdk_switcher
