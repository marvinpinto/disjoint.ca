---
date: 2016-03-08T13:05:32-05:00
tags:
  - "s3_website"
  - s3
title: Content Type Headers with s3_website Deployments
---

If you unexpectedly find the content type for your `s3_website`-deployed html
to be:

``` text
Content-Type: application/xhtml+xml
```

You probably need to adjust your `DOCTYPE` and `html` directives from:

``` html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr" lang="en">
```

to:

``` html
<!DOCTYPE html>
<html>
```

([original source][1])

[1]: https://github.com/laurilehmijoki/s3_website/issues/7
