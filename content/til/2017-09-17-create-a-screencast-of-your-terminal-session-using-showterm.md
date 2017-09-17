---
author_twitter_username: marvinpinto
date: 2017-09-17T12:54:08-04:00
description: Create a screencast of your terminal session using Showterm
lastmod: 2017-09-17T12:54:08-04:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - terminal
  - screencast
title: Create a screencast of your terminal session using Showterm
---

If you haven't already heard of [showterm.io][showterm-io], highly recommend
checking it out! Showterm uses a combination of [script][man-script] and a
custom timer-file to record and play back your terminal session.

Because the underlying data is essentially plain text, the playback is done via
a custom javascript library which in turn allows viewers to copy & paste
(terminal) text as needed!

Start by installing the `showterm` Ruby gem.
``` bash
$ gem install --no-rdoc --no-ri showterm
```

Now record a screencast of your terminal and hit `ctrl+d` when you're done.
``` text
$ showterm
showterm recording. (Exit shell when done.)
# echo "Hey there! this is a showterm demo"
Hey there! this is a showterm demo
# 
showterm recording finished.
Uploading...
http://showterm.io/596a5f49a7a1cbc3aea3c
```

You may notice that it automatically uploaded the screencast to
[showterm.io][showterm-io]. This may not be desirable if you have secret or
private data you need redacted.

So this time let's record a new screencast but we're going to make sure we
redact the secret data **before the screencast gets uploaded** to Showterm.

Initiate a new `showterm` session using the `-e` flag.
``` text
$ showterm -e
showterm recording. (Exit shell when done.)
# echo "The password is sekret"
The password is sekret
# 
showterm recording finished.
Recording done, now it's time to dress up those timings!             Hot vim tips:

Use :cq  from vim to exit nonzero, and cancel the upload
Use :%s/^[0-9]./0./  to get rid of all longish pauses.
[Hit Enter to edit]
```

Hit `Enter` when prompted. This will bring up `vim` to edit the timings file.
Now [exit vim with a non-zero status][til-exit-vim-non-zero] using `:cq` - this
will effectively prevent the automatic upload.
``` text
OK, discarding edits and skipping upload.
your work is safe in "/tmp/showtime.18508.script" and "/tmp/showtime.18508.times"
To try uploading manually, use:
showterm --retry "/tmp/showtime.18508.script" "/tmp/showtime.18508.times"
```

Let's edit the raw script file and redact our secret.
``` bash
vi /tmp/showtime.18508.script
```

Finally, upload the screencast to Showterm.
``` bash
$ showterm --retry "/tmp/showtime.18508.script" "/tmp/showtime.18508.times"
Uploading...
http://showterm.io/ef671a311d11ecfcd9560
```

<iframe src="https://showterm.io/ef671a311d11ecfcd9560#fast" width="640" height="480"></iframe>

#### Tip: Terminal Resizing
Resize your terminal window if you would like to control the uploaded
dimensions of your screencast. The width and height can be controlled [via the
raw API][showterm-width-height] but it does not appear possible to set these
values through `showterm` gem options.


[showterm-io]: https://showterm.io
[man-script]: http://man7.org/linux/man-pages/man1/script.1.html
[til-exit-vim-non-zero]: {{< relref "til/2017-09-17-exiting-vim-with-a-non-zero-status.md" >}}
[showterm-width-height]: https://github.com/ConradIrwin/showterm/blob/390f1e9dfa5ae6970fb43eadb82088de5e08027c/lib/showterm.rb#L48
