---
author_twitter_username: marvinpinto
date: 2016-03-18T19:38:38-04:00
description: Modifying the date of a git commit
lastmod: 2016-10-29T12:10:52-04:00
meta_image: images/marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - git
title: Modifying the date of a commit
---

To change the date of the most recent commit to `now`:

``` bash
GIT_COMMITTER_DATE="`date`" git commit --amend --date "`date`"
```

You can of course specify a specific commit date:

``` bash
MYDATE="Wed Feb 16 14:00 2016 -0400" GIT_COMMITTER_DATE="$MYDATE" git commit --amend --date "$MYDATE"
```

Another helpful tip for when you need to use a different date _while committing_
(i.e. in non-rebase mode):

``` bash
MYDATE="Wed Feb 16 14:00 2016 -0400" GIT_AUTHOR_DATE="$MYDATE" GIT_COMMITTER_DATE="$MYDATE" git commit
```

_I've Googled this more than I care to admit so throwing this here for
posterity_
