---
author_twitter_username: marvinpinto
date: 2017-09-21T09:59:27-04:00
description: Stashing work in progress
lastmod: 2017-10-04
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - git
title: Stashing work in progress
---

`git stash` is great for temporarily shelving changes you've made to your
working tree in order to move on to something else.

If you are familiar with how a (LIFO) stack works, you'll get a basic
understanding of how stashed changes are stored. Each `stash` operation
essentially adds the working change to the top of the stack.


### Viewing Stashed Content

**View the contents of the most recent stash:**
``` bash
$ git stash show -p
```

**List the file names in the most recent stash:**
``` bash
$ git stash show -p --name-only
```

**View the contents of the second most recent stash:**
``` bash
$ git stash show -p stash@{1}
```
Keep in mind here that numbering starts at `0`. Which means that `git stash
show -p stash@{0}` is the same as `git stash show -p`.

You may notice that `git stash show -p` **will not** list the contents of
untracked stashed files. Have a look at
[this](https://stackoverflow.com/a/12681856/1101070) Stack Overflow answer for
an explanation of how this works. To view the untracked stashed files:
``` bash
$ git show stash@{0}^3
```

**View the contents of a single file in the stash:**
``` bash
$ git show stash@{0} -- full/path/to/filename
```


### Creating or Modifying Stashes

**Stash only specific patch changes in your working tree:**
``` bash
$ git stash -p
```
Similarly, if you supply a file argument - e.g. `git stash -p file.txt` - it
will interactively walk you through stashing individual block changes for
`file.txt`.

**Stash everything including new (untracked) files in your working tree:**
``` bash
$ git stash -u
```

**Stash everything in your working tree that has not been staged:**
``` bash
$ git stash --keep-index
```

**Drop all the contents of your most recent stash:**
``` bash
$ git stash drop
```

**Bring back and re-apply your most-recent stash:**
``` bash
$ git stash pop
```

**Bring back and re-apply a single from from the stash:**
``` bash
$ git checkout stash@{0} -- full/path/to/filename
```

**Rename the message associated with a stash:**

In order for this to work, you first need to _drop_ the contents of the stash.
After dropping the contents of the stash, you can re-create the stash with your
new message.

Assuming your stash looks something like this:
``` bash
$ git stash list
stash@{0}: WIP on package-updates: 926957d Update a few of the local development libraries
stash@{1}: WIP on package-updates: 0404f22 Base dev package updates
```

Drop the stash item you wish to rename - I am choosing to drop the first item:
``` bash
$ git stash drop
Dropped refs/stash@{0} (bdff30c3331bd3fbab3d515691bcd8a2eadcb57b)
```

Now add it back with your updated message:
``` bash
$ git stash store -m "This is my updated message" bdff30c3331bd3fbab3d515691bcd8a2eadcb57b
```

You should now see the stash with your updated message:
``` bash
$ git stash list
stash@{0}: This is my updated message
stash@{1}: WIP on package-updates: 0404f22 Base dev package updates
```
