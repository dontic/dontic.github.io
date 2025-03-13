---
author: Daniel Garcia
pubDatetime: 2024-10-15T13:45:03Z
modDatetime: 2024-10-15T14:57:03Z
title: 'How to properly redirect www to non-www with Cloudflare'
featured: false
draft: false
category: tech
tags:
  - webtech
  - domains
  - webdevelopment
  - SEO
description: 'Learn how to properly redirect www to non-www with Cloudflare'
ogImage: /src/content/blog/how-to-redirect-www-cloudflare/cover.png
---

- [Introduction](#introduction)
- [Step by step](#step-by-step)
- [Why do we need a DNS record for www pointing to a random IP address?](#why-do-we-need-a-dns-record-for-www-pointing-to-a-random-ip-address)
- [Manually adding the redirect rule](#manually-adding-the-redirect-rule)
- [Why do I get a `DNS_PROBE_FINISHED_NXDOMAIN` error?](#why-do-i-get-a-dns_probe_finished_nxdomain-error)

## Introduction

I've read countless tutorials and watched many YouTube videos until I found the correct way to implement a www redirect in Cloudflare.

When you have a website, you may want to redirect the www version of your domain to the non-www version. This is important for SEO, since search engines prefer a single source, and to avoid duplicate content issues. In this article, we will show you how to properly redirect www to non-www with Cloudflare.

## Step by step

1. Login to Cloudflare
2. Go to the domain you want to set up the redirect
3. Go to "DNS" > "Records" and remove any `www` record that you have
4. Now add a new `A` record with the name `www` and the IPv4 address `192.0.2.1` (this is the step that everyone is missing)
5. Make sure to leave the "Proxied" option on
6. Go to "Rules" > "Redirect Rules"
7. Hit "+ Create Rule"
8. Under "Create new Single Redirect" there is a "Redirect from WWW to Root" snippet. Click on "Create a Rule" in that snippet
9. Change the Rule name if you want and hit "Deploy"

That's it! You have successfully redirected www to non-www with Cloudflare.

> **IMPORTANT!** You might see that these rules aren't working in your browser. This is because the browser caches the redirects so it might take a while for your browser to update.
>
> To make sure that it's working:
>
> 1. Try it from a different browser/laptop/phone
> 2. Use this command: `curl -I https://www.example.com` and you should see a `301 Moved Permanently` and a `location:...` with the destination of the redirect in the response

## Why do we need a DNS record for www pointing to a random IP address?

`192.0.2.1` is just a dummy IP address, you could literally use any IP address you want.

This particular address is commonly used in local networks so, as a public IP, it won't really go anywhere.

The reason we need to add this record is because Cloudflare needs to have a record for the `www` subdomain in order to create the redirect rule. Otherwise it will give a `DNS_PROBE_FINISHED_NXDOMAIN` error as the 'Internet' will think that there is nothing matching that DNS record (www.example.com).

> It's like going to the movies but not even having the movie you want to watch.
>
> The other way around, if you go and there's the movie, the guy at the entrance will point you to the correct room number.

If you want to learn more about this you can check https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/

## Manually adding the redirect rule

If you prefer to manually add the redirect rule, you can do so by creating a new rule under "Rules" > "Redirect Rules" and filling in the following fields:

- **If incoming requests match...** - Select "Wildcard pattern"
- **Request URL**: `https://www.*`
- **Target URL**: `https://${1}`
- **Status Code**: `301`

What this does is get the asterisks part of www request and use it in the target URL. This way, if someone goes to `www.example.com`, they will be redirected to `example.com`.

## Why do I get a `DNS_PROBE_FINISHED_NXDOMAIN` error?

If you get this error, it means that there is no DNS record for the `www` subdomain.

Make sure you have added the `A` record with the name `www` and a dummy IP address like `192.0.1.2` (See step 4 of the guide above).
