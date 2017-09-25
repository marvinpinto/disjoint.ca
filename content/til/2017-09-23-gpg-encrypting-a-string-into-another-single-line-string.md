---
author_twitter_username: marvinpinto
date: 2017-09-23T11:59:08-04:00
lastmod: 2017-09-25
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - gpg
title: GPG encrypting a string into another single-line string
---

There are times when it comes in handy to be able to gpg-encrypt a string into
another single-line string. A good use case of this is if you need to stick
this gpg-encrypted string into a config file somewhere (similar to what is
being done [here][ledger-reconciler-installation]).

In general, you end up with something like this whenever you gpg-encrypt a
string using the ascii armor option.
``` bash
$ echo "sekret123" | gpg --encrypt -r 52654E6EB0BB564B --armor
-----BEGIN PGP MESSAGE-----
Version: GnuPG v2.0.22 (GNU/Linux)
Comment: GPGTools - https://gpgtools.org

hQEMA+Yhd1nc4tR4AQf/ckUqgaMh0PgBsoVfj24vCnuz+Mzo18wnmQ3VQmO5PSAh
DutuXu3urFmzz0cxmmxiwiZ6inG+h2HWp+BX/YIMouqHzOR1KOCt+1o7rjWeNQCO
aQbBx1cSqp4ZCoj22jf0+jJjdT0xNrFFEOkP3teK5w2wVKaLUa9rbTLP0wrqlV3/
LvXYyaeddGA2Zqu8TfENfBySpJBFiLd3T5emG5of4G7jOsgBWjl6qga7fbKEQ9QU
HE47fCvjlWTDUHZjwayWlNrZTykZTuQ8nquXIPYDO5piTbLUhQQJEYHkwtPcf5zb
WNtQxO1y2OUOLt7cZDZIa8c5iSJLrzOdCck83zyIDdJFAXpA1iqCb4q1ZHYXThMo
QgMByWmItTjSYR595uYdffuSAizUP4oRERo7xz7cTRba/hGss+cvLPLcmvZZHeYw
sdhJ6YZl
=MtcI
-----END PGP MESSAGE-----
```

That big block of text, including the header, does not play so well when you
simply need a string you can plug in somewhere else. This is where the `base64`
tool comes in handy.
``` bash
$ echo "sekret123" | gpg --encrypt -r 52654E6EB0BB564B --armor | base64 --wrap 0
LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tClZlcnNpb246IEdudVBHIHYyLjAuMjIgKEdOVS9MaW51eCkKQ29tbWVudDogR1BHVG9vbHMgLSBodHRwczovL2dwZ3Rvb2xzLm9yZwoKaFFFTUErWWhkMW5jNHRSNEFRZi9ZS3JOQXJRalBwcitadmsySHRTTlFxVm10YU5pOHE3bXJYbElFS25wdzdFbgpIUUNrNFArUUg0NWJZRWlscUFpaHdrc3dWV1hmSGZ3TjQ4ZFlhVkk5RXdjKzNwZFJaTUtjV0lwcWtNNk9VRVo4CktvbnB2Qm9pK2huNzROYk1kY0Y0c0pXbS9ObDFpNXBYOXQ5eHNnVzRzUURwcmRIclZ5dCtnVW1CdXJpR3NzU1YKWHVhdTgzSlVNRjdOMGtEVTBQTzFPaHE3b3k1Zk1OZnprZEg2UjREVk1oZm81RDYvMFdVSjMzTFg1T2tzOGJLMQplbmtMZ24ybGpxbTZNenlDRzhVOExXUGsvaTN5dklmSis3aEY5bDh0SFhrckNlMG9ZaDhqeW5iUjVrY1Jud1c3CjE0WnVodXVIZnNTZE5IOGcxRGE2VEhzTTFoTWlLQWhyeDh0Mmh1a2xtdEpGQWNNVmxSR1N2S2dvVFJKeXM3OG8KeUorY0lRU3J2WW9RYWhHb09CeHRNTUwyV1NhdDN5K1pBaSttUGNoRTl4ZG5Pa1RYWjhQS1E0WnhJbjdXSlNwZgpsck5waTdEcwo9ZHRHZwotLS0tLUVORCBQR1AgTUVTU0FHRS0tLS0tCg==
```

You can now plug that (admittedly long!) `LS0tLS1C...` string wherever you
need.

Of course when it comes to decryption, you first need to base64-decode that
string before attempting decryption.
``` bash
$ echo "sekret123" | gpg --encrypt -r 52654E6EB0BB564B --armor | base64 --wrap 0 | base64 -d | gpg --decrypt
sekret123
```

**Note:** If you're wondering where the `52654E6EB0BB564B` value came from, you
can find your own GPG ID as follows:
```bash
$ gpg --list-keys
/home/marvin/.gnupg/pubring.gpg
-------------------------------
pub   4096R/52654E6EB0BB564B 2016-12-13
uid                          Marvin Pinto <marvin@pinto.im>
uid                          Marvin Pinto (git) <git@pinto.im>
sub   2048R/E6217759DCE2D478 2016-12-13 [expires: 2017-12-13]
sub   2048R/26515E9EF2D0033C 2016-12-13 [expires: 2017-12-13]
sub   2048R/F705991D14C837D5 2016-12-13 [expires: 2017-12-13]
```

[ledger-reconciler-installation]: https://disjoint.ca/projects/ledger-reconciler/installation
