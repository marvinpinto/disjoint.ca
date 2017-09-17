---
author_twitter_username: marvinpinto
date: 2017-09-17T12:08:10-04:00
description: Exiting vim with a non-zero status
lastmod: 2017-09-17T12:08:10-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - vim
  - git
title: Exiting vim with a non-zero status
---

To exit your vim editor with a non-zero exit code, execute `:cq`.

This is specially useful when you need to bail out of an interactive git
rebase.

Exiting your vim session with a non-zero exit status (while in interactive
rebase mode) triggers an error similar to `Could not execute editor` which
effectively leaves your tree unchanged.
