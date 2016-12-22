---
aliases:
  - '/posts/2015/11/22/lets-encrypt-was-supposed-to-make-things-easier/'
  - '/posts/2015/11/22/lets-encrypt-was-supposed-to-make-things-easier'
date: 2015-11-22T12:44:12-05:00
lastmod: 2016-05-28T17:30:00-04:00
description: How to use Let’s Encrypt with Hugo or other static file generators -- a short story on what did and did not work for me.
tags:
  - letsencrypt
  - cloudfront
  - s3
title: Let's Encrypt was supposed to make things easier
meta_image: "2015-11-22-lets-encrypt-was-supposed-to-make-things-better.jpg"
meta_image_width: 700
meta_image_height: 394
---

_If you're looking for the tl;dr on how I got this done, save yourself the time
and [head there](#tldr) now. For the rest of you, enjoy!_

### Really?

Okay, so that title is a bit harsh. Let me try and explain how I got here!

_I'll start from the beginning_

For those of you who may not know, [Let's Encrypt][7] is a new free, automated,
and open Certificate Authority.

> Let’s Encrypt is a free, automated, and open certificate authority (CA), run
> for the public’s benefit. Let’s Encrypt is a service provided by the Internet
> Security Research Group (ISRG).

I signed up as a [beta tester][3] way back when Let's Encrypt was first
accepting testers. I submitted to whitelist one of my domains and didn't really
think more of that.

Then this happened:

{{< tweet 656307019897421824 >}}

Being [trusted][1] meant that their issued certificates would be trusted by
_all_ major browsers, exciting!

So, fast forward to yesterday -- Got my [disjoint.ca][2] domain whitelisted,
thought it would be a great opportunity to kick the tires.

### Site Architecture

Okay, so let's take a step back and describe the big picture for a second.

This site ([disjoint.ca][2]) is generated from Markdown and other bits using
[Hugo][4] as the underlying static file generator. Since this site is
essentially a _bag of files_, there was nothing stopping me from hosting it in
an S3 bucket, and so I did.

One of the caveats of an S3 bucket is that you cannot use your own domain name
in combination with https, which is where [CloudFront][8] comes in.  CloudFront
allows you use your own domain + an [SNI-based SSL certificate][9] (backed by
an S3 bucket as an origin)

### Let's Kick the Tires

Now that we have a bit of context, let's see what this thing is all about! So I
created the `/home/marvin/Dropbox/lets-encrypt/{etc,lib}` directories and ran
the Let's Encrypt docker client as follows:

``` bash
docker run -it --rm --name letsencrypt \
  -v "/home/marvin/Dropbox/lets-encrypt/etc:/etc/letsencrypt" \
  -v "/home/marvin/Dropbox/lets-encrypt/lib:/var/lib/letsencrypt" \
  quay.io/letsencrypt/letsencrypt:latest \
  --agree-dev-preview \
  --server https://acme-v01.api.letsencrypt.org/directory \
  -a manual \
  --verbose \
  auth
```

Since [disjoint.ca][2] uses [Hugo][4] as the underlying static file generator,
I created the `static/.well-known/acme-challenge/<long_token>` file with
the required `<long_token>.<secret>` contents.

Great, [ship it][5] I thought, let's get going with some SSL goodness!

``` text
Self-verify of challenge failed.
```

At this point, I checked the raw `curl -vv` output and noticed:

``` text
Content-Type: text/plain; charset=utf-8
```

The `charset=utf-8` seemed odd here. I suspected that Let's Encrypt was a
stickler for the content type and and that that extra `charset=utf-8` bit was
making it super sad.

If you're wondering where that came from, I tracked it to [this][6] commit in
the `s3_website` gem (essentially appends `; charset=utf-8` to the
`Content-Type` string for any types that start with `text/`)

Okay, onwards we go. I edited the content type of that object directly in the
S3 bucket (back to `text/plain`), invalidated the path in CloudFront, and tried
again. Still no luck :(

{{< tweet 668254958467219456 >}}

At this point it was getting late and I was getting impatient. So I cheated.

For context, I had suspected that something in this combination of S3,
CloudFront, s3_website, and Let's Encrypt was at fault here but I couldn't
figure out _what_. It was very irritating and I decided to cut my losses at
this point (with the intention of re-visiting later).

My hypothesis was that a _traditional_ setup with an `A` record would work as
intended since there weren't other pieces like CDNs and caching in play.

So, it was late and time to go to bed so I created a (temporary) `A` record for
`www.disjoint.ca` and pointed it to one of my nodes. After the DNS records
propagated, I ran the python script they provided (which spins up a temporary
HTTP server) and I was on my way with my very first Let's Encrypt SSL
certificate.

This was definitely not the correct or sustainable way of doing this, and that
made me kind of sad. I made brief notes on what I did to replicate this with
the intention of trying again the next day to see if I made a mistake of some
sort along the way.

When I sat down today to try this again and write up this blog post a funny
thing happened.

Everything just _seemed to work_. As far as I could tell, I did not do anything
differently and.. well.. that's kind of suspicious. Poking around in a few
places to see _if_ anything had changed since yesterday, I came across
this.

{{< tweet 668482850316881921 >}}

So basically I'm going to chalk all this up to _they fixed it, yay!_ and move
on :D

### <a id="tldr"></a>How to use Let's Encrypt with Hugo or other static file generators

So, for future Marvin or anyone else that is interested, here is what
(currently) needs to be done to obtain a Let's Encrypt SSL certificate.

1. **Create a Let's Encrypt directory** to store your certs and other related
   info
  ```bash
  mkdir -p ~/lets-encrypt/{etc,lib}
  ```

1. **Run the latest Let's Encrypt docker client** to request an SSL
   certificate:
  ``` bash
  docker run -it --rm --name letsencrypt \
    -v "$HOME/lets-encrypt/etc:/etc/letsencrypt" \
    -v "$HOME/lets-encrypt/lib:/var/lib/letsencrypt" \
    quay.io/letsencrypt/letsencrypt:latest \
    --agree-dev-preview \
    --server https://acme-v01.api.letsencrypt.org/directory \
    -a manual \
    --verbose \
    auth
  ```
  After you fill out the fields, you should see something similar to:

    ``` text
    http://www.example.org/.well-known/acme-challenge/<long_token> before continuing:
    <long_token>.<secret>
    ```
  Create the following file under the static directory
  `.well-known/acme-challenge/<long_token>`, and set the contents to be
  `<long_token>.<secret>`

1. **Deploy that file to your site**. For _me_, this entails making sure this
   lands on `master` since this site auto-deploys whenever master is updated.
   Do whatever works in your situation here.

1. **Check that the URL works** before continuing
  ``` bash
  curl http://www.example.org/.well-known/acme-challenge/<long_token>
  ```

1. **Initiate the certificate request**. Back in the docker client terminal,
   you may have noticed the `Press ENTER to continue` prompt, hit ENTER now.
   Assuming all went well with the above, you should see a `success!` message
   of sorts.

1. **Upload the certificate to AWS** using the aws cli:
  ``` bash
  aws iam upload-server-certificate \
    --server-certificate-name www.example.org \
    --certificate-body file://$HOME/lets-encrypt/etc/live/www.example.org/cert.pem \
    --private-key file://$HOME/lets-encrypt/etc/live/www.example.org/privkey.pem \
    --certificate-chain file://$HOME/lets-encrypt/etc/live/www.example.org/chain.pem \
    --path /cloudfront/
  ```

1. **Set the new certificate in CloudFront** by going to:
  ``` text
  Distribution Settings -> General -> Edit -> Custom SSL Certificate -> www.example.org
  ```

After CloudFront propagates your changes everywhere (and yes, this part takes a
while), your static site should be https enabled with a lovely and free
Let's Encrypt SSL certificate!

It should not be too hard to automate this whole process and this is something
I will look into after Let's Encrypt goes GA.

### Conclusion

Obtaining SSL certificates have been a pain for as long as I can remember.
Considering that the cost of issuing a [Domain Verified][10] certificate is
essentially nothing, I cannot understand how companies get away with charging
upwards of $50 for these things.

Companies like [StartSSL][11] made inroads into this space by issuing free
certs, but the process of obtaining a StartSSL cert was brutal. Once again,
enough for the majority of people to simply not bother.

What I like about Let's Encrypt (so far) is that they have started out on a
positive note. They pledged to offer a product that would be (and stay!) free,
with the intention to make the certificate procurement process
relatively easy.

We are not entirely there yet with the latter and **that is okay**!

Let's Encrypt is in its very early stages and looks very promising so far! If
you did not get a chance to participate in the closed-beta, I urge you to try
it out on December 3, 2015, when [Let's Encrypt goes Public Beta][12].

Happy Encrypting All The Things o/

<br>

<p class="text-center">The <a
href="https://unsplash.com/photos/KhA08OATrQ4">banner</a> for this post was
originally created by <a href="http://www.giuliomagnifico.it">Giulio
Magnifico</a> and licensed under <a href="https://unsplash.com/license">CC0</a>
(via unsplash)</p>


[1]: https://letsencrypt.org/2015/10/19/lets-encrypt-is-trusted.html
[2]: https://www.disjoint.ca
[3]: https://docs.google.com/forms/d/15Ucm4A20y2rf9gySCTXD6yoLG6Tba7AwYgglV7CKHmM/viewform
[4]: https://gohugo.io
[5]: https://travis-ci.org/marvinpinto/disjoint.ca
[6]: https://github.com/laurilehmijoki/s3_website/commit/42114bab83ebeb2a9007af7c4c3960c61eb5e40d
[7]: https://letsencrypt.org
[8]: https://aws.amazon.com/cloudfront
[9]: https://aws.amazon.com/about-aws/whats-new/2014/03/05/amazon-cloudront-announces-sni-custom-ssl
[10]: https://en.wikipedia.org/wiki/Domain-validated_certificate
[11]: https://www.startssl.com
[12]: https://letsencrypt.org/2015/11/12/public-beta-timing.html
