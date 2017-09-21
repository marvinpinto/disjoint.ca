---
author_twitter_username: marvinpinto
date: 2017-09-21T10:57:28-04:00
description: Remove untracked files from the local working tree
lastmod: 2017-09-21T10:57:28-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - git
title: Remove untracked files from the local working tree
---

It is sometimes useful to get rid of all the cruft you've built up locally
without manually going in and deleting files individually. Here's how to get
that done with built-in `git` functions.

**To list what will be deleted without actually deleting it:**
``` bash
$ git clean -n
```

**To delete all your local untracked files:**
``` bash
$  git clean -f
```

**To delete all untracked files & directories:**
``` bash
$  git clean -fd
```

This [Stack Overflow answer](https://stackoverflow.com/a/64966/1101070) was
useful and provides a bit more context.
