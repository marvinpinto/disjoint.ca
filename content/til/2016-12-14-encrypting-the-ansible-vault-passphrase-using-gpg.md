---
author_twitter_username: marvinpinto
date: 2016-12-14T22:05:55-05:00
description: Encrypting the Ansible Vault passphrase using GPG
lastmod: 2016-12-14T22:05:55-05:00
meta_image: marvin-pinto-profile.jpg
meta_image_height: 700
meta_image_width: 700
tags:
  - ansible
  - gpg
title: Encrypting the Ansible Vault passphrase using GPG
---

One of the neat things you can do with GPG is encrypt your Ansible Vault
passphrase file. This works very nicely with hardware security keys such as
Yubikey.

To start off, you will probably want to generate a new Vault passphrase and
re-key all your already-encrypted Vault files.

``` bash
$ pwgen -n 71 -C | head -n1 | gpg --armor --recipient GPG_ID -e -o vault_passphrase.gpg
```

You can view that actual vault passphrase using:

``` batch
$ gpg --batch --use-agent --decrypt vault_passphrase.gpg
```

Now that you have the **new** passphrase ready to go, re-key all your
already-encrypted Vault files.

``` bash
$ grep -rl '^$ANSIBLE_VAULT.*' . | xargs -t ansible-vault rekey
```

This command will ask you for the **old** and **new** vault passphrases and
then attempt to re-key all the files that begin with the string
`$ANSIBLE_VAULT` (usually indicative of an Ansible Vault encrypted file).

The next thing we need to do here is find a way to make decryption as painless
as possible, which is where Ansible's `--vault-password-file` [flag comes
in][1].

One of the things that the `--vault-password-file` argument accepts is a
script.

Finally, create an **executable** file called `vault_pass.sh`:

``` bash
#!/bin/sh
gpg --batch --use-agent --decrypt vault_passphrase.gpg
```

Now that all the pieces are in place, invoke `ansible-vault` manually and make
sure that the re-keying worked as expected:

``` bash
$ ansible-vault --vault-password-file=vault_pass.sh view /path/to/an/encrypted/vault/file.yml
```

You could also make your life slightly easier by adding this to your
`ansible.cfg`, in which case you could omit the `--vault-password-file`
argument.

``` ini
[defaults]
vault_password_file=vault_pass.sh
```

[1]: https://docs.ansible.com/ansible/playbooks_vault.html
