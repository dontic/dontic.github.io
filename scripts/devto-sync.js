import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const DEVTO_DIR = path.join(__dirname, '../devto');

// Ensure devto directory exists
if (!fs.existsSync(DEVTO_DIR)) {
  fs.mkdirSync(DEVTO_DIR, { recursive: true });
}

// Function to format date to ISO string
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString();
}

// Function to generate table of contents
function generateTableOfContents(markdown) {
  const toc = ['## Table of Contents\n'];
  const lines = markdown.split('\n');

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      const title = line.replace('## ', '').trim();
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc.push(`- [${title}](#${anchor})`);
    } else if (line.startsWith('### ')) {
      const title = line.replace('### ', '').trim();
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc.push(`  - [${title}](#${anchor})`);
    }
  });

  return toc.join('\n') + '\n\n';
}

// Function to transform frontmatter to dev.to format
function transformFrontmatter(frontmatter, blogDir, existingFrontmatter = {}) {
  const coverImagePath = path.join(BLOG_DIR, blogDir, 'cover.png');
  const transformed = {
    devto_sync: true,
    title: frontmatter.title,
    description: frontmatter.description,
    published: true,
    tags: frontmatter.tags || [],
    date: formatDate(frontmatter.pubDatetime),
    cover_image: fs.existsSync(coverImagePath) ? path.relative(DEVTO_DIR, coverImagePath) : '',
    canonical_url: frontmatter.canonicalUrl || `https://daniel.es/blog/${path.basename(blogDir)}/`,
  };

  // Preserve existing id if it exists
  if (existingFrontmatter.id) {
    transformed.id = existingFrontmatter.id;
  }

  return transformed;
}

// Function to update image references in content
function updateImageReferences(content, blogDir) {
  // Replace image references that start with ./
  content = content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, alt, src) => {
    const relativePath = path.relative(DEVTO_DIR, path.join(BLOG_DIR, blogDir, src));
    return `![${alt}](${relativePath})`;
  });
  return content;
}

// Function to transform local links to fully qualified URLs
function transformLocalLinks(content) {
  // Replace links that start with / to use the full domain
  return content.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, (match, text, url) => {
    return `[${text}](https://daniel.es/${url})`;
  });
}

// Function to check if content has changed
function hasContentChanged(newMarkdown, existingPath, blogDir) {
  if (!fs.existsSync(existingPath)) return true;

  const existingContent = fs.readFileSync(existingPath, 'utf-8');
  const { content: existingMarkdown } = matter(existingContent);

  // Update image references in existing markdown to match new format
  const updatedExistingMarkdown = updateImageReferences(existingMarkdown, blogDir);

  return newMarkdown !== updatedExistingMarkdown;
}

// Main function to process blog posts
async function processBlogPosts() {
  const blogDirs = fs.readdirSync(BLOG_DIR).filter((dir) => fs.statSync(path.join(BLOG_DIR, dir)).isDirectory());

  for (const dir of blogDirs) {
    const indexPath = path.join(BLOG_DIR, dir, 'index.md');
    const outputPath = path.join(DEVTO_DIR, `${dir}.md`);

    if (!fs.existsSync(indexPath)) continue;

    const content = fs.readFileSync(indexPath, 'utf-8');
    const { data: frontmatter, content: markdown } = matter(content);

    // Skip if devto_sync is not true
    if (!frontmatter.devto_sync) {
      console.log(`Skipping ${dir} - devto_sync is not true`);
      continue;
    }

    // Get existing frontmatter if file exists
    let existingFrontmatter = {};
    if (fs.existsSync(outputPath)) {
      const existingContent = fs.readFileSync(outputPath, 'utf-8');
      const { data } = matter(existingContent);
      existingFrontmatter = data;
    }

    // Transform frontmatter
    const transformedFrontmatter = transformFrontmatter(frontmatter, dir, existingFrontmatter);

    // Update image references
    let updatedContent = updateImageReferences(markdown, dir);

    // Transform local links to fully qualified URLs
    updatedContent = transformLocalLinks(updatedContent);

    // Generate and insert table of contents
    const toc = generateTableOfContents(updatedContent);
    const contentWithToc = toc + updatedContent;

    // Create new markdown content
    const newContent = matter.stringify(contentWithToc, transformedFrontmatter);

    // Only write if content has changed
    if (hasContentChanged(contentWithToc, outputPath, dir)) {
      fs.writeFileSync(outputPath, newContent);
      console.log(`Processed ${dir}`);
    } else {
      console.log(`Skipping ${dir} - no content changes detected`);
    }
  }
}

// Run the script
processBlogPosts().catch(console.error);
