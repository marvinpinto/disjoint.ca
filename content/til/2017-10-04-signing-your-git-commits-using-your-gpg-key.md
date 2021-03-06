---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-04T11:54:50-04:00
lastmod: 2017-10-04T15:19:00-04:00
title: "Signing your git commits using your gpg key"
tags:
  - 'git'
  - 'gpg'
---

If you need to sign your git commits with your gpg key, hardware security keys
such as Yubikey make this much easier to deal with.

If you haven't already set it up, you might need to set your global git GPG ID
using:
``` bash
$ git config --global user.signingkey AABBCCDD
```

**To find your own GPG ID:** (e.g. my GPG ID is `52654E6EB0BB564B`)
``` bash
$ gpg --list-keys
/home/marvin/.gnupg/pubring.gpg
-------------------------------
pub   4096R/52654E6EB0BB564B 2016-12-13
uid                          Marvin Pinto <marvin@pinto.im>
uid                          Marvin Pinto (git) <git@pinto.im>
sub   2048R/E6217759DCE2D478 2016-12-13 [expires: 2017-12-13]
sub   2048R/26515E9EF2D0033C 2016-12-13 [expires: 2017-12-13]
sub   2048R/F705991D14C837D5 2016-12-13 [expires: 2017-12-13]
```

**To gpg-sign and commit your changes at the same time:**
``` bash
$ git commit -v -S -s
```
This will also automatically add a `Signed-off-by: Your Name
<email@example.com>` line to your commit message.

**To gpg-sign the most recent commit without editing:**

``` bash
$ git commit --amend --no-edit -S -s
```

**To view which commits are signed in a commit tree:**
``` bash
$ git log --graph --pretty=format:"%C(yellow)%h %Creset%C(cyan)%G?%Creset %C(green)%ae%Creset %<(80,trunc)%s"
* 2533f82 G git@example.com Example of a signed commit
* b96235a N git@example.com Unsigned commit
* 8655782 N git@example.com Unsigned commit
```

**Starting from the most recent, non-interactively sign all the commits up to
and including SHA:**
``` bash
$ git rebase --exec 'git commit --amend --no-edit -S -s' SHA
```

This is useful because it allows you to go back and sign all the commits on
your working branch. Using the [git alias I setup][signall-alias-commit] as an
example, `git signall my-dev-branch` would gpg-sign each and every commit on
the `my-dev-branch` branch.

Browse through [my global gitconfig aliases][marvin-gitconfig] for more ideas
on optimizing your git workflow!

[signall-alias-commit]: https://github.com/marvinpinto/laptop/commit/3bd321461a27151a362edc694a6bc4486dd8f869
[marvin-gitconfig]: https://github.com/marvinpinto/laptop/blob/master/roles/git/files/gitconfig
