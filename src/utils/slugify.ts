import type { CollectionEntry } from 'astro:content';

const generateSlug = (post: CollectionEntry<'blog'>): string => {
  // 1. If frontmatter has slug, use it
  if (post.data.slug) {
    return post.data.slug;
  }

  // 2. Check if post id begins with a date pattern (YYYY-MM-DD-)
  const datePattern = /^\d{4}-\d{2}-\d{2}-/;
  if (datePattern.test(post.id)) {
    return post.id.replace(datePattern, '');
  }

  // 3. Otherwise, use the post id as is
  return post.id;
};

export default generateSlug;
