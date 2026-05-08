# Indexing Technical SEO Design

Date: 2026-05-08

## Goal

Reduce Google Search Console indexing noise shown for `gateremotesource.com` by fixing repository-controlled technical causes: malformed robots output, over-broad sitemap entries, legacy URL handling, non-indexable utility pages, and build-time SEO regression checks.

Domain and hosting ownership are out of scope. The implementation will not change GitHub Pages custom domain settings, DNS, or site branding.

## Current Context

The site is an Eleventy static site deployed through `.github/workflows/pages.yml` to GitHub Pages. Source templates generate `dist/` on build. The repository already has `robots.txt.njk`, `sitemap.xml.njk`, `_data/seo.js`, canonical filters, language variants, and redirect JavaScript in page templates.

Observed risks from local inspection:

- `dist/robots.txt` is currently dirty and appears binary/corrupted locally, so generated robots output needs a deterministic text check.
- `dist/sitemap.xml` includes internal optimization guide pages, which should not be promoted for indexing.
- `docs/*` and `blog/posts/*` are excluded in SEO data but can still be rendered as accessible pages unless explicitly excluded or marked.
- Deleted historical URLs such as `about.html`, `products.html`, `blog.html`, `privacy.html`, `shipping.html`, `terms.html`, and old generated blog URLs can create 404s after redesigns.
- `/blog/posts/` is implemented as a client-side redirect page, which Google may classify as a redirect or alternate page rather than a clean server-side migration.

## Recommended Approach

Implement a focused technical SEO cleanup that changes only repository-controlled output:

1. Keep indexable pages crawlable and canonical.
2. Exclude internal or transitional content from sitemap and indexing signals.
3. Provide durable legacy URL redirects where the static host supports them, plus minimal fallback pages when needed.
4. Add a build-time audit script so robots, sitemap, canonical links, and internal links are checked before deployment.

This approach directly maps to the screenshot categories: 404, redirect page, noindex, robots blocked, alternate canonical, crawled not indexed, and discovered not indexed.

## Components

### SEO Data Contract

Extend `_data/seo.js` into the single source for indexing decisions:

- `robotsDisallow`: paths that should not be crawled.
- `robotsAllow`: paths that should be explicitly allowed.
- `sitemapExcludePrefixes`: paths excluded from sitemap.
- `noindexPrefixes`: pages that can render but should carry `noindex, follow`.
- `legacyRedirects`: old path to new path mappings.

This keeps robots, sitemap, noindex, redirects, and audits aligned.

### Robots Output

Keep `robots.txt.njk` simple and deterministic:

- render plain UTF-8 text only;
- include `Sitemap: https://www.gateremotesource.com/sitemap.xml`;
- disallow only intentional non-public paths such as `/docs/` and `/blog/posts/`;
- avoid blocking core pages, assets required for rendering, language folders, or blog posts.

### Sitemap Output

Update sitemap generation so it includes only canonical indexable HTML pages:

- include homepage, localized core pages, blog index, blog posts, catalog, OEM, about, and contact;
- exclude `docs/*`, `OPTIMIZATION_*`, `blog/posts/*`, JSON endpoints, internal build artifacts, and pages with `sitemap: false`;
- keep canonical trailing slash URLs;
- avoid duplicate URLs caused by `/index.html` forms.

### Noindex Handling

Add a shared output transform or layout hook that inserts:

```html
<meta name="robots" content="noindex, follow">
```

for pages matching configured `noindexPrefixes` or page front matter. This applies to pages that remain accessible but should not compete in search.

### Legacy Redirects

Add static redirect support for known historical paths:

- `about.html` to `/about/`
- `products.html` to `/catalog/`
- `blog.html` to `/blog/`
- `contact.html` to `/contact/`
- `privacy.html`, `shipping.html`, and `terms.html` to the most relevant live page or homepage if no replacement exists
- old generated blog post paths to current `/blog/<slug>/` URLs
- `/blog/posts/` to `/blog/`

Prefer host-native static redirects if supported by the deployment target. Because GitHub Pages does not process Netlify `_redirects`, also generate small HTML fallback redirect pages for critical old paths using canonical and `noindex, follow`.

### Build-Time SEO Audit

Add a Node script under `scripts/` and an npm script such as `npm run seo:audit` that runs after build and checks:

- `dist/robots.txt` is readable text and contains exactly one sitemap reference;
- every sitemap URL maps to an existing generated HTML page;
- sitemap does not include excluded prefixes;
- canonical URLs do not point to missing pages;
- internal links in generated HTML resolve inside `dist`;
- no indexable page has `noindex`;
- configured legacy redirect pages exist.

The audit should fail with actionable messages so CI catches regressions before Google recrawls them.

## Data Flow

1. Eleventy reads `_data/seo.js`.
2. Templates and transforms use the same data for robots, sitemap, noindex, and redirect fallback pages.
3. `npm run build` generates `dist/`.
4. `npm run seo:audit` validates the generated output.
5. GitHub Pages deploys only validated `dist/`.

## Error Handling

The audit should fail fast for malformed robots output, missing sitemap targets, excluded URLs in sitemap, broken internal links, and missing redirect fallback pages. It should print the exact URL or file path that needs repair.

For ambiguous old URLs without a clear replacement, map to the nearest live user-intent page instead of leaving them as 404s. If there is no reasonable equivalent, map to `/` with `noindex, follow` fallback.

## Testing

Use test-first changes where behavior is added:

- Write audit fixture or script-level tests for excluded sitemap URLs, malformed robots content, broken canonical targets, and redirect mapping validation.
- Run the failing test before implementation.
- Implement the smallest code needed for the test to pass.

Verification commands:

- `npm run build`
- `npm run seo:audit`
- targeted tests if a test runner or script test harness is added
- `git status --short` to confirm only intended files changed

## Out Of Scope

- DNS and Google Search Console property configuration.
- Manual validation inside Google Search Console.
- Broad content rewrites for "crawled but not indexed".
- Visual redesign.
- Changing the official domain.

## Expected Result

After deployment and recrawl, Google should receive clearer signals:

- fewer 404 URLs because common legacy paths redirect;
- fewer redirect-page and alternate-page warnings for internal transition pages;
- fewer robots-blocked surprises because robots is deterministic text;
- fewer duplicate sitemap candidates because internal documents and utility pages are excluded;
- a repeatable local audit prevents the same problems from returning.
