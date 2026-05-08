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
