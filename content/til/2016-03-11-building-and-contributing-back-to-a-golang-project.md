---
date: 2016-03-11T08:56:38-05:00
tags:
- golang
title: Building and contributing back to a Golang project (aka short-lived forks)
---

Let's assume you would like to contribute back to [spf13/hugo][1].

1. Make sure that your `GOPATH` environment variable is set to [something
   reasonable][2].

1. Fork the `spf13/hugo` repository into your own namespace.

1. Update all the dependencies and build `spf13/hugo` locally.

    ``` bash
    go get -u -v github.com/spf13/hugo
    ```

1. Start working on your patch!

    ``` bash
    cd $GOPATH/src/github.com/spf13/hugo
    git checkout -b new-amazing-patch
    # your work ..
    git commit
    ```

1. Add your fork as a remote and push your branch up to it.

    ``` bash
    git remote add fork git@github.com:<YOUR_NAMESPACE>/hugo.git
    git push -u fork new-amazing-patch:new-amazing-patch
    ```

1. Test and build it locally.

    ``` bash
    go get -v ./...
    go test ./...
    ```

1. Assuming all that worked as planned, the compiled `hugo` binary should be
   available at `$GOPATH/bin` and you should be ready to PR your changes back
   upstream.

(_hat tip to <a href="https://github.com/moorereason"><i class="fa fa-github">
 moorereason</i></a> for reminding me that git remotes are indeed the better
 way of working with forked Golang projects_)


**Now for all the things that did not work**

I originally started off trying to build a binary off my forked changes
following the instructions on the [spf13/hugo][1] repository. Essentially:

- Clone your fork locally
- Update all the required dependencies (`go get -v ./...`)
- Symlink the forked repository into `spf13/hugo` in order to satisfy namespace
constraints

This exhibited unexpected behavior in that the binary that was built _did not
incorporate_ any of my changes, in other words it was straight-up building
upstream. A bit of experimentation led me to making local changes on the
filesystem and then triggering a rebuild, which seemed to do the right thing.

Following this rabbit hole, I decided to dig a bit deeper to figure out _why_
this was happening. Reading through the [go command docs][3], I came across
this:

``` text
-a
  force rebuilding of packages that are already up-to-date.
```

Seems like a reasonable option to try. Off I went my `-a` hammer.

```
go install runtime: open /usr/local/go/pkg/linux_amd64/runtime.a: permission denied
```

Why on earth was this thing trying to write to `/usr/local`. Even though I keep
my development in a [contained environment][4] of sorts, I still run as a
non-privileged user and do not invoke `sudo` as part of these builds. This was
strange.

Which led me to [this Github Issue][5]:

> In Go 1.5 "go build -a" will rebuild the standard library if the set of
> source files have changed.

Using the above mechanism of symlinking the forked repository into the expected
namespace, I found **no good way of making this work** without having to "make
a local change" (i.e. modify the `mtime` of a file).

Hopefully this information will be useful for someone else who ends up down
this path!


[1]: https://github.com/spf13/hugo
[2]: https://golang.org/doc/code.html#GOPATH
[3]: https://golang.org/cmd/go
[4]: https://github.com/marvinpinto/kitchensink
[5]: https://github.com/golang/go/issues/12203
