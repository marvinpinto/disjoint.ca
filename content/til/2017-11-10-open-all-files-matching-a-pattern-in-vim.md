---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-11-10T12:11:48-05:00
lastmod: 2017-11-10T12:11:48-05:00
title: "Open all files matching a pattern in vim"
tags:
  - 'vim'
---

It is sometimes desirable to open all files of a specific type in vim. Say I
wanted to manually edit all the `.md` files from [this][website-repo]
repository in vim, I could try and manually open each one but vim has a better
way of doing this.

Inside a vim buffer, `:args *.md` will open all the markdown files in the
current directory. The file argument accepts globs so `:args **/*.md` will
recursively open all markdown files starting from the current directory.

Few tips to navigate a large set of buffers in vim:

- `:ls` list all open buffers
- `:bn` to move to the next buffer
- `:bd` to delete the current buffer
- `:qa` to close all the buffers and exit vim
- `:qa!` to close all the buffers and exit vim, forsaking any changes you made

[website-repo]: https://github.com/marvinpinto/disjoint.ca
