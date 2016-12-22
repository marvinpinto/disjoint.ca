---
author_twitter_username: 'marvinpinto'
date: 2016-04-25T20:43:57-04:00
description: Make Ansible Vault diffs great again
meta_image: "marvin-pinto-profile.jpg"
meta_image_width: 700
meta_image_height: 700
tags:
  - ansible
  - git
title: Using git diff with Ansible Vault encrypted files
---

If you've ever worked with Ansible Vault encrypted files you're probably used
to seeing diffs that look like:

``` diff
diff --git a/ansible/roles/znc/vars/main.yml b/ansible/roles/znc/vars/main.yml
index d1da576..46a4242 100644
--- a/ansible/roles/znc/vars/main.yml
+++ b/ansible/roles/znc/vars/main.yml
@@ -1,391 +1,392 @@
 $ANSIBLE_VAULT;1.1;AES256
-61333665313838323731373562313765306338376561393438303162376562666138613739333439
-3566636561313336643461393235653236346434366137620a633732373732643032383239323639
-64616634353561306636656439393361306233653462306434356537333064323762313632326664
-3761626432323361650a666464666461343964343432386263356637393762353866306264653632
+61636163643037343336643537623235316438633635316339383163323762663231363137656535
+3531386538633735666462653630363031643235643335360a343238616237333331643461373764
+31623463316466666365623162373965636464613565646635633265346431303638653565323935
+6533353063346333660a393635366433633366376537636538303662336535613666326331386464
```

This really doesn't work for when you need to go back through history to figure
out what actually changed. We can do better!

Newer versions of `ansible-vault` come with a `view` option that does exactly
what you expect -- given a vault-encrypted file and a passphrase, it will
display the contents of the file to stdout.

Another notable option is the `--vault-password-file` flag which gives you the
option of specifying either a plaintext file with the vault passphrase, or an
executable script that prints the passphrase to stdout (which comes in _very_
handy for passphrases stored as environment variables -- more on that
later).

Add the following `adiff` function to your `~/.bashrc`

``` bash
function adiff() {
  local commit="$1"
  local file="$2"
  local vault_password_file="$3"

  if [ -z "$commit" -o -z "$file" ]; then
    echo "usage: adiff <commit> <file> [vault_password_file]"
    return 1
  fi

  if [ -z "$vault_password_file" ]; then
    vault_password_file=vault_pass.py
  fi

  diff -u \
    <( ansible-vault --vault-password-file="${vault_password_file}" view <( git show "${commit}^":"${file}" )) \
    <( ansible-vault --vault-password-file="${vault_password_file}" view <( git show "${commit}":"${file}" ))
}
```

Your Ansible Vault diffs will now look something like:

``` bash
$ adiff 102094e70a2189ad3e134b73d18b4dd5a1e4325f ansible/roles/znc/vars/main.yml ansible/vault_pass.txt
--- /dev/fd/63  2016-04-25 21:15:01.390301209 -0400
+++ /dev/fd/62  2016-04-25 21:15:01.390301209 -0400
@@ -44,8 +44,8 @@
     Allow = *
     AltNick = marvin
     AppendTimestamp = false
-    AutoClearChanBuffer = true
-    AutoClearQueryBuffer = true
+    AutoClearChanBuffer = false
+    AutoClearQueryBuffer = false
     Buffer = 50
     DenyLoadMod = false
     DenySetBindHost = false
@@ -177,6 +177,12 @@
     </Pass>
   </User>
 
+
+
+
+
+
+
 znc_pem: |
   -----BEGIN RSA PRIVATE KEY-----
   MIIEpQIBAAKCAQEAoOQh3+N52SWwSa6WWWyZjHdUPA2Ccj2eK5DCJgrjHlqKJDZN
```

**Vault Passphrase in an Environment Variable**

If you would rather not store your Ansible Vault passphrase in a plaintext
file, you have the option of using an executable script instead. This is useful
if you use environment variables for this sort of thing (more information
available in the [Ansible
docs](http://docs.ansible.com/ansible/playbooks_vault.html#running-a-playbook-with-vault))

Here is one example of a `vault_pass.py`

``` python
#!/usr/bin/env python
import os
print os.environ['ANSIBLE_VAULT_PASSWORD']
```

Assuming the executable bits are set on `vault_pass.py`, you should now be able
to:

``` bash
ansible-vault --vault-password-file="vault_pass.py" view ansible/roles/znc/vars/main.yml
```

Enjoy!
