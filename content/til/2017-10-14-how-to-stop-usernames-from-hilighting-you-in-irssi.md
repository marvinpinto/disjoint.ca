---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-14T16:17:51-04:00
lastmod: 2017-10-14T16:17:51-04:00
title: "How to stop usernames from hilighting you in Irssi"
tags:
  - 'irssi'
---

I use the [irssi client][irssi] almost exclusively for all my chat needs.
Through an [IRC bouncer][znc], I am able to connect to my
Slack/Freenode/Gitter/other networks, all through a single irssi interface.

It does, however, become very annoying to get hilighted in IRC channels by
robots, especially when related to builds! I have a few IRC channels setup
where all I see is noise like this:
``` text
16:13:11 < travis-ci> marvinpinto/disjoint.ca#444 (master - 034fdf3 : Marvin Pinto): The build passed.
16:13:11 < travis-ci> Change view : https://github.com/marvinpinto/disjoint.ca/compare/7e15f3a4033e...034fdf317336
16:13:11 < travis-ci> Build details : https://travis-ci.org/marvinpinto/disjoint.ca/builds/287969915
```

I found a way to prevent these robots from hilighting me (in specific channels)
using the [trigger.pl][trigger.pl] irssi script.

The following trigger prevents the bot `gitter` from hilighting my username
(`marvin`) on the Gitter network. For context, I connect to
[gitter.im][gitter.im] through their IRC gateway at
[irc.gitter.im][irc.gitter.im].
``` text
/trigger add -all masks '*!gitter@*' -regexp '(mar)(vin)' -replace '$1\x02\x02$2' -tags 'gitter-im'
```

What the above says is if the `*!gitter@*` username on the `gitter-im` network
mentions the name `marvin` in a message, break up the string `marvin` into two
parts. This ensures that the hilight I've setup for `marvin` does not get
triggered. Note that in your setup `gitter-im` will be whatever name you give
the gitter network in your irssi config.

Read the `/trigger help` docs for detailed information and more examples!

[gitter.im]: https://gitter.im
[irc.gitter.im]: https://irc.gitter.im
[irssi]: https://irssi.org
[znc]: https://znc.in
[trigger.pl]: https://github.com/irssi/scripts.irssi.org/blob/master/scripts/trigger.pl
