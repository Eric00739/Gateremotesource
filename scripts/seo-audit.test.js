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
  write(
    path.join(dist, "index.html"),
    `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/">
</head><body><a href="/about/">About</a></body></html>`,
  );
  write(
    path.join(dist, "about", "index.html"),
    `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/about/">
</head><body>About</body></html>`,
  );
  write(
    path.join(dist, "robots.txt"),
    `User-agent: *
Disallow: /_next/static/
Disallow: /_next/image
Allow: /
Sitemap: https://www.gateremotesource.com/sitemap.xml
`,
  );
  write(
    path.join(dist, "_redirects"),
    `http://www.gateremotesource.com/* https://www.gateremotesource.com/:splat 301!
https://gateremotesource.com/* https://www.gateremotesource.com/:splat 301!
http://gateremotesource.com/* https://www.gateremotesource.com/:splat 301!
/about.html /about/ 301!
/index.html / 301!
`,
  );
  [
    "compatibility",
    "compatibility/liftmaster",
    "compatibility/faac",
    "compatibility/bft",
    "compatibility/nice",
    "compatibility/came",
    "compatibility/doorhan",
  ].forEach((route) => {
    write(
      path.join(dist, route, "index.html"),
      `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/${route}/">
</head><body>${route}</body></html>`,
    );
  });
  write(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.gateremotesource.com/</loc></url>
<url><loc>https://www.gateremotesource.com/about/</loc></url>
</urlset>`,
  );
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
  write(
    path.join(dist, "docs", "AUTO_GIT_SETUP", "index.html"),
    "<!doctype html><html><head></head><body>Doc</body></html>",
  );
  write(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.gateremotesource.com/docs/AUTO_GIT_SETUP/</loc></url>
</urlset>`,
  );
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
  write(
    path.join(dist, "index.html"),
    `<!doctype html>
<html><head>
<link rel="canonical" href="https://www.gateremotesource.com/">
</head><body><a href="/missing/">Missing</a></body></html>`,
  );
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
