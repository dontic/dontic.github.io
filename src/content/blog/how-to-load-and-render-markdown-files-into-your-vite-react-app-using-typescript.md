---
author: Daniel Garcia
pubDatetime: 2024-03-28T10:00:00Z
title: How to load and render Markdown files into your Vite React app using Typescript
slug: how-to-load-and-render-markdown-files-into-your-vite-react-app-using-typescript
featured: false
draft: false
category: tech
tags:
  - dev
  - webdev
  - react
  - vite
  - typescript
  - chakraui
description: Learn how to load and render Markdown in your Vite React app using Typescript.
---

### Backstory (Skip it if you want)

Ok so I was **REALLY **struggling with this one.

I'm building an app, and for ease of use and maintenance, for the terms and conditions, privacy policy and other stuff I wanted to write them in markdown instead of plain TSX\.

I could not find anything on my particular environment: Vite \+ React \+ Typescript \+ ChakraUI\.

So here's what worked for me:

## The solution

### Test your markdown flow

First thing's first, get your markdown rendering straight:

Install `react-markdown` :

```bash
npm i react-markdown
```

If you don't use ChakraUI skip this step:

Install `chakra-ui-markdown-renderer` :

ChakraUI messes with the typical `<h2>` and other HTML stuff, so `react-markdown` won't work unless we pass a custom renderer:

```bash
npm i chakra-ui-markdown-renderer
```

Now create a simple component to test your markdown:

```javascript
import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

const MarkdownTest = () => {
  return (
    <Box>
      <ReactMarkdown
        children={`# This is markdown!`}
        components={ChakraUIRenderer()} // Skip this if you don't use ChakraUI
        skipHtml // Skip this if you don't use ChakraUI
      />
    </Box>
  );
};

export default MarkdownTest;
```

You should see markdown when rendering this component\. If so, let's move on to how to import markdown files\.

### Importing Markdown Files

Now for the part I struggled with the most\.

First we need to tell Typescript that markdown files are "importable" and not a usual module\. Go to your `vite-env.d.ts` and add this line:

```sql
declare module "*.md";
```

Cool? Cool\.

Now we need to tell vite how to actually get the data inside of the markdown files\. Go to your `vite.config.ts` and create a custom plugin for this:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to load markdown files
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.slice(-3) === '.md') {
          // For .md files, get the raw content
          return `export default ${JSON.stringify(code)};`;
        }
      },
    },
  ],
});
```

We're almost there\! \!

Now go and create a markdown file, for instance `test.md` \.

In your component import it and add it and pass it to react markdown\! \!

```javascript
import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

// Import markdown files
import markdown from 'test.md';

const MarkdownTest = () => {
  return (
    <Box>
      <ReactMarkdown
        // Pass it as children
        children={markdown}
        components={ChakraUIRenderer()} // Skip this if you don't use ChakraUI
        skipHtml // Skip this if you don't use ChakraUI
      />
    </Box>
  );
};

export default MarkdownTest;
```

That's it\! You should see your markdown file rendered in all of its glory\.

Hope these hours of research help someone\. Cheers\!
