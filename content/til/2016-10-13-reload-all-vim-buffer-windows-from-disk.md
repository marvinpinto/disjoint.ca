---
author_twitter_username: marvinpinto
date: 2016-10-13T10:00:52-04:00
description: Short description
lastmod: 2016-10-13T10:00:52-04:00
meta_image: images/marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
- vim
title: Reload all vim buffer windows from disk
---

**This tip is useful for folks who rely on the split-window feature of vim.**

Open files in vim buffers sometimes get modified outside the context of vim,
for example in git operations (rebasing, etc). This inevitably leads to
stale buffers and the dreaded warning:

``` text
"test.txt"
WARNING: The file has been changed since reading it!!!
Do you really want to write to it (y/n)?
```

One simple way to work around this is to switch to each window and run `e!`
manually, which reloads the file from disk. This of course can be quite cumbersome for
many buffers, which leads us to:

``` text
:windo e!
```

That command basically runs `e!` on each open (vim) window and aggregates the
result into something like:

``` text
"file1" 195L, 6288C
"file2" 100L, 82C
"test.txt" 10L, 44C
Press ENTER or type command to continue
```

Remember that the `!` in that command will throw away any unsaved changes so if
you prefer to confirm before overwriting changes, you probably want to use
`:windo e` instead.

([Source](http://stackoverflow.com/a/3771720/1101070))
