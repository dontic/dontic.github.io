---
author: Daniel Garcia
pubDatetime: 2024-06-14T12:56:35Z
# modDatetime: 2024-06-14T12:56:35Z
title: How to create an API endpoint in Astro
slug: how-to-create-an-api-endpoint-in-astro
featured: false
draft: false
tags:
  - tech
  - dev
  - astro
description: Learn how to create API endpoints directly in your Astro app and create a contact in Brevo with it.
---

## Table of contents

## Introduction

Gone are the days when you had to create a separate API server to serve your frontend application. With Astro, you can create API endpoints directly in your app. Which means you can even create a full-stack application with just one codebase.

Personally, I use these endpoints for simple actions such as:

- Contact Forms
- Newsletter subscriptions
- User registration
- Even user authentication sometimes

It's also useful for when you need to fetch and process data from a source that requires authentication (I.e. an API key) and you don't want to expose that key in the frontend.

In this article we'll go through the steps to create an API endpoint in Astro.

## What's the setup?

In this article we'll create a **simple API endpoint that creates a contact in Brevo**, which is mostly what I use these endpoints for. You can replace this with any other service you want to interact with.

### 1. Ready your Astro project

If you're new to Astro or haven't set up an Astro project yet, I recommend you to check out the [official documentation](https://docs.astro.build/en/getting-started/).

You can also start with one of their [themes](https://astro.build/themes/).

### 2. SSR

In order to have a working API endpoint that works at runtime, you need to enable [SSR (Server Sider Rendering)](https://docs.astro.build/en/guides/server-side-rendering/).

SSR allows you to have the app run on the server before it gets to the client.

#### 2.1 Adapter

For this, you will need an adapter.

> What an adapter does is it allows you to run your SSR Astro App in different environments. For example, you can run it in a serverless environment like Vercel or Netlify, or in a Node.js server.

You can see a list of official and community adapters [here](https://docs.astro.build/en/guides/server-side-rendering/#official-adapters).

For this article, I'll use the [`@astrojs/adapter-node` adapter](https://docs.astro.build/en/guides/integrations-guide/node/) since I host my side in a Node docker container.

Super easy to install:

```bash
npx astro add node
```

#### 2.2 `server` or `hybrid`

Astro [allows you to run SSR in 2 ways](https://docs.astro.build/en/guides/server-side-rendering/#enable-on-demand-server-rendering):

- `server`: On-demand rendered by default. Basically uses the server for everything. Use this when most of your site should be dynamic. You can opt-out of SSR for individual pages or endpoints.

- `hybrid`: Pre-rendered to HTML by default. It does not pre-render the page on the server. Use this when most of your site should be static. You can opt-in to SSR for individual pages or endpoints.

For my usecase where most of my site is static (it's a landing page after all) I use `hybrid`:

```js
// astro.config.mjs

import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
});
```

#### 2.3 A note on environment variables

If you're used to Astro, you know that you can use environment variables by calling:

```ts
const MY_VARIABLE = import.meta.env.VARIABLE_NAME;
```

However, because Astro is static by default, what this really does is get the environment variable at build time. Then, the variable is hardcoded into the build code, which means that if you change the environment variable after the build, it won't be reflected in the code.

If you use SSR it works differently, `import.meta.env` won't work since it's available at build time but not at runtime on the server.

You will need to use `process.env` instead:

```ts
const MY_VARIABLE = process.env.VARIABLE_NAME;
```

BUT WAIT!

There's another catch, and that's that `process.env` is not available with `npm run dev`, which means your code will crash when you try to run it locally.

The solution:

```ts
const MY_VARIABLE = import.meta.env.VARIABLE_NAME ?? process.env.VARIABLE_NAME;
```

This code will try to get the environment variable from `import.meta.env` first, and if it's not available it will try to get it from `process.env`. This way, your code will work both in development and production.

#### 2.4 A note on `console.log`

If you're used to using `console.log` to debug your code, you'll know that it will show up in the browser console when you're running the app in development mode.

When using `console.log` in an SSR component, because it runs on the server, the logs will show up in the terminal where you're running the app.

So if you're looking for your logs and can't find them, check the terminal where you're running the app.

### 3. File structure

The full functionality needs 2 files:

- A `.js` or `.ts` API endpoint file that lives in the `src/pages/api` directory.
- A form that gets the user input and sends it to the API endpoint. I personally like to do this in a `.tsx` file because I can then use the full power of react (`react-hook-form` and `zod`) to handle the form.
  Place this form wherever you like, I like having all my forms in `src/components/forms`.

That's pretty much it! The form will send the data to our API endpoint, which will then process it and send it to Brevo.

---

## The API endpoint

### 1. Create the file

Let's create the API endpoint that will send the data to Brevo.

You can create this endpoint wherever you want under the `src/pages/` directory depending on where you want it to be accessible.

For instance, I like my endpoints to be accessible under `/api/` so I create a `src/pages/api/` directory.

So my endpoint file will be `src/pages/api/create-brevo-contact.ts`.

This means that I will be able to access it at `http://mydomain.com/api/create-brevo-contact`.

---

### 2. The code

Your API endpoint code should have a pretty simple structure:

```ts
// SSR API endpoint template

// Tell Astro that this component should run on the server
// You only need to specify this if you're using the hybrid output
export const prerender = false;

// Import the APIRoute type from Astro
import type { APIRoute } from 'astro';

// This function will be called when the endpoint is hit with a GET request
export const GET: APIRoute = async ({ request }) => {
  // Do some stuff here

  // Return a 200 status and a response to the frontend
  return new Response(
    JSON.stringify({
      message: 'Operation successful',
    }),
    {
      status: 200,
    }
  );
};
```

Following the template above, this is a simple POST API endpoint to create a contact in Brevo. Everything is commented so you can understand what's going on:

```ts
// src/pages/api/create-brevo-contact.ts

// Because I chose hybrid, I need to specify that this endpoint should run on the server:
export const prerender = false;

// Import the APIRoute type from Astro
import type { APIRoute } from 'astro';

// This is the function that will be called when the endpoint is hit
export const POST: APIRoute = async ({ request }) => {
  // Check if the request is a JSON request
  if (request.headers.get('content-type') === 'application/json') {
    // Get the body of the request
    const body = await request.json();

    // Get the email from the body
    const email = body.email;

    // Declares the Brevo API URL
    const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

    // Gets the Brevo API Key from an environment variable
    // Check the note on environment variables in the SSR section of this article to understand what is going on here
    const BREVO_API_KEY = import.meta.env.BREVO_API_KEY ?? process.env.BREVO_API_KEY;

    // Just a simple check to make sure the API key is defined in an environment variable
    if (!BREVO_API_KEY) {
      console.error('No BREVO_API_KEY defined');
      return new Response(null, { status: 400 });
    }

    // The payload that will be sent to Brevo
    // This payload will create or update the contact and add it to the list with ID 3
    const payload = {
      updateEnabled: true,
      email: email,
      listIds: [3],
    };

    // Whatever process you want to do in your API endpoint should be inside a try/catch block
    // In this case we're sending a POST request to Brevo
    try {
      // Make a POST request to Brevo
      const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the request was successful
      if (response.ok) {
        // Request succeeded
        console.log('Contact added successfully');

        // Return a 200 status and the response to our frontend
        return new Response(
          JSON.stringify({
            message: 'Contact added successfully',
          }),
          {
            status: 200,
          }
        );
      } else {
        // Request failed
        console.error('Failed to add contact to Brevo');

        // Return a 400 status to our frontend
        return new Response(null, { status: 400 });
      }
    } catch (error) {
      // An error occurred while doing our API operation
      console.error('An unexpected error occurred while adding contact:', error);

      // Return a 400 status to our frontend
      return new Response(null, { status: 400 });
    }
  }

  // If the POST request is not a JSON request, return a 400 status to our frontend
  return new Response(null, { status: 400 });
};
```

That's it, you now have a working API endpoint that will create a contact in Brevo when hit with a POST request!

---

## The form

As a bonus, I also want to show you how I code my forms to make them responsive.

For this example, I'll create a simple form, with only an email field and a submit button, that will send the email a user inputs to the API endpoint we created.

Here's the code:

> Note that this code is using shadcn ui components for the HTML, you might need to replace them with your own components.

```tsx
// WaitlistForm.tsx

// Zod validation stuff
const WaitlistFormSchema = z.object({
  email: z.string().min(1, 'Please enter a valid email').email('Please enter a valid email'),
});

type WaitlistFormValues = z.infer<typeof WaitlistFormSchema>;

const WaitlistForm = () => {
  // Hooks to check the status of the form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // React Hook Form stuff
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(WaitlistFormSchema),
    defaultValues: {
      email: '',
    },
  });

  // Function that sends the data to the API endpoint when the form is submitted
  const onSubmit = async (data: WaitlistFormValues) => {
    setIsSubmitting(true);

    // Ping out API endpoint
    const response = await fetch('/api/create-brevo-contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // If successful, reset the form and show a success message
    if (response.ok) {
      form.reset();
      setIsSuccess(true);
    } else {
      // If failed, show error message
      console.error('Failed to add contact');
      setIsSuccess(false);
      setError("There's been an error. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      {isSuccess && (
        <Alert className="mb-3 border-green-300 bg-green-100 md:mb-8">
          <AlertTitle>Thanks!</AlertTitle>
          <AlertDescription>
            We've added you to the waitlist!
            <br />
          </AlertDescription>
        </Alert>
      )}

      {!isSuccess && error && (
        <Alert className="mb-8 border-red-300 bg-red-100">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="bg-transparent" placeholder="email@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            <Loader2 className={`mr-2 h-6 w-6 animate-spin ${isSubmitting ? 'block' : 'hidden'}`} />
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default WaitlistForm;
```
