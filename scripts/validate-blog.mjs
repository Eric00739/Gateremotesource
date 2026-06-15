#!/usr/bin/env node

import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const rootDir = process.cwd();
const errors = [];
const warnings = [];

const requiredPostFields = [
  'title',
  'category',
  'excerpt',
  'slug',
  'author',
  'publishedAt',
  'readTime',
  'image',
  'content',
];

const allowedBlockTypes = new Set(['heading', 'paragraph', 'list', 'callout', 'quote', 'image']);

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function fileExistsFromPublicPath(publicPath) {
  if (!hasText(publicPath) || !publicPath.startsWith('/')) {
    return false;
  }

  return existsSync(path.join(rootDir, 'public', publicPath.slice(1)));
}

function distArticleExists(slug) {
  const candidates = [
    path.join(rootDir, 'dist', 'en', 'blog', `${slug}.html`),
    path.join(rootDir, 'dist', 'en', 'blog', slug, 'index.html'),
  ];

  return candidates.some((candidate) => existsSync(candidate));
}

async function readIfExists(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  return fs.readFile(filePath, 'utf8');
}

function validateImagePath(owner, imagePath, slug) {
  if (!hasText(imagePath)) {
    fail(`${owner}: missing image path`);
    return;
  }

  if (!imagePath.startsWith('/images/blog/')) {
    fail(`${owner}: image must live under /images/blog/`);
  }

  if (!imagePath.startsWith(`/images/blog/${slug}/`)) {
    warn(`${owner}: image is outside the slug folder /images/blog/${slug}/`);
  }

  if (!imagePath.endsWith('.webp')) {
    warn(`${owner}: image is not WebP (${imagePath})`);
  }

  if (!fileExistsFromPublicPath(imagePath)) {
    fail(`${owner}: image file does not exist at public${imagePath}`);
  }
}

function validateBlocks(post) {
  const headingTexts = new Set();
  let headingCount = 0;
  let paragraphCount = 0;

  post.content.forEach((block, blockIndex) => {
    const owner = `${post.slug} content[${blockIndex}]`;

    if (!block || typeof block !== 'object') {
      fail(`${owner}: block must be an object`);
      return;
    }

    if (!allowedBlockTypes.has(block.type)) {
      fail(`${owner}: unsupported block type "${block.type}"`);
      return;
    }

    if (block.type === 'heading') {
      headingCount += 1;
      if (!hasText(block.text)) {
        fail(`${owner}: heading text is required`);
      }
      if (headingTexts.has(block.text)) {
        warn(`${owner}: duplicate heading text "${block.text}"`);
      }
      headingTexts.add(block.text);
    }

    if (block.type === 'paragraph') {
      paragraphCount += 1;
      if (!hasText(block.text)) {
        fail(`${owner}: paragraph text is required`);
      }
      if (block.links) {
        if (!Array.isArray(block.links)) {
          fail(`${owner}: links must be an array`);
        } else {
          block.links.forEach((link, linkIndex) => {
            if (!hasText(link?.text) || !hasText(link?.href)) {
              fail(`${owner}.links[${linkIndex}]: link text and href are required`);
            }
          });
        }
      }
    }

    if (block.type === 'list') {
      if (!Array.isArray(block.items) || block.items.length === 0) {
        fail(`${owner}: list items are required`);
      } else {
        block.items.forEach((item, itemIndex) => {
          if (!hasText(item)) {
            fail(`${owner}.items[${itemIndex}]: list item text is required`);
          }
        });
      }
    }

    if (block.type === 'callout') {
      if (!hasText(block.text)) {
        fail(`${owner}: callout text is required`);
      }
    }

    if (block.type === 'quote') {
      if (!hasText(block.text)) {
        fail(`${owner}: quote text is required`);
      }
    }

    if (block.type === 'image') {
      validateImagePath(owner, block.src, post.slug);
      if (!hasText(block.alt)) {
        fail(`${owner}: image alt text is required`);
      }
    }
  });

  if (headingCount === 0) {
    fail(`${post.slug}: at least one heading block is required for the reading map`);
  }

  if (paragraphCount === 0) {
    fail(`${post.slug}: at least one paragraph block is required`);
  }
}

async function loadBlogData() {
  const blogDataPath = path.join(rootDir, 'src', 'data', 'blog.ts');

  if (!existsSync(blogDataPath)) {
    fail('src/data/blog.ts was not found');
    return { blogPosts: [], blogCategories: [] };
  }

  const source = await fs.readFile(blogDataPath, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: blogDataPath,
  });

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`;
  return import(moduleUrl);
}

function validatePosts(blogPosts, blogCategories) {
  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    fail('blogPosts must be a non-empty array');
    return;
  }

  const categoryKeys = new Set((Array.isArray(blogCategories) ? blogCategories : []).map((category) => category.key));
  const slugs = new Set();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  blogPosts.forEach((post, index) => {
    const owner = `blogPosts[${index}]`;

    requiredPostFields.forEach((field) => {
      if (post?.[field] === undefined || post?.[field] === null || post?.[field] === '') {
        fail(`${owner}: missing required field "${field}"`);
      }
    });

    if (!hasText(post?.slug)) {
      return;
    }

    if (!slugRegex.test(post.slug)) {
      fail(`${post.slug}: slug must be lowercase hyphenated ASCII`);
    }

    if (slugs.has(post.slug)) {
      fail(`${post.slug}: duplicate slug`);
    }
    slugs.add(post.slug);

    if (!categoryKeys.has(post.category) || post.category === 'all') {
      fail(`${post.slug}: category "${post.category}" is not defined in blogCategories`);
    }

    if (post.author !== 'Eric Huang') {
      warn(`${post.slug}: author is "${post.author}", expected "Eric Huang"`);
    }

    if (!dateRegex.test(post.publishedAt) || Number.isNaN(Date.parse(`${post.publishedAt}T00:00:00Z`))) {
      fail(`${post.slug}: publishedAt must be a valid YYYY-MM-DD date`);
    }

    if (post.updatedAt && (!dateRegex.test(post.updatedAt) || Number.isNaN(Date.parse(`${post.updatedAt}T00:00:00Z`)))) {
      fail(`${post.slug}: updatedAt must be a valid YYYY-MM-DD date`);
    }

    if (!/^\d+\s+min read$/.test(post.readTime)) {
      warn(`${post.slug}: readTime should look like "7 min read"`);
    }

    validateImagePath(`${post.slug} hero`, post.image, post.slug);

    if (!Array.isArray(post.content) || post.content.length === 0) {
      fail(`${post.slug}: content must be a non-empty array`);
    } else {
      validateBlocks(post);
    }
  });

  blogPosts.forEach((post) => {
    if (!Array.isArray(post.relatedSlugs)) {
      return;
    }

    post.relatedSlugs.forEach((relatedSlug, relatedIndex) => {
      if (relatedSlug === post.slug) {
        fail(`${post.slug}.relatedSlugs[${relatedIndex}]: cannot reference itself`);
      }
      if (!slugs.has(relatedSlug)) {
        fail(`${post.slug}.relatedSlugs[${relatedIndex}]: unknown related slug "${relatedSlug}"`);
      }
    });
  });
}

async function validateBuiltOutput(blogPosts) {
  const blogIndexPath = path.join(rootDir, 'dist', 'en', 'blog.html');
  const sitemapPath = path.join(rootDir, 'dist', 'sitemap.xml');
  const blogIndex = await readIfExists(blogIndexPath);
  const sitemap = await readIfExists(sitemapPath);

  if (!blogIndex) {
    warn('dist/en/blog.html was not found; run npm run build before built-output validation');
  }

  if (!sitemap) {
    warn('dist/sitemap.xml was not found; run npm run build before sitemap validation');
  }

  blogPosts.forEach((post) => {
    const articleHref = `/en/blog/${post.slug}`;

    if (blogIndex && !blogIndex.includes(articleHref)) {
      fail(`${post.slug}: dist/en/blog.html does not link to ${articleHref}`);
    }

    if (sitemap && !sitemap.includes(`https://www.gateremotesource.com/en/blog/${post.slug}`)) {
      fail(`${post.slug}: dist/sitemap.xml is missing the article URL`);
    }

    if ((blogIndex || sitemap) && !distArticleExists(post.slug)) {
      fail(`${post.slug}: generated article page was not found in dist/en/blog/`);
    }
  });
}

const { blogPosts = [], blogCategories = [] } = await loadBlogData();

validatePosts(blogPosts, blogCategories);
await validateBuiltOutput(blogPosts);

warnings.forEach((message) => {
  console.warn(`Warning: ${message}`);
});

if (errors.length > 0) {
  errors.forEach((message) => {
    console.error(`Error: ${message}`);
  });
  console.error(`\nBlog validation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`Blog validation passed: ${blogPosts.length} article(s), ${warnings.length} warning(s).`);
