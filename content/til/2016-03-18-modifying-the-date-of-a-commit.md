---
author_twitter_username: marvinpinto
date: 2016-03-18T19:38:38-04:00
description: Modifying the date of a git commit
lastmod: 2016-11-04T15:07:00-04:00
meta_image: marvin-pinto-profile.jpg
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

If you would rather add a git alias to do this (and you totally should!),
here's what your **change date** (`git cd`) alias could look like ([credit
Stack Overflow](http://stackoverflow.com/a/23693336/1101070)):

``` text
[alias]
  cd = "!d=\"$(date -d \"$1\")\" && shift && \
    git diff-index --cached --quiet HEAD --ignore-submodules -- && \
    GIT_COMMITTER_DATE=\"$d\" git commit --amend -C HEAD --date \"$d\"" \
    || echo >&2 "error: date change failed: index not clean!"
```

Now to change the date of the last commit:

``` bash
git cd now  # update the last commit to the current time
git cd "1 hour ago"
git cd "Feb 1 12:33:00"
# ... etc
```

_I've Googled this more than I care to admit so throwing this here for
posterity_
