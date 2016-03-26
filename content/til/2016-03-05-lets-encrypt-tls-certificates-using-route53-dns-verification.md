---
date: 2016-03-26T08:12:27-04:00
tags:
  - letsencrypt
  - dns
  - route53
title: Let's Encrypt TLS Certificates using Route53 DNS verification
---

In January of this year, Let's Encrypt enabled the dns-01 challenge in
production which was pretty huge!

{{< tweet 689919523164721152 >}}

Unfortunately, the official client [does not yet support this][2].  There is,
however, another client that supports this beautifully! Enter <a
href="https://github.com/xenolf/lego"><i class="fa fa-github">
xenolf/lego</i></a>. I'm going to show you how to obtain a TLS certificate
for `www.example.com` using lego and DNS verification.

**What you'll need**:

- The `lego` binary somewhere in your PATH (grab the latest from the [GitHub
  releases][1] page)

- DNS for your domain managed in [Route53][4] (we're using `example.com` in
  this case)

- AWS credentials capable of modifying route53 records

Set the following environment variables. Note that `LE_EMAIL` here is the email
you would like to use to register with Let's Encrypt.

``` bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
export LE_EMAIL=bob@example.com
```

Enter the directory where you'd like to store your certificates and:

``` bash
cd /your/certificate/directory
lego --path="`pwd`" --email="${LE_EMAIL}" --domains="www.example.com" --dns="route53" run
```

You should see output that looks something like:

``` text
2016/03/26 11:45:29 [INFO][www.example.com] acme: Obtaining bundled SAN certificate
2016/03/26 11:45:29 [INFO][www.example.com] acme: Could not find solver for: http-01
2016/03/26 11:45:29 [INFO][www.example.com] acme: Trying to solve DNS-01
2016/03/26 11:45:56 [INFO][www.example.com] Checking DNS record propagation...
2016/03/26 11:45:59 [INFO][www.example.com] The server validated our request
2016/03/26 11:46:25 [INFO][www.example.com] acme: Validations succeeded; requesting certificates
2016/03/26 11:46:26 [INFO] acme: Requesting issuer cert from https://acme-v01.api.letsencrypt.org/acme/issuer-cert
2016/03/26 11:46:26 [INFO][www.example.com] Server responded with a certificate.
```

If this is your first time running the lego client, it will create the
`accounts` and `certificates` sub-directories. One thing to keep in mind here
is that the lego generated certificate already contains the intermediate
certificate (`chain.pem`), so if this is something you need to separate out,
you will either need to do this manually or through a script.

Using the example above, the `certificates/www.example.com.crt` file will look
something like:

``` text
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

The second certificate there is the intermediate certificate (`chain.pem`)
you're looking for.

Neat, huh!


[1]: https://github.com/xenolf/lego/releases/latest
[2]: https://github.com/letsencrypt/letsencrypt/pull/2061
[3]: https://github.com/xenolf/lego
[4]: https://aws.amazon.com/route53
