const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("node-html-parser");

const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
};

const normalizePrefixList = (values) => {
  return Array.isArray(values) ? values.filter(Boolean) : [];
};

const stripUrlNoise = (value) => {
  return String(value || "").split("#")[0].split("?")[0];
};

const normalizeUrlPath = (value) => {
  const cleanPath = stripUrlNoise(value || "");
  if (!cleanPath || cleanPath === "/") return cleanPath || "/";
  return cleanPath.replace(/\/+$/, "");
};

const toUrlPath = (siteUrl, absoluteUrl) => {
  if (!absoluteUrl || !absoluteUrl.startsWith(siteUrl)) return null;
  try {
    return new URL(absoluteUrl).pathname;
  } catch {
    return null;
  }
};

const outputPathForUrl = (distDir, urlPath) => {
  const cleanPath = decodeURI(stripUrlNoise(urlPath));
  if (cleanPath === "/") return path.join(distDir, "index.html");

  const relativePath = cleanPath.replace(/^\/+/, "");
  const directPath = path.join(distDir, relativePath);
  return cleanPath.endsWith("/") ? path.join(directPath, "index.html") : directPath;
};

const urlExists = (distDir, urlPath) => {
  const cleanPath = stripUrlNoise(urlPath);
  if (!cleanPath) return false;
  if (fs.existsSync(outputPathForUrl(distDir, cleanPath))) return true;
  if (!cleanPath.endsWith("/")) {
    return fs.existsSync(outputPathForUrl(distDir, `${cleanPath}/`));
  }
  return false;
};

const extractSitemapUrls = (content) => {
  return Array.from(content.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) =>
    match[1].trim(),
  );
};

const resolveInternalUrl = (fromFile, distDir, rawUrl) => {
  if (!rawUrl || rawUrl.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawUrl) || rawUrl.startsWith("//")) return null;
  if (rawUrl.startsWith("data:")) return null;
  if (rawUrl.startsWith("/")) return rawUrl;

  const relativeDir = path.dirname(path.relative(distDir, fromFile)).replace(/\\/g, "/");
  const normalized = path.posix.normalize(path.posix.join("/", relativeDir, rawUrl));
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const htmlUrlForFile = (distDir, file) => {
  const relativePath = path.relative(distDir, file).replace(/\\/g, "/");
  if (relativePath === "index.html") return "/";
  return `/${relativePath}`.replace(/\/index\.html$/, "/");
};

const hasNoindex = (html) => {
  const root = parse(html);
  return root.querySelectorAll('meta[name="robots"]').some((meta) => {
    return (meta.getAttribute("content") || "").toLowerCase().includes("noindex");
  });
};

const canonicalUrls = (html) => {
  const root = parse(html);
  return root
    .querySelectorAll('link[rel="canonical"]')
    .map((link) => link.getAttribute("href"))
    .filter(Boolean);
};

const auditDist = ({
  distDir,
  siteUrl,
  sitemapExcludePrefixes = [],
  noindexPrefixes = [],
  legacyRedirects = [],
}) => {
  const errors = [];
  const excludedPrefixes = normalizePrefixList(sitemapExcludePrefixes);
  const noindexPathPrefixes = normalizePrefixList(noindexPrefixes);
  const redirects = Array.isArray(legacyRedirects) ? legacyRedirects : [];

  const robotsPath = path.join(distDir, "robots.txt");
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const redirectsPath = path.join(distDir, "_redirects");

  if (!fs.existsSync(robotsPath)) {
    errors.push("Missing dist/robots.txt");
  } else {
    const robots = fs.readFileSync(robotsPath, "utf8");
    if (CONTROL_CHAR_PATTERN.test(robots)) {
      errors.push("robots.txt contains binary control characters");
    }
    const sitemapLines = robots
      .split(/\r?\n/)
      .filter((line) => /^Sitemap:/i.test(line.trim()));
    if (sitemapLines.length !== 1) {
      errors.push(`robots.txt must contain exactly one Sitemap line; found ${sitemapLines.length}`);
    }
    ["/_next/static/", "/_next/image"].forEach((rule) => {
      if (!robots.includes(`Disallow: ${rule}`)) {
        errors.push(`robots.txt missing Disallow rule: ${rule}`);
      }
    });
  }

  if (!fs.existsSync(redirectsPath)) {
    errors.push("Missing dist/_redirects");
  } else {
    const redirects = fs.readFileSync(redirectsPath, "utf8");
    [
      "http://www.gateremotesource.com/* https://www.gateremotesource.com/:splat 301!",
      "https://gateremotesource.com/* https://www.gateremotesource.com/:splat 301!",
      "http://gateremotesource.com/* https://www.gateremotesource.com/:splat 301!",
      "/about.html /about/ 301!",
      "/index.html / 301!",
    ].forEach((line) => {
      if (!redirects.includes(line)) {
        errors.push(`_redirects missing rule: ${line}`);
      }
    });
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
      if (excludedPrefixes.some((prefix) => urlPath.startsWith(prefix))) {
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
    const pageUrl = htmlUrlForFile(distDir, file);
    const pageHasNoindex = hasNoindex(html);
    const expectedNoindex = noindexPathPrefixes.some((prefix) => pageUrl.startsWith(prefix));
    const isLegacyRedirect = redirects.some((redirect) => {
      return normalizeUrlPath(redirect.from) === normalizeUrlPath(pageUrl);
    });

    if (expectedNoindex && !pageHasNoindex) {
      errors.push(`Expected noindex on ${pageUrl}`);
    }
    if (!expectedNoindex && pageHasNoindex && !isLegacyRedirect) {
      errors.push(`Unexpected noindex on indexable page: ${pageUrl}`);
    }

    canonicalUrls(html).forEach((absoluteUrl) => {
      const urlPath = toUrlPath(siteUrl, absoluteUrl);
      if (urlPath && !urlExists(distDir, urlPath)) {
        errors.push(`Canonical target missing for ${pageUrl}: ${absoluteUrl}`);
      }
    });

    const root = parse(html);
    root.querySelectorAll("[href],[src]").forEach((element) => {
      const rawUrl = element.getAttribute("href") || element.getAttribute("src");
      const internalUrl = resolveInternalUrl(file, distDir, rawUrl);
      if (internalUrl && !urlExists(distDir, internalUrl)) {
        errors.push(`Broken internal link in ${pageUrl}: ${rawUrl}`);
      }
    });
  });

  redirects.forEach((redirect) => {
    if (!urlExists(distDir, redirect.from)) {
      errors.push(`Missing legacy redirect fallback: ${redirect.from} -> ${redirect.to}`);
    }
  });

  [
    "/compatibility/",
    "/compatibility/liftmaster/",
    "/compatibility/faac/",
    "/compatibility/bft/",
    "/compatibility/nice/",
    "/compatibility/came/",
    "/compatibility/doorhan/",
  ].forEach((urlPath) => {
    if (!urlExists(distDir, urlPath)) {
      errors.push(`Missing compatibility page: ${urlPath}`);
      return;
    }
    const file = outputPathForUrl(distDir, urlPath);
    if (hasNoindex(fs.readFileSync(file, "utf8"))) {
      errors.push(`Compatibility page must be indexable: ${urlPath}`);
    }
  });

  return { errors };
};

module.exports = {
  auditDist,
};
