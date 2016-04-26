---
date: 2016-03-08T13:33:42-05:00
tags:
  - vim
title: Vim File Explorer
meta_image: "https://s.gravatar.com/avatar/22784ea1769f025112c92c31321c6bf1?s=700"
meta_image_width: 700
meta_image_height: 700
---

Inside a vim session, you may already know that triggering `:Explore` brings up
a file explorer where you can rename/delete/process files as you please.

What you _may not_ know is that inside that File Explorer session, triggering
`:Explore` one more time changes your (file explorer) working directory to the
root of vim session. This is especially useful if you use vim split windows and
need to get to the files in multiple places in your source tree.

Another neat thing about `:Explore` is that it makes it very easy to delete
specially-named files. So for example, if you accidentally created a file named
`*`, or `~`, don't fret, `:Explore` has your back!
