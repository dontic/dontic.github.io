// Utility to resolve a cover image path for a blog post without frontmatter
// Looks for common filenames within the post's directory

const IMAGE_GLOB = import.meta.glob('src/**/*.{jpeg,jpg,png,gif,webp}');

const CANDIDATE_BASENAMES = ['cover', 'og'];
const CANDIDATE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

/**
 * Given a blog post id from content collections, find a matching cover image path
 * next to the post file, using common filenames and extensions.
 * Returns a path like "/src/content/blog/my-post/cover.png" if found; otherwise undefined.
 */
export async function resolveCoverImagePathFromId(postId: string): Promise<string | undefined> {
  // postId looks like "my-post/index" or "category/my-post/index" depending on structure
  const slug = postId;
  const baseDir = `/src/content/blog/${slug}`;

  for (const name of CANDIDATE_BASENAMES) {
    for (const ext of CANDIDATE_EXTENSIONS) {
      const candidate = `${baseDir}/${name}.${ext}`;
      // Keys of IMAGE_GLOB match the pattern used in importImage.ts (starting with /src)
      if (candidate in IMAGE_GLOB) {
        return candidate;
      }
    }
  }

  return undefined;
}

export default resolveCoverImagePathFromId;
