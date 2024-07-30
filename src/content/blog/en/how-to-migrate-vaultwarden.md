---
author: Daniel Garcia
pubDatetime: 2024-02-23T10:00:00Z
title: How to migrate vaultwarden
slug: how-to-migrate-vaultwarden
featured: false
draft: false
tags:
  - dev
  - opensource
  - ubuntu
  - vaultwarden
  - bitwarden
description: Learn how to migrate vaultwarden data from one instance to another.
---

## Background

I've recently updated my Vaultwarden instance in my home lab and wanted yo migrate all the previous data.

Yes, you can export the vault from the UI, but I had several users and don't have access to their accounts, so I needed another way to migrate everything to the new instance.

For context, I run Vaultwarden in an Ubuntu LXC in my Proxmox server. I used [tteck's awesome scripts](https://tteck.github.io/Proxmox/) to install it.

## Here's how to migrate your Vaultwarden data

### 1. Backup the original data

1. SSH into wherever you have Vaultwarden installed
2. Locate the `data` directory.
   Depending on your Vaultwarden version, the `data` folder can either be in:
   - `/opt/vaultwarden/data`
   - `/var/lib/vaultwarden/data`
3. Copy all the contents inside of `data` to a safe directory. I copied them to my local machine using `scp`.

### 2. Migrate the data to a new Vaultwarden instance

1. Install the new Vaultwarden instance
2. Stop Vaultwarden

```
systemctl stop vaultwarden
```

3. Remove the default data dir

```
sudo rm -r /opt/vaultwarden/data
```

4. Copy the current data over (I used SCP but you can use any file transfer system you like)
5. Remove the old RSA keys from the `data` directory. These will be recreated

```
sudo rm /opt/vaultwarden/data/rsa_key.pem
```

```
sudo rm /opt/vaultwarden/data/rsa_key.pub.pem
```

6. Change the directory ownership to vaultwarden

```
sudo chown -R vaultwarden:vaultwarden /opt/vaultwarden/data
```

7. Restart Vaultwarden

```
sudo systemctl start vaultwarden
```

Done!

You should now be able to reach Vaultwarden at the endpoint you've set it up and have all of your old data.
