---
author_twitter_username: marvinpinto
date: 2016-05-17T11:47:40-04:00
description: For the times when you need to know the file size of an HTTP object without actually downloading the file.
lastmod: 2016-05-17T11:47:40-04:00
meta_image: "marvin-pinto-profile.jpg"
meta_image_height: 700
meta_image_width: 700
tags:
  - curl
  - http
  - bash
  - numfmt
title: How to determine the file size of a remote HTTP object
---

There are times when you need to know the file size of an HTTP object without
actually downloading the file. This little trick comes in very handy when web
servers respond with the `Content-Length` of an object in the `HEAD` request
itself.

Let's use the front page banner for disjoint.ca as an example.

``` bash
$ curl -sI https://s3.amazonaws.com/media.disjoint.ca/disjoint-ca-banner.jpg | grep Content-Length
Content-Length: 233659
```

Nice. You can see from the HEAD request that the content length for that
particular object (the jpg file) is 233659 bytes.

Let's try and make this human friendly.

``` bash
$ curl -sI https://s3.amazonaws.com/media.disjoint.ca/disjoint-ca-banner.jpg | grep Content-Length | sed 's/[^0-9]//g' | numfmt --to=si
234K
```

Better. The `sed` here takes care of removing anything that isn't a number and
the `numfmt` utility takes care of converting it to human readable units.

Let's take this one step further and turn this into a bash function (in
`~/.bashrc`) so we never have to remember these pipes and switches again!

``` bash
# Determine size of a remote file via a HEAD request
function rfs() {
  local url="$1"

  if [ -z "$url" ]; then
    echo "usage: rfs <url>"
    return 1
  fi

  curl -sIL "$url" | grep Content-Length | sed 's/[^0-9]//g' | numfmt --to=si
}
```

This is much nicer.

``` bash
$ rfs https://s3.amazonaws.com/media.disjoint.ca/disjoint-ca-banner.jpg
234K
```

If you've never used `numfmt` before, [this website][1] has a pretty good
primer on its various options; definitely worth a read!

[1]: https://www.pixelbeat.org/docs/numfmt.html
