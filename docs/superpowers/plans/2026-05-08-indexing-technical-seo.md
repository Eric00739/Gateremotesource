# Indexing Technical SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repeatable technical SEO cleanup that reduces Google Search Console indexing errors for `gateremotesource.com` without changing domain settings.

**Architecture:** Keep `_data/seo.js` as the shared source for robots, sitemap exclusions, noindex rules, and legacy redirects. Generate clean static output with Eleventy, then validate `dist/` with a Node audit script before deployment.

**Tech Stack:** Eleventy 2, Nunjucks, Node.js 20, `node-html-parser`, GitHub Pages.

---

## File Structure

- Modify: `_data/seo.js`
  - Owns indexability data: sitemap exclusions, noindex prefixes, and legacy redirect mappings.
- Modify: `eleventy.config.js`
  - Adds helpers for sitemap filtering, noindex injection, and redirect permalink generation.
- Modify: `.eleventyignore`
  - Prevents internal docs and optimization notes from rendering as public pages.
- Modify: `robots.txt.njk`
  - Emits deterministic plain-text robots content.
- Create: `legacy-redirects.njk`
  - Generates HTML fallback redirect pages for old URLs unsupported by GitHub Pages server redirects.
- Modify: `blog/posts/index.html`
  - Converts the transitional page into a clear noindex redirect fallback to `/blog/`.
- Create: `scripts/lib/seo-audit.js`
  - Reusable audit functions for generated output.
- Create: `scripts/seo-audit.js`
  - CLI wrapper for the audit.
- Create: `scripts/seo-audit.test.js`
  - Node-based regression tests for the audit.
- Modify: `package.json`
  - Adds `seo:audit` and `test:seo` scripts.
- Modify: `.github/workflows/pages.yml`
  - Runs the SEO audit after build and before Pages artifact upload.

---

### Task 1: Add SEO Audit Tests First

**Files:**
- Create: `scripts/seo-audit.test.js`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Create `scripts/seo-audit.test.js`:

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { auditDist } = require("./lib/seo-audit");

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
};

const createFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seo-audit-"));
  const dist = path.join(root, "dist");
  write(path.join(dist, "index.html"), `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/">
</head><body><a href="/about/">About</a></body></html>`);
  write(path.join(dist, "about", "index.html"), `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/about/">
</head><body>About</body></html>`);
  write(path.join(dist, "robots.txt"), `User-agent: *
Allow: /
Sitemap: https://www.gateremotesource.com/sitemap.xml
`);
  write(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.gateremotesource.com/</loc></url>
<url><loc>https://www.gateremotesource.com/about/</loc></url>
</urlset>`);
  return dist;
};

const run = (name, fn) => {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
};

run("passes a clean generated site", () => {
  const dist = createFixture();
  const result = auditDist({
    distDir: dist,
    siteUrl: "https://www.gateremotesource.com",
    sitemapExcludePrefixes: ["/docs/", "/blog/posts/", "/OPTIMIZATION_"],
    noindexPrefixes: ["/docs/", "/blog/posts/"],
    legacyRedirects: [],
  });
  assert.deepEqual(result.errors, []);
});

run("fails when robots.txt is binary or unreadable text", () => {
  const dist = createFixture();
  fs.writeFileSync(path.join(dist, "robots.txt"), Buffer.from([0, 1, 2, 3, 4]));
  const result = auditDist({
    distDir: dist,
    siteUrl: "https://www.gateremotesource.com",
    sitemapExcludePrefixes: [],
    noindexPrefixes: [],
    legacyRedirects: [],
  });
  assert.match(result.errors.join("\n"), /robots.txt contains binary control characters/);
});

run("fails when sitemap includes an excluded URL", () => {
  const dist = createFixture();
  write(path.join(dist, "docs", "AUTO_GIT_SETUP", "index.html"), "<!doctype html><html><head></head><body>Doc</body></html>");
  write(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.gateremotesource.com/docs/AUTO_GIT_SETUP/</loc></url>
</urlset>`);
  const result = auditDist({
    distDir: dist,
    siteUrl: "https://www.gateremotesource.com",
    sitemapExcludePrefixes: ["/docs/"],
    noindexPrefixes: [],
    legacyRedirects: [],
  });
  assert.match(result.errors.join("\n"), /Sitemap includes excluded URL/);
});

run("fails when an internal link target is missing", () => {
  const dist = createFixture();
  write(path.join(dist, "index.html"), `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/">
</head><body><a href="/missing/">Missing</a></body></html>`);
  const result = auditDist({
    distDir: dist,
    siteUrl: "https://www.gateremotesource.com",
    sitemapExcludePrefixes: [],
    noindexPrefixes: [],
    legacyRedirects: [],
  });
  assert.match(result.errors.join("\n"), /Broken internal link/);
});

run("fails when a configured legacy redirect page is missing", () => {
  const dist = createFixture();
  const result = auditDist({
    distDir: dist,
    siteUrl: "https://www.gateremotesource.com",
    sitemapExcludePrefixes: [],
    noindexPrefixes: [],
    legacyRedirects: [{ from: "/products.html", to: "/catalog/" }],
  });
  assert.match(result.errors.join("\n"), /Missing legacy redirect fallback/);
});
```

Modify `package.json` scripts:

```json
{
  "scripts": {
    "build": "eleventy",
    "dev": "eleventy --serve",
    "seo:audit": "node scripts/seo-audit.js",
    "test:seo": "node scripts/seo-audit.test.js"
  }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:seo`

Expected: FAIL with `Cannot find module './lib/seo-audit'`.

- [ ] **Step 3: Commit the red test**

```bash
git add package.json scripts/seo-audit.test.js
git commit -m "test: add seo audit regression tests"
```

---

### Task 2: Implement the SEO Audit Module

**Files:**
- Create: `scripts/lib/seo-audit.js`
- Create: `scripts/seo-audit.js`

- [ ] **Step 1: Write minimal implementation**

Create `scripts/lib/seo-audit.js`:

```js
const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("node-html-parser");

const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;

const toUrlPath = (siteUrl, absoluteUrl) => {
  if (!absoluteUrl.startsWith(siteUrl)) return null;
  const parsed = new URL(absoluteUrl);
  return parsed.pathname;
};

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
};

const outputPathForUrl = (distDir, urlPath) => {
  const cleanPath = decodeURI(urlPath.split("#")[0].split("?")[0]);
  if (cleanPath === "/") return path.join(distDir, "index.html");
  const relativePath = cleanPath.replace(/^\/+/, "");
  const directPath = path.join(distDir, relativePath);
  return cleanPath.endsWith("/")
    ? path.join(directPath, "index.html")
    : directPath;
};

const urlExists = (distDir, urlPath) => {
  const directPath = outputPathForUrl(distDir, urlPath);
  if (fs.existsSync(directPath)) return true;
  if (!urlPath.endsWith("/")) {
    return fs.existsSync(path.join(outputPathForUrl(distDir, `${urlPath}/`)));
  }
  return false;
};

const extractSitemapUrls = (content) => {
  return Array.from(content.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1].trim());
};

const resolveInternalUrl = (fromFile, distDir, rawUrl) => {
  if (!rawUrl || rawUrl.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawUrl) || rawUrl.startsWith("//")) return null;
  if (rawUrl.startsWith("mailto:") || rawUrl.startsWith("tel:") || rawUrl.startsWith("data:")) return null;
  if (rawUrl.startsWith("/")) return rawUrl;
  const relativeDir = path.dirname(path.relative(distDir, fromFile)).replace(/\\/g, "/");
  return `/${path.posix.normalize(path.posix.join(relativeDir, rawUrl))}`;
};

const hasNoindex = (html) => {
  const root = parse(html);
  return root.querySelectorAll('meta[name="robots"]').some((meta) => {
    return (meta.getAttribute("content") || "").toLowerCase().includes("noindex");
  });
};

const canonicalUrls = (html) => {
  const root = parse(html);
  return root.querySelectorAll('link[rel="canonical"]').map((link) => link.getAttribute("href")).filter(Boolean);
};

const auditDist = ({
  distDir,
  siteUrl,
  sitemapExcludePrefixes = [],
  noindexPrefixes = [],
  legacyRedirects = [],
}) => {
  const errors = [];
  const robotsPath = path.join(distDir, "robots.txt");
  const sitemapPath = path.join(distDir, "sitemap.xml");

  if (!fs.existsSync(robotsPath)) {
    errors.push("Missing dist/robots.txt");
  } else {
    const robots = fs.readFileSync(robotsPath, "utf8");
    if (CONTROL_CHAR_PATTERN.test(robots)) {
      errors.push("robots.txt contains binary control characters");
    }
    const sitemapLines = robots.split(/\r?\n/).filter((line) => /^Sitemap:/i.test(line.trim()));
    if (sitemapLines.length !== 1) {
      errors.push(`robots.txt must contain exactly one Sitemap line; found ${sitemapLines.length}`);
    }
  }

  if (!fs.existsSync(sitemapPath)) {
    errors.push("Missing dist/sitemap.xml");
  } else {
    const sitemapUrls = extractSitemapUrls(fs.readFileSync(sitemapPath, "utf8"));
    sitemapUrls.forEach((absoluteUrl) => {
      const urlPath = toUrlPath(siteUrl, absoluteUrl);
      if (!urlPath) {
        errors.push(`Sitemap URL outside siteUrl: ${absoluteUrl}`);
        return;
      }
      if (sitemapExcludePrefixes.some((prefix) => urlPath.startsWith(prefix))) {
        errors.push(`Sitemap includes excluded URL: ${absoluteUrl}`);
      }
      if (!urlExists(distDir, urlPath)) {
        errors.push(`Sitemap URL has no generated page: ${absoluteUrl}`);
      }
    });
  }

  const htmlFiles = walk(distDir).filter((file) => file.endsWith(".html"));
  htmlFiles.forEach((file) => {
    const html = fs.readFileSync(file, "utf8");
    const relativeUrl = `/${path.relative(distDir, file).replace(/\\/g, "/")}`.replace(/\/index\.html$/, "/");
    const pageHasNoindex = hasNoindex(html);
    const expectedNoindex = noindexPrefixes.some((prefix) => relativeUrl.startsWith(prefix));
    if (expectedNoindex && !pageHasNoindex) {
      errors.push(`Expected noindex on ${relativeUrl}`);
    }
    if (!expectedNoindex && pageHasNoindex && !legacyRedirects.some((redirect) => redirect.from === relativeUrl)) {
      errors.push(`Unexpected noindex on indexable page: ${relativeUrl}`);
    }

    canonicalUrls(html).forEach((absoluteUrl) => {
      const urlPath = toUrlPath(siteUrl, absoluteUrl);
      if (urlPath && !urlExists(distDir, urlPath)) {
        errors.push(`Canonical target missing for ${relativeUrl}: ${absoluteUrl}`);
      }
    });

    const root = parse(html);
    root.querySelectorAll("[href],[src]").forEach((element) => {
      const rawUrl = element.getAttribute("href") || element.getAttribute("src");
      const internalUrl = resolveInternalUrl(file, distDir, rawUrl);
      if (internalUrl && !urlExists(distDir, internalUrl)) {
        errors.push(`Broken internal link in ${relativeUrl}: ${rawUrl}`);
      }
    });
  });

  legacyRedirects.forEach((redirect) => {
    if (!urlExists(distDir, redirect.from)) {
      errors.push(`Missing legacy redirect fallback: ${redirect.from} -> ${redirect.to}`);
    }
  });

  return { errors };
};

module.exports = {
  auditDist,
};
```

Create `scripts/seo-audit.js`:

```js
const path = require("node:path");
const seo = require("../_data/seo");
const site = require("../_data/site.json");
const { auditDist } = require("./lib/seo-audit");

const result = auditDist({
  distDir: path.join(process.cwd(), "dist"),
  siteUrl: site.url,
  sitemapExcludePrefixes: seo.sitemapExcludePrefixes || [],
  noindexPrefixes: seo.noindexPrefixes || [],
  legacyRedirects: seo.legacyRedirects || [],
});

if (result.errors.length > 0) {
  console.error("SEO audit failed:");
  result.errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("SEO audit passed.");
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test:seo`

Expected: PASS for all five audit tests.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/seo-audit.js scripts/seo-audit.js
git commit -m "feat: add generated seo audit"
```

---

### Task 3: Make SEO Data Explicit

**Files:**
- Modify: `_data/seo.js`

- [ ] **Step 1: Run audit against current build to see current failures**

Run: `npm run build && npm run seo:audit`

Expected: FAIL showing excluded URLs such as `/OPTIMIZATION_CHECKLIST/` or missing legacy redirect fallbacks after data is added in the next step.

- [ ] **Step 2: Replace SEO data with explicit rules**

Modify `_data/seo.js`:

```js
module.exports = {
  robotsDisallow: [],
  robotsAllow: ["/"],
  sitemapExcludePrefixes: [
    "/docs/",
    "/blog/posts/",
    "/OPTIMIZATION_CHECKLIST/",
    "/OPTIMIZATION_GUIDE/",
  ],
  noindexPrefixes: [
    "/docs/",
    "/blog/posts/",
    "/OPTIMIZATION_CHECKLIST/",
    "/OPTIMIZATION_GUIDE/",
  ],
  legacyRedirects: [
    { from: "/about.html", to: "/about/" },
    { from: "/products.html", to: "/catalog/" },
    { from: "/blog.html", to: "/blog/" },
    { from: "/contact.html", to: "/contact/" },
    { from: "/privacy.html", to: "/" },
    { from: "/shipping.html", to: "/" },
    { from: "/terms.html", to: "/" },
    { from: "/blog-post-avoid-public-mold-trap-pcb-quality.html", to: "/blog/avoid-public-mold-trap-pcb-quality/" },
    { from: "/blog/posts/avoid-public-mold-trap-pcb-quality/", to: "/blog/avoid-public-mold-trap-pcb-quality/" },
    { from: "/catalog/1/", to: "/catalog/" },
    { from: "/catalog/2/", to: "/catalog/" },
    { from: "/catalog/3/", to: "/catalog/" },
    { from: "/catalog/4/", to: "/catalog/" },
    { from: "/catalog/5/", to: "/catalog/" },
  ],
};
```

- [ ] **Step 3: Run test and build audit**

Run: `npm run test:seo`

Expected: PASS.

Run: `npm run build && npm run seo:audit`

Expected: FAIL until redirect fallback pages and exclusions are implemented. This verifies the audit catches the remaining planned work.

- [ ] **Step 4: Commit**

```bash
git add _data/seo.js
git commit -m "feat: define indexing seo rules"
```

---

### Task 4: Exclude Internal Markdown and Optimization Notes

**Files:**
- Modify: `.eleventyignore`
- Modify: `eleventy.config.js`

- [ ] **Step 1: Write the failing check**

Run: `npm run build && npm run seo:audit`

Expected: FAIL with sitemap entries or generated pages for `OPTIMIZATION_CHECKLIST`, `OPTIMIZATION_GUIDE`, or `docs`.

- [ ] **Step 2: Update `.eleventyignore`**

Append:

```text
docs
OPTIMIZATION_CHECKLIST.md
OPTIMIZATION_GUIDE.md
```

- [ ] **Step 3: Harden sitemap filtering**

In `eleventy.config.js`, update the `sitemapEntries` filter so it also excludes noindex prefixes:

```js
  eleventyConfig.addFilter("sitemapEntries", (collection) => {
    if (!Array.isArray(collection)) return [];
    const excludedPrefixes = [
      ...(Array.isArray(seo.sitemapExcludePrefixes) ? seo.sitemapExcludePrefixes : []),
      ...(Array.isArray(seo.noindexPrefixes) ? seo.noindexPrefixes : []),
    ];
    return collection.filter((item) => {
      if (!item.url) return false;
      if (item.data && item.data.eleventyExcludeFromCollections) return false;
      if (item.data && item.data.sitemap === false) return false;
      if (item.url.endsWith(".json")) return false;
      if (excludedPrefixes.some((prefix) => item.url.startsWith(prefix))) return false;
      return true;
    });
  });
```

- [ ] **Step 4: Run build audit**

Run: `npm run build && npm run seo:audit`

Expected: FAIL only for missing legacy redirect fallback pages or noindex redirect pages, not for internal docs or optimization notes in sitemap.

- [ ] **Step 5: Commit**

```bash
git add .eleventyignore eleventy.config.js
git commit -m "fix: exclude internal pages from sitemap"
```

---

### Task 5: Generate Legacy Redirect Fallback Pages

**Files:**
- Modify: `eleventy.config.js`
- Create: `legacy-redirects.njk`

- [ ] **Step 1: Write the failing check**

Run: `npm run build && npm run seo:audit`

Expected: FAIL with `Missing legacy redirect fallback`.

- [ ] **Step 2: Add permalink helper**

In `eleventy.config.js`, before `module.exports`, add:

```js
const redirectPermalink = (fromPath) => {
  const cleanPath = String(fromPath || "").replace(/^\/+/, "");
  if (!cleanPath) return false;
  if (cleanPath.endsWith("/")) return `${cleanPath}index.html`;
  return cleanPath;
};
```

Inside `module.exports`, add:

```js
  eleventyConfig.addFilter("redirectPermalink", redirectPermalink);
```

- [ ] **Step 3: Create redirect generator**

Create `legacy-redirects.njk`:

```njk
---
pagination:
  data: seo.legacyRedirects
  size: 1
  alias: redirect
  addAllPagesToCollections: true
permalink: "{{ redirect.from | redirectPermalink }}"
sitemap: false
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url={{ redirect.to }}">
  <link rel="canonical" href="{{ site.url }}{{ redirect.to | canonicalPath }}">
  <title>Redirecting | GateRemoteSource</title>
  <script>location.replace({{ redirect.to | json }});</script>
</head>
<body>
  <p>Redirecting to <a href="{{ redirect.to }}">{{ redirect.to }}</a>.</p>
</body>
</html>
```

- [ ] **Step 4: Run build audit**

Run: `npm run build && npm run seo:audit`

Expected: FAIL only if `/blog/posts/` still lacks expected noindex or if redirect target canonical checks need adjustment.

- [ ] **Step 5: Commit**

```bash
git add eleventy.config.js legacy-redirects.njk
git commit -m "feat: add legacy redirect fallbacks"
```

---

### Task 6: Convert Blog Posts Index to Noindex Redirect

**Files:**
- Modify: `blog/posts/index.html`

- [ ] **Step 1: Write the failing check**

Run: `npm run build && npm run seo:audit`

Expected: FAIL with `Expected noindex on /blog/posts/` if the page lacks `noindex, follow`.

- [ ] **Step 2: Replace the transitional page**

Replace `blog/posts/index.html` with:

```html
---
permalink: "blog/posts/index.html"
sitemap: false
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url=/blog/">
  <link rel="canonical" href="https://www.gateremotesource.com/blog/">
  <title>Redirecting to Installer Hub Blog | GateRemoteSource</title>
  <script>location.replace("/blog/");</script>
</head>
<body>
  <p>Redirecting to <a href="/blog/">Installer Hub Blog</a>.</p>
</body>
</html>
```

- [ ] **Step 3: Run build audit**

Run: `npm run build && npm run seo:audit`

Expected: PASS unless robots output or canonical checks still fail.

- [ ] **Step 4: Commit**

```bash
git add blog/posts/index.html
git commit -m "fix: noindex blog posts redirect page"
```

---

### Task 7: Keep Robots Plain and Deterministic

**Files:**
- Modify: `robots.txt.njk`

- [ ] **Step 1: Write the failing check**

Run: `npm run build && npm run seo:audit`

Expected: FAIL if robots output is malformed, binary, or has the wrong sitemap count.

- [ ] **Step 2: Simplify robots template**

Replace `robots.txt.njk` body with:

```njk
---
permalink: "robots.txt"
eleventyExcludeFromCollections: true
sitemap: false
---
User-agent: *
{% for path in seo.robotsDisallow -%}
Disallow: {{ path }}
{% endfor -%}
{% for path in seo.robotsAllow -%}
Allow: {{ path }}
{% endfor -%}
Sitemap: {{ site.url }}/sitemap.xml
```

- [ ] **Step 3: Run build audit**

Run: `npm run build && npm run seo:audit`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add robots.txt.njk
git commit -m "fix: keep robots output deterministic"
```

---

### Task 8: Run Audit in GitHub Pages CI

**Files:**
- Modify: `.github/workflows/pages.yml`

- [ ] **Step 1: Add failing protection locally**

Run: `npm run build && npm run seo:audit`

Expected: PASS before editing CI.

- [ ] **Step 2: Add workflow step**

In `.github/workflows/pages.yml`, after `Build site`, add:

```yaml
      - name: Audit SEO output
        run: npm run seo:audit
```

- [ ] **Step 3: Run local verification**

Run: `npm run build && npm run seo:audit`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/pages.yml package.json package-lock.json
git commit -m "ci: audit seo output before deploy"
```

---

### Task 9: Final Verification

**Files:**
- Read: all changed files

- [ ] **Step 1: Run all SEO checks**

Run: `npm run test:seo`

Expected: all tests print `PASS`.

Run: `npm run build`

Expected: Eleventy exits 0.

Run: `npm run seo:audit`

Expected: `SEO audit passed.`

- [ ] **Step 2: Inspect generated robots and sitemap**

Run: `Get-Content -LiteralPath dist\robots.txt`

Expected: readable text with exactly one sitemap line.

Run: `Select-String -Path dist\sitemap.xml -Pattern 'OPTIMIZATION|/docs/|/blog/posts/'`

Expected: no matches.

- [ ] **Step 3: Inspect git status**

Run: `git status --short`

Expected: only known pre-existing dirty files remain, or a clean working tree if generated files are intentionally committed.

- [ ] **Step 4: Summarize deployment follow-up**

Tell the user:

```text
After pushing, wait for GitHub Pages deployment, then in Google Search Console submit /sitemap.xml and validate fixes for 404, redirect page, robots blocked, and duplicate canonical categories.
```
