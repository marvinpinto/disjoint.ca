---
author_twitter_username: "marvinpinto"
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
date: 2017-10-05T07:20:00-04:00
lastmod: 2017-12-13
title: 'A guide to setting up & managing GPG keys on a Yubikey 4'
description: 'This is a small guide to keep future-Marvin from hating past-Marvin. Hey Marvin!'
tags:
  - 'gpg'
  - 'yubikey'
---

The purpose of this guide is to document all the steps needed to setup and
maintain a set of GPG subkeys on the Yubikey 4, while still keeping the master
key safely tucked away. This allows us to revoke the specific set of subkeys in
the scenario the Yubikey goes missing.

It is probably a good idea to **make a backup of your ~/.gnupg directory**
before trying any of this.

### Yubikey Setup

**Change the PINs on your Yubikey.** The default PIN that ships with
your Yubikey is `12345678`.
``` text
$ gpg2 --card-edit
  ...
gpg/card> admin
Admin commands are allowed

gpg/card> passwd
  ...
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection?
```
Change your **regular PIN** by selecting `2 - unblock PIN` - it will prompt you
for a new PIN. Then change your **admin PIN** by selecting `3 - change Admin
PIN`.


**Change the name listed on your Yubikey.**
``` text
$ gpg2 --card-edit
  ...
gpg/card> admin
Admin commands are allowed

gpg/card> name
Cardholder's surname: Smith
Cardholder's given name: Jane
```


**Change the login name associated with your Yubikey.**
``` text
$ gpg2 --card-edit
  ...
gpg/card> admin
Admin commands are allowed

gpg/card> login
Login data (account name): jsmith
```


**Change the language associated with the Yubikey.**
``` text
$ gpg2 --card-edit
  ...
gpg/card> admin
Admin commands are allowed

gpg/card> lang
Language preferences: en
```

**Ensure that the key is touched for all signature operations.** You will need
the [yubitouch.sh][yubitouch-sh] script for this (more info available
[here][yubico-card-edit]).
``` bash
$ yubitouch.sh sig on
```


### GPG Key Management

**Generate a new GPG master key**, assuming you don't already have one.
``` text
$ gpg2 --expert --gen-key
gpg (GnuPG) 2.0.22; Copyright (C) 2013 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
Your selection? 8

Possible actions for a RSA key: Sign Certify Encrypt Authenticate 
Current allowed actions: Sign Certify Encrypt 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? S

Possible actions for a RSA key: Sign Certify Encrypt Authenticate 
Current allowed actions: Certify Encrypt 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? E

Possible actions for a RSA key: Sign Certify Encrypt Authenticate 
Current allowed actions: Certify 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? Q
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 
Key does not expire at all
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: Jane Smith
Email address: jsmith@example.com
Comment: 
You selected this USER-ID:
    "Jane Smith <jsmith@example.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
You need a Passphrase to protect your secret key.

We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
gpg: /home/marvin/.gnupg/trustdb.gpg: trustdb created
gpg: key 3F5BFCFC marked as ultimately trusted
public and secret key created and signed.

gpg: checking the trustdb
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
pub   4096R/3F5BFCFC 2017-10-04
      Key fingerprint = A6FF 2680 BA23 B836 7533  A63F A6C1 5B41 3F5B FCFC
uid                  Jane Smith <jsmith@example.com>
```

**Things to note:**

- You want to use option 8 (`RSA (set your own capabilities)`) when generating
  the master key.
- You also want to restrict the allowed actions to **only be Certify**
  (`Current allowed actions: Certify`). You can toggle off the other options as
  needed.
- Since this is your master key that is going to be locked away, it is worth
  choosing `4096` as the key size and setting the expiry to `never`.
- From the previous sample output, note that `3F5BFCFC` will be our
  `MASTER_KEY_ID`.
- The `rng-tools` Ubuntu package might come in handy in the scenario that your
  machine is not generating enough entropy (`sudo service rng-tools start` if
  you already have it installed)


**Add an extra UID for git commit signing and make it secondary.**
```
$ gpg2 --expert --edit-key MASTER_KEY_ID
gpg (GnuPG) 2.0.22; Copyright (C) 2013 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

pub  4096R/3F5BFCFC  created: 2017-10-04  expires: never       usage: C   
                     trust: ultimate      validity: ultimate
[ultimate] (1). Jane Smith <jsmith@example.com>

gpg> adduid
Real name: Jane Smith
Email address: jsmith+git@example.com
Comment: 
You selected this USER-ID:
    "Jane Smith <jsmith+git@example.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O

pub  4096R/3F5BFCFC  created: 2017-10-04  expires: never       usage: C   
                     trust: ultimate      validity: ultimate
[ultimate] (1)  Jane Smith <jsmith@example.com>
[ unknown] (2). Jane Smith <jsmith+git@example.com>

gpg> uid 1

pub  4096R/3F5BFCFC  created: 2017-10-04  expires: never       usage: C   
                     trust: ultimate      validity: ultimate
[ultimate] (1)* Jane Smith <jsmith@example.com>
[ unknown] (2). Jane Smith <jsmith+git@example.com>

gpg> primary

pub  4096R/3F5BFCFC  created: 2017-10-04  expires: never       usage: C   
                     trust: ultimate      validity: ultimate
[ultimate] (1)* Jane Smith <jsmith@example.com>
[ unknown] (2)  Jane Smith <jsmith+git@example.com>

gpg> save
```


**Export the master keys for backups.**

``` bash
$ gpg2 --export-secret-key --armor MASTER_KEY_ID > MASTER_KEY_ID-secret.txt
$ gpg2 --export --armor MASTER_KEY_ID > MASTER_KEY_ID-public.txt
```


**Create the master revocation certificate.**

``` bash
$ gpg2 --gen-revoke MASTER_KEY_ID > ~/MASTER_KEY_ID-revocation-certificate.asc
```


**Lock the following files away in a safe place, preferably not together.**

``` text
MASTER_KEY_ID-secret.txt
MASTER_KEY_ID-public.txt
MASTER_KEY_ID-revocation-certificate.asc
```


**Generate a new set of subkeys for Encryption, Authentication, and Signing.**

This example with walk you through setting up the **Signing** key.
```
gpg2 --expert --edit-key MASTER_KEY_ID
gpg (GnuPG) 2.0.22; Copyright (C) 2013 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

gpg: checking the trustdb
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
pub  4096R/3F5BFCFC  created: 2017-10-04  expires: never       usage: C   
                     trust: ultimate      validity: ultimate
[ultimate] (1). Jane Smith <jsmith@example.com>
[ultimate] (2)  Jane Smith <jsmith+git@example.com>

gpg> addkey
This key is not protected.
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
Your selection? 8

Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: Sign Encrypt 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? E

Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: Sign 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? Q
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 
Requested keysize is 2048 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y
Key expires at Thu 04 Oct 2018 07:48:12 PM EDT
Is this correct? (y/N) y
Really create? (y/N) y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

pub  4096R/3F5BFCFC  created: 2017-10-04  expires: never       usage: C   
                     trust: ultimate      validity: ultimate
sub  2048R/C6E8400C  created: 2017-10-04  expires: 2018-10-04  usage: S   
[ultimate] (1). Jane Smith <jsmith@example.com>
[ultimate] (2)  Jane Smith <jsmith+git@example.com>

gpg> save
```


**Things to note:**

- You want to use option 8 (`RSA (set your own capabilities)`) when generating
  the subkeys.
- You also want to restrict the allowed actions on each subkey to a single
  capability (i.e. either *Sign*, *Encrypt*, or *Authenticate*). You can toggle
  off the other options as needed.
- Since these subkeys will be *live*, it is advisable to expire them after a
  year.


**Export the subkeys for backups.**

``` bash
$ gpg2 --export-secret-subkeys --armor MASTER_KEY_ID > MASTER_KEY_ID-subkeys-secret.txt
```


**Delete your ~/.gnupg directory and import your new GPG subkeys.** If you're
unsure about this it might be worth making a temporary backup of the `~/.gnupg`
directory.
``` bash
$ gpg2 --import /path/to/MASTER_KEY_ID-subkeys-secret.txt
```

Verify that the following command shows `sec#` instead of `sec` for your
private key. In this context `sec#` implies that the private key is not
present.
``` text
$ gpg -K
/home/marvin/.gnupg/secring.gpg
-------------------------------
sec#  4096R/3F5BFCFC 2017-10-04
uid                  Jane Smith <jsmith@example.com>
uid                  Jane Smith <jsmith+git@example.com>
ssb   2048R/C6E8400C 2017-10-04
ssb   2048R/558E5D51 2017-10-05
ssb   2048R/45C77BC4 2017-10-05
```

Your subkeys are now imported and ready to use in your local keyring!


**Revoking your GPG key.**

Assuming you already have a revocation certificate as per above:
``` bash
$ gpg --import MASTER_KEY_ID-revocation-certificate.asc
$ gpg --keyserver pgp.mit.edu --send-keys MASTER_KEY_ID
```


### Yubikey Management

**Import the Authentication, Encryption, and Signing subkeys into the Yubikey.**
``` bash
$ gpg2 --edit-key MASTER_KEY_ID
```
Use the `key` and `keytocard` sub-commands and follow the prompts to transfer
your new subkeys onto the Yubikey 4. Details available
[here][yubikey-key-import].


**Prepare your daily machine for your GPG Subkeys.**

The goal of this section is to make use of the subkeys you transferred to the
Yubikey. Since the private keys have been loaded onto the Yubikey, there is no
need to keep them on the machine. So begin by cleaning out the `~/.gnupg`
directory and starting from scratch.

``` bash
$ gpg2 --import < /path/to/MASTER_KEY_ID-public.txt
```

Now if you issue a `gpg2 --card-status`, you will notice that the master key is
not available `sec#` and that the subkeys are all stubs `ssb>`. Finally mark
your key as ultimately trusted using the `trust` gpg sub-command:


**Publish your new GPG subkeys.**

``` bash
gpg2 --send-key MASTER_KEY_ID
```

If you would like to verify that that publish actually worked:
``` bash
gpg2 --recv-key 0xMASTER_KEY_ID
```


**Generate an SSH public key from your GPG Authentication-subkey.**
``` bash
gpgkey2ssh MASTER_KEY_ID
```

If you need to add additional SSH private keys to your keyring:
``` bash
ssh-add /path/to/ssh-private-key
```

Note that these manually-added keys will be stored in the
`~/.gnupg/private-keys-v1.d` directory.


**Reset the Yubikey PIN due to too many retries.**

If you find yourself in a situation where you entered the wrong pin in too many
times, you might find that your yubikey silently locks you out.

You can tell if you're locked out if your `PIN retry counter` value looks
something like:
```
$ gpg --card-status | grep PIN.retry
PIN retry counter : 0 0 3
```

Here's how to reset your PIN.
``` bash
$ gpg --card-edit

gpg/card> admin
Admin commands are allowed

gpg/card> passwd
  ...
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection?
```
Select `2 - unblock PIN` and follow the instructions.



### Subkey Rotation

1. Load the master keys in from offline storage. Make a backup if necessary of
   the `~/.gnupg` directory and clear its contents.

    ``` bash
    $ gpg2 --import MASTER_KEY_ID-secret.txt
    ```

    This can be verified by running `gpg2 --list-secret-keys`. For example:
    ``` text
    /root/.gnupg/pubring.kbx
    ------------------------
    sec   rsa4096/B0BB564B 2016-12-13 [C]
    uid         [ unknown] Marvin Pinto (git) <git@pinto.im>
    uid         [ unknown] Marvin Pinto <marvin@pinto.im>
    ```

1. Generate a new set of subkeys for Encryption, Authentication, and Signing
   (instructions above).

    Validate that the keys were correctly created by running `gpg2 --list-keys`:
    ``` text
    /root/.gnupg/pubring.kbx
    ------------------------
    pub   rsa4096/B0BB564B 2016-12-13 [C]
    uid         [ unknown] Marvin Pinto (git) <git@pinto.im>
    uid         [ unknown] Marvin Pinto <marvin@pinto.im>
    sub   rsa2048/CAFA20AA 2017-12-13 [S] [expires: 2018-12-13]
    sub   rsa2048/64AB6CC1 2017-12-13 [E] [expires: 2018-12-13]
    sub   rsa2048/4980FCA4 2017-12-13 [A] [expires: 2018-12-13]
    ```

1. Export the new subkeys for backups.
    ``` bash
    $ gpg2 --export-secret-subkeys --armor MASTER_KEY_ID > MASTER_KEY_ID-subkeys-secret-$(date +"%Y-%m-%d").txt
    ```

1. On the primary machine, delete the contents of your `~/.gnupg` directory and import your new GPG subkeys.

    ``` bash
    $ killall gpg-agent
    $ gpg2 --import /path/to/MASTER_KEY_ID-subkeys-secret-$(date +"%Y-%m-%d").txt
    ```

1. Verify that all the subkeys were imported correctly.

    List all the currently imported keys using `gpg2 --list-secret-keys`. For example:
    ``` text
    /home/marvin/.gnupg/pubring.kbx
    -------------------------------
    sec#  rsa4096/B0BB564B 2016-12-13 [C]
    uid         [ unknown] Marvin Pinto (git) <git@pinto.im>
    uid         [ unknown] Marvin Pinto <marvin@pinto.im>
    ssb   rsa2048/F6E95359 2017-12-13 [S] [expires: 2018-12-13]
    ssb   rsa2048/2BE9DA48 2017-12-13 [E] [expires: 2018-12-13]
    ssb   rsa2048/17C3883E 2017-12-13 [A] [expires: 2018-12-13]
    ```

    Also ensure that the old subkeys are also present as you'll likely need
    this during the transition period.
    ``` text
    $ gpg2 --edit-key B0BB564B
    gpg (GnuPG) 2.1.11; Copyright (C) 2016 Free Software Foundation, Inc.
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.

    Secret key is available.

    pub  rsa4096/B0BB564B
         created: 2016-12-13  expires: never       usage: C   
         trust: unknown       validity: unknown
    ssb  rsa2048/DCE2D478
         created: 2016-12-13  expired: 2017-12-13  usage: E   
    ssb  rsa2048/F2D0033C
         created: 2016-12-13  expired: 2017-12-13  usage: A   
    ssb  rsa2048/14C837D5
         created: 2016-12-13  expired: 2017-12-13  usage: S   
    ssb  rsa2048/F6E95359
         created: 2017-12-13  expires: 2018-12-13  usage: S   
    ssb  rsa2048/2BE9DA48
         created: 2017-12-13  expires: 2018-12-13  usage: E   
    ssb  rsa2048/17C3883E
         created: 2017-12-13  expires: 2018-12-13  usage: A   
    [ unknown] (1). Marvin Pinto (git) <git@pinto.im>
    [ unknown] (2)  Marvin Pinto <marvin@pinto.im>

    gpg> quit
    ```

1. Replace the Authentication, Encryption, and Signing subkeys on the Yubikey
   with their new versions.

    ``` text
    $ gpg2 --expert --edit-key MASTER_KEY_ID
    ```

    Use the `key N` and `keytocard` sub-commands and follow the prompts to
    transfer your new subkeys onto the Yubikey 4. Details available
    [here][yubikey-key-import].

1. Set the primary key to be ultimately trusted:
    ``` text
    $ gpg2 --expert --edit-key MASTER_KEY_ID
    gpg> trust
    ...
    Please decide how far you trust this user to correctly verify other users' keys
    (by looking at passports, checking fingerprints from different sources, etc.)

      1 = I don't know or won't say
      2 = I do NOT trust
      3 = I trust marginally
      4 = I trust fully
      5 = I trust ultimately
      m = back to the main menu

    Your decision? 5
    Do you really want to set this key to ultimate trust? (y/N) y

    gpg> quit
    ```

1. Publish the new GPG subkeys.

    ``` bash
    $ gpg2 --send-key MASTER_KEY_ID
    ```

    You can verify the published keys via:

    ``` bash
    $ gpg2 --recv-key 0xMASTER_KEY_ID
    ```

    You can also verify that your new subkeys were published by going to:
    `http://keys.gnupg.net/pks/lookup?op=vindex&search=0xMASTER_KEY_ID` (might
    take a little while to propagate & update).

1. Update your public SSH key.
    ``` bash
    gpg2 --export-ssh-key MASTER_KEY_ID
    ```

    Note that you can verify your GPG SSH key signature using:
    ``` bash
    gpg2 --export-ssh-key MASTER_KEY_ID | ssh-keygen -l -E md5 -f -
    ```
1. Update your GPG public key, if needed.
    ``` bash
    gpg2 --export --armor MASTER_KEY_ID > pub.txt
    ```
    You can also verify the key fingerprint using `gpg2 --fingerprint
    MASTER_KEY_ID`.

    The public key containing all the subkeys will likely need to be updated on
    websites like GitHub and Keybase as they don't appear to update
    automatically via public PGP key servers.

1. Re-key any encrypted files with the new subkey. Example:
    ``` bash
    $ for f in $(find . -name '*.gpg'); do gpg2 --batch --decrypt $f | gpg2 --encrypt -r MASTER_KEY_ID --armor --output tempfile.gpg && mv tempfile.gpg $f; done
    ```

1. Verify your work.

    Verify that the secret keys no-longer exist on your local machine. You
    should see `sec#` beside your primary key and `ssb>` beside your subkeys.
    Note that the `>` here (beside `ssb`) corresponds to stubs.
    ``` text
    $ gpg2 --list-secret-keys
    /home/marvin/.gnupg/pubring.kbx
    -------------------------------
    sec#  rsa4096/B0BB564B 2016-12-13 [C]
    uid         [ultimate] Marvin Pinto (git) <git@pinto.im>
    uid         [ultimate] Marvin Pinto <marvin@pinto.im>
    ssb>  rsa2048/F6E95359 2017-12-13 [S] [expires: 2018-12-13]
    ssb>  rsa2048/2BE9DA48 2017-12-13 [E] [expires: 2018-12-13]
    ssb>  rsa2048/17C3883E 2017-12-13 [A] [expires: 2018-12-13]
    ```

    Also verify that the secret portion of your previous keys are still
    available locally as you'll need this during the transition period.

    ``` text
    $ gpg2 --expert --edit-key MASTER_KEY_ID
    gpg (GnuPG) 2.1.11; Copyright (C) 2016 Free Software Foundation, Inc.
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.

    Secret key is available.

    pub  rsa4096/B0BB564B
         created: 2016-12-13  expires: never       usage: C   
         trust: unknown       validity: unknown
    ssb  rsa2048/DCE2D478
         created: 2016-12-13  expired: 2017-12-13  usage: E   
    ssb  rsa2048/F2D0033C
         created: 2016-12-13  expired: 2017-12-13  usage: A   
    ssb  rsa2048/14C837D5
         created: 2016-12-13  expired: 2017-12-13  usage: S   
    ssb  rsa2048/F6E95359
         created: 2017-12-13  expires: 2018-12-13  usage: S   
         card-no: XXXXX
    ssb  rsa2048/2BE9DA48
         created: 2017-12-13  expires: 2018-12-13  usage: E   
         card-no: XXXXX
    ssb  rsa2048/17C3883E
         created: 2017-12-13  expires: 2018-12-13  usage: A   
         card-no: XXXXX
    [ unknown] (1). Marvin Pinto (git) <git@pinto.im>
    [ unknown] (2)  Marvin Pinto <marvin@pinto.im>

    gpg> quit
    ```
    In the above example, private keys for `F6E95359`, `2BE9DA48`, and
    `17C3883E` are stored on the Yubikey while the private keys for `DCE2D478`,
    `F2D0033C`, and `14C837D5` are in the local (computer) keychain (indicated
    via `card-no: ...`).

1. Delete the old subkeys from your keychain.

    At some point key rotation will be complete and you will no longer need the
    old subkeys around.
    ``` text
    To be updated..
    ```
    Note that you will need to re-publish your master key and also update the
    public key for websites that don't use the PGP keyserver network, namely
    GitHub and Keybase.


[yubitouch-sh]: https://github.com/a-dma/yubitouch
[yubico-card-edit]: https://developers.yubico.com/PGP/Card_edit.html
[yubikey-key-import]: https://blog.josefsson.org/2014/06/23/offline-gnupg-master-key-and-subkeys-on-yubikey-neo-smartcard
