---
author_twitter_username: marvinpinto
date: 2017-09-21T11:50:12-04:00
description: Working with vim split windows
lastmod: 2017-09-21T11:50:12-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - vim
title: Working with vim split windows
---

Vim split windows are very useful for folks who use vim as their primary IDE.
You get the advantage of multiple windows in a single terminal without needing
to use tmux or screen.

Split windows along with [vim file explorer][vim-file-explorer] give you the
advantage of a shared buffer among all open files, so copy/pasting and such
becomes a lot simpler.

**To split a window horizontally along the `x` axis:**
``` text
:vs
```

**To split a window vertically along the `y` axis:**
``` text
:sp
```

**To split a window horizontally and open file explorer:**
``` text
:Vex
```

**To split a window vertically and open file explorer:**
``` text
:Sex
```

**To set or adjust the height of a window:**
``` text
:res 60  # resizes the height to 60 rows
:res +5  # increases the current height by 5 rows
:res -5  # decreases the current height by 5 rows
```

**To set or adjust the width of a window:**
``` text
:vertical res 60  # resizes the width to 60 columns
:vertical res +5  # increases the current width by 5 columns
:vertical res -5  # decreases the current width by 5 columns
```

**To reset all window dimensions based on their splits:**
``` text
Ctrl+w =
```

[vim-file-explorer]: {{< relref "til/2016-03-08-vim-file-explorer.md" >}}
