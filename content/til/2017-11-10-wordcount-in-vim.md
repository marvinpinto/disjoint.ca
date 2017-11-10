---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-11-10T11:55:44-05:00
lastmod: 2017-11-10T11:55:44-05:00
title: "Wordcount in vim"
tags:
  - 'vim'
---

You can count the number of words in your vim buffer by pressing `g` and then
`ctrl+g`. You should see output at the bottom that looks something like:
``` text
Col 1 of 0; Line 12 of 13; Word 21 of 32; Byte 241 of 295
```

You can also do the same for a highlighted block. After you highlight a block
of words, press `g` and then `ctrl+g` and the word count for that block will
show up in the output bar.
``` text
Selected 1 of 19 Lines; 31 of 99 Words; 161 of 625 Bytes
```
