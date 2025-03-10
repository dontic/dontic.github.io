---
title: Publishing your Google Cloud Project App
description: Learn how to publish and certify your Google Cloud Project App.
pubDatetime: 2023-03-18T00:00:00Z
modDatetime: 2024-05-24T00:00:00Z
author: Daniel Garcia
# slug:
featured: false
draft: false
tags:
  - tech
  - dev
  - webdev
  - googlecloud
  - react
  - django

ogImage: ./cover.png
# canonicalURL:
---

This is a 4 part series where I explain the proces for publishing a Google Cloud Project App.

In particular, how I've done this process for [Emilio](https://getemil.io).

## Table of contents

## The 3 (long) steps

| Step | Description                                                                                                               | Dificulty | Time       |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| 1    | [Ask Google to publish your app](/blog/publishing-your-google-cloud-project-app-ask-for-your-google-app-to-be-published/) | Easy      | ~minutes   |
| 2    | [Resolve Google's queries](/blog/publishing-your-google-cloud-project-app-resolve-google-queries/)                        | Moderate  | ~1-2 weeks |
| 3    | [Get the CASA Tier 2 certification](/blog/publishing-your-google-cloud-project-app-get-the-casa-tier-2-certification/)    | Hard      | ~3-6 weeks |

## **Foreword**: Why would you want your project's app published

You’ll find that creating a Google Cloud Project is quite easy and enables you to interact with their many APIs. The problem comes if you want to launch the service to the public.

By default the Google App will be in test mode, this has a couple of drawbacks as you probably already know:

1. For a user to use your tool you need to add it to the test users list.

2. There is a limit of 100 users and you **CANNOT** delete any. You onboarded 100 test users but only 30 are really using your service? Well you’re in bad luck, you cannot delete those 70 stallers to add more users.

3. The users' refresh tokens will expire after 7 days, so they will need to sign out and sign in again and you will have to do weird stuff in your backend to ensure the refresh token is saved again.

4. Users will get a super ugly message saying that your application is not trusted. In some cases, depending on their privacy settings, they won’t even be able to sign it at all.

## The steps to publish a Google App

There are basically 3 steps you need to do when publishing your Google App:

1. [Ask Google to publish your app](/blog/publishing-your-google-cloud-project-app-ask-for-your-google-app-to-be-published/): This is the very first step you need to do in order to publish your Google Cloud Project App. It's just a matter of having some preparation and a (minimal) working app.

2. [Resolve Google's queries](/blog/publishing-your-google-cloud-project-app-resolve-google-queries/): Once you've submitted your app for review, Google will start asking you a series of questions to ensure your app is compliant with their policies. This article will have some tips to help you avoid some of the pitfalls we encountered.

3. [Get the CASA Tier 2 certification](/blog/publishing-your-google-cloud-project-app-get-the-casa-tier-2-certification/): Google has approved the initial process, and now you need to certify your app with the CASA Tier 2 certification. This process can take from 3 to 6 weeks depending on your app complexity and how fast PWC (the agency in charge of providing the CASA certification) replies.

**Disclaimer:**

There will be some things I’ll explain that might be specific to Emilio's application spec, which uses django rest framework + react.

The API is deployed in api.domain.com and the frontend in domain.com.

---

Whenever you're ready to start the process, let's go to step 1:

[Ask Google to publish your app](#)
