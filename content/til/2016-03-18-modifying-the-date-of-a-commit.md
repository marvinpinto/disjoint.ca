---
date: 2016-03-18T19:38:38-04:00
tags:
  - git
title: Modifying the date of a commit
---

To change the date of the most recent commit to `now`:

``` bash
git commit --amend --date "`date`"
```

You can of course specify a specific commit date:

``` bash
git commit --amend --date="Wed Feb 16 14:00 2011 +0100"
```

_I've Googled this more than I care to admit so throwing this here for
posterity_
