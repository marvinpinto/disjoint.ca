---
date: 2016-03-08T11:40:58-05:00
tags:
  - travisci
  - ruby
title: Travis CI, Ruby, and Deployments
meta_image: "images/marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
---

The situation is roughly this. You have a Ruby project you would like to build
on Travis' [container infrastructure][1] and this project gets deployed using a
gem. Let's assume you'll be using Ruby 2.3.0 along with the `s3_website` gem
for deployment.

Your `.travis.yml` file will start out looking something like this.

``` yaml
language: 'ruby'
sudo: false
rvm:
  - '2.3.0'

install:
  - 'bundle install'

script:
  - 'bundle exec rake test'
  - 'bundle exec rake build'

deploy:
  provider: 'script'
  script: 'bundle exec s3_website push'
  skip_cleanup: true
```

When you get to the deployment phase, you'll notice your build errors out with:

``` text
Script bundle exec s3_website push failed with status 127
failed to deploy
```

(`status 127` is linux for "command not found")

Then you might try manually installing the `s3_website` gem in a
`before_deploy` phase in an attempt to directly invoke it:

``` yaml
before_deploy:
  - 'gem install s3_website'

deploy:
  provider: 'script'
  script: 's3_website push'
  skip_cleanup: true
```

Which will error out with:

``` text
Script s3_website push failed with status 127
```

**What is happening here?**

The `deploy` section of a Travis CI build basically resets the Ruby version
back to the system default (currently 1.9.3). More to the point, the [rvm
environment gets unset][2] and thus any gems that were installed using `bundle
install` will need to be [invoked explicitly][3].

Here's an example of what that looks like:

``` yaml
deploy:
  provider: 'script'
  script: 'PATH="${TRAVIS_BUILD_DIR}/bin:$PATH" rvm "$TRAVIS_RUBY_VERSION" do bundle exec s3_website push'
  skip_cleanup: true
```

(note that you no-longer need the `before_deploy` section using the above
example)

[1]: https://docs.travis-ci.com/user/workers/container-based-infrastructure
[2]: https://github.com/travis-ci/travis-ci/issues/5205
[3]: https://github.com/travis-ci/docs-travis-ci-com/pull/441
