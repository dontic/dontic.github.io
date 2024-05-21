---
author: Daniel Garcia
pubDatetime: 2024-03-18T09:10:56Z
title: How the **** do I actually spin up an Ubuntu AWS EC2 instance?
slug: how-the-do-i-actually-spin-up-an-ubuntu-aws-ec2-instance
featured: false
draft: false
tags:
  - dev
  - webdev
  - aws
  - ubuntu
  - docker
  - ec2
description: Learn how to spin up an ubuntu aws ec2 instance easily.
---

At [getemil\.io](http://getemil.io) , we got a generous AWS package that lets us use some of their services for free\. The problem is… I had no experience whatsoever with AWS and their UI is a nightmare \(totally a subjective opinion\) \. So… how did I do this thing?

This is a 2part article:

1. How to spin up an EC2 instance
2. How do I connect to the EC2 instance

### Context

Feel free to skip this\.

For our MVP we wanted to keep it simple, only a handful of users are going to test the MVP so scaling won’t be a problem\. That’s when we decided to keep it simple, a simple Ubuntu machine \+ Docker should suffice\.

Introducing EC2\!

EC2 is a VPS \(Virtual Private Server\) just like a Digital Ocean Droplet or a Raspberry Pi in your home\.

### How to spin up an EC2 instance

#### 1\. Head on to [https://eu\-central\-1\.console\.aws\.amazon\.com/ec2](https://eu-central-1.console.aws.amazon.com/ec2)

I’m in EU, remember to change your region if necessary\.

#### 2\. Click on “Launch Instance”

#### 3\. Set the name of the Instance

There’s a name field under “Name and tags”\. Honestly, whatever you like, I called mine **Peter** \.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/86ovju957mqduv56tcsg.png)

#### 4\. Select the Image type

I really enjoy deploying in Ubuntu, it’s not the lightest OS for web\-dev, but I’m super familiar with it and comes with a lot of utilities I use right of the bat\.

For this, I selected the 64\-bit Ubuntu Server 22\.04 instance type:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mnhz1gpx8lhuag6sewwc.png)

#### 5\. Select the instance type

How much CPU and RAM do I need? You ask\.

Just start with the free one and scale if needed\. I say\.

Seriously, don’t sweat it, start with the free tier and monitor your server load\. Increase CPU/RAM as you go\.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eak2hvikbiosgfxrs5rv.png)

#### 6\. Generate a new key pair

Hit “Create new key pair”, it will download a `.pem` file to your computer\. Save that somewhere secure, you’re gonna need it\.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g1ph2imfiog2kageh145.png)

#### 7\. Set routing rules

1. Enable SSH

You will need SSH, since you will need to connect to the server to manage everything\.

2\. Enable HTTPS or HTTP as needed

I’m deploying a Django app \(in Docker\) so I actually want to allow HTTPS traffic into the server\.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7nbaw7jtk7x2qbxdbnuv.png)

I do NOT recommend allowing SSH from anywhere, this can make your server more prone to attacks\. AWS allows you to select your computer’s IP so please do that:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7pvf2gn8za7zs65shelt.png)

#### 8\. Select storage

I just use 64gb of gp2 \(it’s shared SSD storage\), works completely fine\. Set the storage size to whatever you want\. If you’re going to deal with a lot of heavy files increase it accordingly\.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fm7ocp12lj42raiq1tx2.png)

#### 9\. Execute\!

You’re ready now\! On the right of the screen, hit “Launch Instance”

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/150r8ah7e662q7bp87c1.png)

### Ok, great, how the \* \* \* \* do I connect to my EC2 instance?

Easy there cowboy\.

We will use SSH\.

#### 1\. Set up the keys

Remember that `.pem` file you downloaded in step 6? Open it with your favorite text editor \(go go notepad\+ \+ \) and copy the private key inside\.

I connect via SSH from my Ubuntu WSL in windows, but you can use terminal in MAC just fine:

Create a new file:

```bash
nano PeterKeys.pem
```

\(I use nano, so what, fight me\)

Paste the key you copied and save using `ctrl+x` or `cmd+x` \.

#### 2\. Gather connection data

Go to your AWS EC2 instance details and copy the public IPv4 DNS:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eprk202firfeeb8spoxq.png)

#### 3\. Connect\!

The default user for an Ubuntu instance is `ubuntu` \.

Run the following:

```css
ssh -i PeterKeys.pem ubuntu@ipv4-address-you-just-copied
```

Done\! You should be inside your EC2 instance\.

What I like to do now is create my user and add my local machine’s SSH keys to `authorized_keys` so I can connect directly to my user\. This will be explained in another post\.
