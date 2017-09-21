---
author_twitter_username: marvinpinto
date: 2017-09-21T09:59:27-04:00
description: Stashing work in progress
lastmod: 2017-09-21T09:59:27-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - git
title: Stashing work in progress
---

`git stash` is great for temporary shelving changes you've made to your working
tree so that you can move on to something else and get back to these changes
later.

If you're familiar with how a (LIFO) stack works, you'll get a basic
understanding of how stashed changes are stored. Each `stash` operation
essentially adds the working change to the top of the stack.

**To bring back and re-apply your most-recent stash:**
``` bash
$ git stash pop
```

**To view the most recent stash without applying it:**
``` bash
$ git stash show -p
```

**To list the file names modified in the most recent stash:**
``` bash
$ git stash show -p --name-only
```

**To view the second most recent stash without applying it:**
``` bash
$ git stash show -p stash@{1}
```
Keep in mind here that numbering starts at `0`. Which means that `git stash
show -p stash@{0}` is the same as `git stash show -p`.

**To stash only specific patch changes in your working tree:**
``` bash
$ git stash -p
```
Similarly, if you supply a file argument - e.g. `git stash -p file.txt` - it
will interactively walk you through stashing individual block changes for
`file.txt`.

**To stash all the untracked files in your working tree:**
``` bash
$ git stash -u
```
