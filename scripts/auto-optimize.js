#!/usr/bin/env node
/**
 * Auto-optimization script for GateRemoteSource
 * Refactors all pages to use component templates
 */

const fs = require('fs');
const path = require('path');

const pages = ['about', 'catalog', 'contact', 'oem'];
const baseDir = '/Users/erichuang/gateremotesource-optimized';

// Pattern to find and replace
const redirectPattern = /<!-- HTTP to HTTPS and non-www to www redirect -->[\s\S]*?<\/script>/;
const schemaPattern = /<!-- Schema\.org Structured Data -->[\s\S]*?<\/script>\s*<\/script>/;

let totalSavings = 0;

pages.forEach(page => {
  const filePath = path.join(baseDir, page, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${page}/index.html not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalLength = content.length;

  // Replace redirect script
  if (redirectPattern.test(content)) {
    content = content.replace(
      redirectPattern,
      `<!-- HTTP to HTTPS and non-www to www redirect -->\n    {% include "components/redirect.njk" %}`
    );
    console.log(`✅ ${page}: Redirect script replaced`);
  }

  // Replace Schema.org
  if (schemaPattern.test(content)) {
    content = content.replace(
      schemaPattern,
      `<!-- Schema.org Structured Data -->\n    {% include "components/schema.njk" %}`
    );
    console.log(`✅ ${page}: Schema.org replaced`);
  }

  // Add skip-link after <body> tag
  const bodyMatch = content.match(/<body[^>]*>/);
  if (bodyMatch && !content.includes('skip-link')) {
    const skipLink = `\n    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-brand-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg">Skip to main content</a>`;
    content = content.replace(bodyMatch[0], bodyMatch[0] + skipLink);
    console.log(`✅ ${page}: Skip-link added`);
  }

  // Add loading="lazy" to images without it
  content = content.replace(
    /<img(?!.*loading=)[^>]*src="([^"]+)"[^>]*>/g,
    (match) => {
      if (match.includes('loading=')) return match;
      return match.replace('<img', '<img loading="lazy"');
    }
  );
  console.log(`✅ ${page}: Lazy loading added to images`);

  const newLength = content.length;
  const savings = originalLength - newLength;
  totalSavings += savings;

  fs.writeFileSync(filePath, content);
  console.log(`📊 ${page}: ${(savings / 1024).toFixed(2)} KB saved\n`);
});

console.log(`🎉 Total savings: ${(totalSavings / 1024).toFixed(2)} KB`);
