import type { CollectionEntry } from 'astro:content';

const generateSlug = (post: CollectionEntry<'blog'>): string => {
  // 1. Initialize post id
  let postId = post.id;

  // 2. Remove the locale from the post id
  const locale = postId.split('/')[0];
  if (locale) {
    postId = postId.split('/')[1];
  }

  // 3. Check if post id begins with a date pattern (YYYY-MM-DD-)
  const datePattern = /^\d{4}-\d{2}-\d{2}-/;
  if (datePattern.test(postId)) {
    // Remove the date pattern
    return postId.replace(datePattern, '');
  }

  // 3. Otherwise, use the post id as is
  return postId;
};

export default generateSlug;
