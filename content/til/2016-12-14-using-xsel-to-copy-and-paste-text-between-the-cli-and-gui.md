---
author_twitter_username: marvinpinto
date: 2016-12-14T20:01:55-05:00
description: Using xsel to copy and paste text between the CLI and GUI
lastmod: 2016-12-14T20:01:55-05:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - ubuntu
  - xsel
title: Using xsel to copy and paste text between the CLI and GUI
---

Sometimes it can be cumbersome to copy a large block of text from a terminal
window and this gets more awkward when pages and pages of output scroll by.
Thankfully the nifty little `xsel` command line tool was built just for this!

If you don't already have it installed, the following should get you going on a
Debian-like system:

``` bash
$ sudo apt-get install xsel
```


#### Copy a text file and paste it into your browser (or any GUI application)

``` bash
$ cat /etc/hosts | xsel --clipboard
```
The contents of /etc/hosts will now be available to paste in your browser!

File redirection also works as you would expect:
``` bash
$ xsel --clipboard < /etc/hosts
```


#### Paste the contents of your clipboard into your terminal (or any other CLI app)

``` bash
$ xsel --clipboard
```

Just like other unix utilities, you also benefit from piping and redirection:

``` bash
$ xsel --clipboard > ~/my-hosts.txt
```

Search for all `localhost` entries within the copied content:
``` bash
$ xsel --clipboard | grep -i localhost
```

_Should note that `xsel` works just as you would expect with `primary` and
`secondary` selections - in addition to `clipboard` - though I don't know of
many GUI applications that make use of them._
