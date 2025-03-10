---
author: Daniel Garcia
pubDatetime: 2024-09-03T18:34:23Z
# modDatetime:
title: "The ultimate Astro + Google Analytics guide"
featured: false
draft: false
tags:
  - dev
  - astro
  - google-analytics
description: "Learn how to integrate Google Analytics (GA4) with Astro in multiple ways. Using Partytown, View Transitions, CookieConsent V3 and more."
---

<details>
  <summary><b><font size="+5">Index</font></b></summary>

- [Introduction](#introduction)
- [0. Get your GA4 tracking ID](#0-get-your-ga4-tracking-id)
- [1. Basic implementation](#1-basic-implementation)
- [2. Implementing Partytown](#2-implementing-partytown)
- [The catch](#the-catch)
  - [No consent](#no-consent)
  - [How do we solve this?](#how-do-we-solve-this)
- [2. Implementing GA4 with CookieConsent V3](#2-implementing-ga4-with-cookieconsent-v3)
  - [2.1 The easy way](#21-the-easy-way)
  - [2.2 The easy way with consents](#22-the-easy-way-with-consents)
  - [2.3 The advanced way with consents](#23-the-advanced-way-with-consents)
- [3. Implement CookieConsent with View Transitions](#3-implement-cookieconsent-with-view-transitions)
  - [3.1 Run the GA4 scripts on every page change.](#31-run-the-ga4-scripts-on-every-page-change)
  - [3.2 Put the CookieConsent component inside an element that is not affected by the view transitions.](#32-put-the-cookieconsent-component-inside-an-element-that-is-not-affected-by-the-view-transitions)
  - [3.3 Create a script to get the CookieConsent html class attributes and restore them on every page change.](#33-create-a-script-to-get-the-cookieconsent-html-class-attributes-and-restore-them-on-every-page-change)

</details>

## Introduction

I'm writing this because, while implementing basic GA4 analytics is easy, there are a lot of gotchas when it comes to implementing:

- Consent management
- [View transitions](https://docs.astro.build/en/guides/view-transitions/)
- [CookieConsent V3](https://cookieconsent.orestbida.com/)

So I wrote this guide with multiple implementations, from easy to advanced, to help you integrate Google Analytics (GA4) with Astro.

## 0. Get your GA4 tracking ID

If you don't have it yet, follow these steps to get your GA4 tracking ID:

1. Go to [Google Analytics](https://analytics.google.com/) and sign in with your Google account (or create one).

2. In [Admin](https://support.google.com/analytics/answer/6132368), click Create, then select Account.

3. Provide an account name and click Next.

4. Create a new Google Analytics 4 property.

5. Fill in the requested data and hit **Create**.

6. It will prompt you with a data stream, which will provide you with the tracking ID. It should have the format `G-XXXXXXXXXX`. Note this down and continue!

## 1. Basic implementation

> **Note:**
>
> Usually, in Astro applications, we have a main `Layout.astro` component that we then use in all pages. This is super convenient because we can add the GA4 script, amongst many other common things like meta tags, to the `head` tag of this component and it will be included in all pages.
>
> If you don't have a `Layout.astro` component, I really recommend you create one. It will make your life easier in the long run.

The basic implementation is quite straightforward and you can follow the code that Google provides to you when you create the property data stream.

You just need to add the GA4 script to your `head` tag.

```html
<!-- Google tag (gtag.js) -->
<script
  is:inline
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-XXXXXXXXXX");
</script>
```

Remember to change `G-XXXXXXXXXX` with your tracking ID!

> Notice that we are using the `is:inline` attribute in the script tags.
>
> This is so that Astro ignores all the optimizations it does to scripts and just includes them as they are. This is important because we want to include the GA4 script as is, without any modifications.

That's it! See how easy it was?

## 2. Implementing Partytown

**What is Partytown?**

Partytown is a library that allows you to run third-party scripts in a Web Worker. This is great because it allows you to run scripts like Google Analytics in a separate thread, which can improve performance quite a bit.

To use this you first need to [install partytown](https://docs.astro.build/en/guides/integrations-guide/partytown/) in your Astro project.

**Installation:**

1. Install Partytown:

```bash
npm install partytown
```

2. Add the following to your `astro.config.mjs`:

```js
import { partytown } from "astro/config";

export default defineConfig({
  // ...
  integrations: [partytown({ config: { forward: ["dataLayer.push"] } })],
});
```

Then you can add the following code to your `Layout.astro` component:

```html
<!-- Google tag (gtag.js) -->
<script
  is:inline
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>

<script is:inline type="text/partytown">
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-XXXXXXXXXX");
</script>
```

## The catch

The two previous implementations have a catch though.

### No consent

These will track all analytics as this implementation does not include consent management. This means you won't be GDPR compliant, and **can get you in trouble in some countries**.

### How do we solve this?

This issue can be solved 2 ways:

#### 1. Implement default denied consents and ONLY collect anonymous data.

In your GA4 script tags, you can add the following code:

```html
<!-- Google tag (gtag.js) -->
<script
  is:inline
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>

<script is:inline type="text/partytown">
  window.dataLayer = window.dataLayer || [];
  function gtag() {
      dataLayer.push(arguments);
  }
  gtag("js", new Date());

  // This should ALWAYS be set before the gtag("config", "G-XXXXXXXXXX"); line
  gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
  });

  gtag("config", "G-XXXXXXXXXX");
</script>
```

#### 2. Implement what is called a "cookie consent banner".

You've seen these everywhere, they are those annoying popups that you either need to accept or decline when you visit a website.

They are indeed annoying, but they are also necessary to avoid legal issues.

Continue reading to see how to implement this with CookieConsent V3.

## 2. Implementing GA4 with CookieConsent V3

> I freaking love [CookieConsent](https://cookieconsent.orestbida.com/) ❤️

It's a super easy to use library that allows you to implement a cookie consent banner in a few lines of code.

I'll show you 3 ways of implementing this, the easy way, the easy way but with consents and the advanced way with consents.

### 2.1 The easy way

Head over to https://playground.cookieconsent.orestbida.com/ and poke around the different parameters until you have a cookie consent banner that you like. Make sure you have the "**Analytics**" option checked under "**Categories**".

Then, at the bottom you'll see a "Download the `cookieconsent-config.js` javascript file" button. Click it and download the file.

Place this file in the `src` directory of your Astro project. I specifically like putting mine in `src/scripts/` so I assume you do the same.

Then, in your `Layout.astro` component, add the following code:

```html
<head>
  ... some code ...
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css"
  />
  ... some more code ...
</head>

<body>
  ... some code ...
  <script type="module" src="/src/scripts/cookieconsent-config.js"></script>
  ... some more code ...
</body>
```

Now back to the GA4 implementation in `Layout.astro` (I assume you went with the Partytown implementation), you need to add `data-category="analytics"` to the script tags.

```html
<!-- Google tag (gtag.js) -->
<script
  data-category="analytics"
  is:inline
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>

<script data-category="analytics" is:inline type="text/partytown">
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-XXXXXXXXXX");
</script>
```

**What does this do?**

This tells CookieConsent that the scripts with `data-category="analytics"` are analytics scripts and should only be run if the user has accepted the analytics category. Pretty nice right?

### 2.2 The easy way with consents

**What do I mean by consents?**

In the previous implementation we do not execute the GA4 scripts if or until the user has accepted the analytics category. This will prevent any data collection until the user has accepted the analytics category.

Google allows us to actually collect some anonymous data while being GDPR compliant. This data, like page visits, will be collected anonymously and will not be used for any tracking purposes.

Then, if the user accepts the analytics category, we can collect more data like user interactions, etc.

**Cool! How do I do this?**

It's easy:

1. Initialize the GA4 scripts with default consents:

````html
```html
<!-- Google tag (gtag.js) -->
<script
  is:inline
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>

<script is:inline type="text/partytown">
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  <!-- This is the important part! -->
  gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
  });

  gtag("config", "G-XXXXXXXXXX");
</script>
````

> Note we removed the `data-category="analytics"` from the first script tag, since now we don't need to wait for the user to accept the analytics category to collect anonymous data.

> ⚠️ The consent defaults should **ALWAYS** be set before the `gtag("config", "G-XXXXXXXXXX");` line.

2. Create a function to update the consents when the user accepts the analytics category in `<head>`:

```html
<script is:inline data-category="analytics">
  function updateConsents() {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  }
</script>
```

With this implementation we update the consents when the user accepts the analytics category.

### 2.3 The advanced way with consents

> ⚠️ **IMPORTANT:**
>
> Note that for this you will need to **uninstall Partytown** or **at least remove its datalayer configuration** in `astro.config.mjs`.
>
> This is because Partytown doesn't work well with this implementation.

If you want to have more control over the cookie consent banner, you can implement it by directly installing the library.

The CookieConsent owner has a pretty amazing [StackBlitz](https://stackblitz.com/edit/withastro-astro-mvdsyj?file=src%2Fcomponents%2FCookieConsentConfig.ts) example that you can use as a base. I will explain here what he's done:

#### 2.3.1. Install the library:

```bash
npm install vanilla-cookieconsent
```

#### 2.3.2. Create the necessary files

Create a `CookieConsentConfig.ts` and a `CookieConsent.astro` in your `src/components` directory. I like creating this specifically under `src/components/cookie-consent` just to have it organized. From now one I will assume you do the same.

#### 2.3.3. In `CookieConsentConfig.ts`:

```ts
import type { CookieConsentConfig } from "vanilla-cookieconsent";

export const config: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box inline",
      position: "bottom left",
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      readOnly: true,
    },
    functionality: {},
    analytics: {
      services: {
        ga4: {
          label:
            '<a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank">Google Analytics 4 (dummy)</a>',
          onAccept: () => {
            console.log("ga4 accepted");
            // TODO: load ga4
          },
          onReject: () => {
            console.log("ga4 rejected");
          },
          cookies: [
            {
              name: /^_ga/,
            },
          ],
        },
        another: {
          label: "Another one (dummy)",
        },
      },
    },
  },
  language: {
    default: "en",
    autoDetect: "browser",
    translations: {
      en: {
        consentModal: {
          title: "Hello traveller, it's cookie time!",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
          footer:
            '<a href="#link">Privacy Policy</a>\n<a href="#link">Terms and conditions</a>',
        },
        preferencesModal: {
          title: "Consent Preferences Center",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close modal",
          serviceCounterLabel: "Service|Services",
          sections: [
            {
              title: "Cookie Usage",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            },
            {
              title:
                'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              linkedCategory: "necessary",
            },
            {
              title: "Functionality Cookies",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              linkedCategory: "functionality",
            },
            {
              title: "Analytics Cookies",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              linkedCategory: "analytics",
            },
            {
              title: "More information",
              description:
                'For any query in relation to my policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact me</a>.',
            },
          ],
        },
      },
    },
  },
};
```

#### 2.3.4. In `CookieConsent.astro`:

```html
---
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import '../styles/ccElegantBlack.css';
---

<button type="button" data-cc="show-preferencesModal">
  Show preferences modal
</button>

<script>
  import { run } from "vanilla-cookieconsent";
  import { config } from "./CookieConsentConfig";

  run(config);
</script>
```

#### 2.3.5. Back in your `Layout.astro`:

```astro
---
// ... some code ...
import CookieConsent from "../components/CookieConsent.astro";
---

...
<body>
  <slot />
  <CookieConsent />
</body>
...
```

#### 2.36. Now let's modify those GA4 script tags so they are a bit more dynamic. Back in your `Layout.astro`:

Remove the previous GA4 scripts if you had any and add the following:

```astro
<head>
  <!-- ... some code ... -->

  <!-- GA4 -->
  <script
    is:inline
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

  <script>
    // We need a global definition to avoid type warnings
    declare global {
      interface Window {
        dataLayer: Record<string, any>[];
        gtag: (...args: any[]) => void;
      }
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    };

    // Load GA4 with denied default consents
    window.gtag("js", new Date());
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    window.gtag("config", "G-XXXXXXXXXX");
  </script>

  <!-- ... some more code ... -->
</head>
```

#### 2.37. And finally, we create an action in `CookieConsentConfig.ts` to update the consents:

```ts
import type { CookieConsentConfig } from "vanilla-cookieconsent";

// Extend the Window interface to include the dataLayer object
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}

export const config: CookieConsentConfig = {
// ...
    analytics: {
      enabled: true,
      services: {
        ga: {
          label: "Google Analytics",
          onAccept: () => {
            // Grant consent to the Google Analytics service
            console.log("ga4 granted");

            window.gtag("consent", "update", {
              ad_storage: "granted",
              ad_user_data: "granted",
              ad_personalization: "granted",
              analytics_storage: "granted",
            });
          },
          onReject: () => {
            // Don't enable Google Analytics
            console.log("ga4 rejected");
          },
// ...
```

This implementation does not differ too much from the easy way with consents, but it gives you a couple of benefits:

1. First you have type safety in your `CookieConsentConfig.ts` file. Meaning you will see warnings if you mess up the configuration.
2. You have more control over the cookie consent banner. You can declare specific services and actions when the user accepts or rejects them.
3. You can have a more dynamic implementation of the GA4 scripts. I.e.(forshadowing) you can use it with view transitions.

## 3. Implement CookieConsent with View Transitions

To make this work you will need to part from [the implementation we've done in 2.3](#23-the-advanced-way-with-consents).

The caviat here is that Astro View Transitions do 2 things that affect the GA4 scripts:

1. They reset scripts on every page change. Meaning that the scripts will run ONCE on first load, but not on subsequent page changes.
2. They also reset the html attributes and CookieConsent uses these to keep track of the user's consents.

To solve this we need to do a couple of things (remember you need to implement everything in [2.3](#23-the-advanced-way-with-consents) first):

### 3.1 Run the GA4 scripts on every page change.

To do this we need to add an event listener on `astro:page-load` that will run the GA4 scripts on every page change.

In your `Layout.astro`:

```astro
<head>
  <!-- GA4 -->
  <script
    is:inline
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

  <script>
    declare global {
      interface Window {
        dataLayer: Record<string, any>[];
        gtag: (...args: any[]) => void;
      }
    }

    // This is the important part!
    document.addEventListener("astro:page-load", () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
      window.gtag("config", "G-XXXXXXXXXX");
    });
  </script></head
>
```

Now the GA4 scripts will run on every page load and change, cool!

### 3.2 Put the CookieConsent component inside an element that is not affected by the view transitions.

In your `Layout.astro`:

```astro
<body>
  <slot />
  <div transition:persist="find-me-on-the-other-side" id="cc-container">
    <CookieConsent />
  </div>
</body>
```

> ⚠️ Note that we set the `transition:persist` attribute to `find-me-on-the-other-side`. This is just a dummy value, you can put whatever you want here.
>
> If we didn't put anything in there, Astro would get confused when using `transition:name` in other components as it won't know what transition to ignore here.

In your `CookieConsentConfig.ts`:

```ts
export const config: CookieConsentConfig = {
  // Indicate the consent to live in the #cc-container element
  root: "#cc-container",
```

### 3.3 Create a script to get the CookieConsent html class attributes and restore them on every page change.

Back in your `Layout.astro`:

```astro
<body>
  <slot />
  <div transition:persist="find-me-on-the-other-side" id="cc-container">
    <CookieConsent />

    <script is:inline>
      // Restore the `show--consent` class if it was present before the page swap
      document.addEventListener("astro:before-preparation", event => {
        const htmlClassName = window.document.documentElement.className;
        const consentClassPresent = htmlClassName.includes("show--consent")
          ? true
          : false;
        window._showConsentClass = consentClassPresent;
      });

      document.addEventListener("astro:before-swap", event => {
        const showConsent = window._showConsentClass ? ` show--consent` : "";
        event.newDocument.documentElement.className += showConsent;
      });
    </script>
  </div>
</body>
```

And that's it! You now have a fully working implementation of GA4 with CookieConsent. You can now track your users and be GDPR compliant.
