# daniel.es

My Personal Blog

## Dev.to functionality

Created a functionality to automatically sync certain articles with dev.to

**Setup:**

- Ensure you have the following variables in an `.env` file:
  ```text
  DEVTO_TOKEN=123456
  DEVTO_REPO=<github username>/<github repo>
  DEVTO_BRANCH=<branch name>
  ```

**Steps to generate and push articles:**

1. Create a blog post like usual.
2. Set the flag `deto_sync: true` in the front matter.
3. Run `npm run devto-sync` to create a version of the article for dev.to with compatible front matter and a table of contents
4. Run `dev push devto/` to push all the articles in the `devto/` directory to dev.to
