import rss from '@astrojs/rss';
import { SITE } from '~/config';
import { getCollection } from 'astro:content';
import getSortedPosts from '~/utils/getSortedPosts';

export async function GET(context: any) {
  const unsortedPosts = await getCollection('blog');
  const posts = getSortedPosts(unsortedPosts);
  return rss({
    // `<title>` field in output xml
    title: SITE.title,
    // `<description>` field in output xml
    description: SITE.description,
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: SITE.siteUrl,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: posts.map(({ data, id }) => ({
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      link: `blog/${id}/`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
