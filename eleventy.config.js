const { parse } = require("node-html-parser");
const i18n = require("./_data/i18n");

const languageSet = new Set(i18n.languages);
const ogLocaleMap = {
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
  fr: "fr_FR",
  pt: "pt_PT",
};

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

const stripLangPrefix = (urlPath) => {
  if (!urlPath || !urlPath.startsWith("/")) return urlPath;
  const parts = urlPath.split("/");
  const first = parts[1];
  if (!languageSet.has(first)) return urlPath;
  const remainder = "/" + parts.slice(2).join("/");
  return remainder === "/" ? "/" : remainder;
};

const isBlogPostPath = (path) => {
  if (!path || !path.startsWith("/blog")) return false;
  const normalized = path.endsWith("/") ? path : `${path}/`;
  if (normalized === "/blog/") return false;
  if (normalized.startsWith("/blog/page/")) return false;
  return true;
};

const splitHref = (href) => {
  const match = href.match(/^([^?#]*)(.*)$/);
  return { path: match ? match[1] : href, suffix: match ? match[2] : "" };
};

const shouldSkipHref = (path) => {
  if (!path) return true;
  if (!path.startsWith("/")) return true;
  if (path.startsWith("//")) return true;
  if (path.startsWith("/assets/")) return true;
  if (path.startsWith("/logo/")) return true;
  if (path.startsWith("/locales/")) return true;
  if (path.startsWith("/Products Photo/")) return true;
  if (path.startsWith("/factroy photo/")) return true;
  if (path.startsWith("/styles/")) return true;
  if (path.startsWith("/favicon")) return true;
  if (path.startsWith("/blog-post-")) return true;
  if (path === "/robots.txt") return true;
  if (path === "/sitemap.xml") return true;
  if (path === "/site.webmanifest") return true;
  return false;
};

const rewriteHref = (href, lang) => {
  if (!href || lang === i18n.defaultLang) return href;
  if (/^[a-z][a-z0-9+.-]*:/.test(href)) return href;
  if (href.startsWith("#") || href.startsWith("?")) return href;
  const { path, suffix } = splitHref(href);
  if (shouldSkipHref(path)) return href;
  const parts = path.split("/");
  if (languageSet.has(parts[1])) return href;
  if (isBlogPostPath(path)) return href;
  const newPath = path === "/" ? `/${lang}/` : `/${lang}${path}`;
  return `${newPath}${suffix}`;
};

const slugify = (value) => {
  if (!value) return "";
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("logo");
  eleventyConfig.addPassthroughCopy("locales");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("Products Photo");
  eleventyConfig.addPassthroughCopy("factroy photo");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(dateObj);
  });

  eleventyConfig.addFilter("htmlDate", (dateObj) => {
    if (!dateObj) return "";
    return new Intl.DateTimeFormat("en-CA").format(dateObj);
  });

  eleventyConfig.addFilter("slugify", slugify);

  eleventyConfig.addFilter("joinSlugList", (values) => {
    if (!values) return "";
    if (!Array.isArray(values)) return slugify(values);
    return values.map((value) => slugify(value)).filter(Boolean).join("|");
  });

  eleventyConfig.addFilter("pluck", (collection, key) => {
    if (!Array.isArray(collection)) return [];
    return collection.flatMap((item) => {
      const value = item.data[key];
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    });
  });

  eleventyConfig.addFilter("unique", (values) => {
    if (!Array.isArray(values)) return [];
    const seen = new Set();
    const output = [];
    values.forEach((value) => {
      if (!value) return;
      if (!seen.has(value)) {
        seen.add(value);
        output.push(value);
      }
    });
    return output;
  });

  eleventyConfig.addFilter("slice", (values, start, end) => {
    if (!Array.isArray(values)) return [];
    return values.slice(start, end);
  });

  eleventyConfig.addFilter("excludeFeatured", (values) => {
    if (!Array.isArray(values)) return [];
    return values.filter((item) => !item.data.featured);
  });

  eleventyConfig.addFilter("getFeatured", (values) => {
    if (!Array.isArray(values)) return null;
    return values.find((item) => item.data.featured) || null;
  });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  eleventyConfig.addFilter("langUrl", (urlPath, lang) => {
    if (!urlPath) return urlPath;
    const cleanPath = stripLangPrefix(urlPath);
    if (!lang || lang === i18n.defaultLang) return cleanPath;
    if (cleanPath === "/") return `/${lang}/`;
    return `/${lang}${cleanPath}`;
  });

  eleventyConfig.addFilter("asArray", (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });

  eleventyConfig.addFilter("contentTags", (tags) => {
    if (!Array.isArray(tags)) return [];
    return tags.filter((tag) => tag !== "post");
  });

  eleventyConfig.addFilter("keywordList", (data) => {
    if (!data) return [];
    const values = [];
    const tags = Array.isArray(data.tags) ? data.tags.filter((tag) => tag !== "post") : [];
    values.push(...tags);
    if (data.category) values.push(data.category);
    if (data.brand) {
      if (Array.isArray(data.brand)) values.push(...data.brand);
      else values.push(data.brand);
    }
    if (data.frequency) {
      if (Array.isArray(data.frequency)) values.push(...data.frequency);
      else values.push(data.frequency);
    }
    if (data.scene) {
      if (Array.isArray(data.scene)) values.push(...data.scene);
      else values.push(data.scene);
    }
    return values.filter(Boolean);
  });

  eleventyConfig.addFilter("relatedPosts", (collection, current, limit = 3) => {
    if (!Array.isArray(collection) || !current) return [];
    const currentTags = new Set(current.data.tags || []);
    return collection
      .filter((item) => item.url !== current.url)
      .map((item) => {
        let score = 0;
        if (item.data.category && item.data.category === current.data.category) {
          score += 2;
        }
        if (Array.isArray(item.data.tags)) {
          item.data.tags.forEach((tag) => {
            if (currentTags.has(tag)) score += 1;
          });
        }
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, limit);
  });

  eleventyConfig.addFilter("seriesPosts", (collection, series) => {
    if (!Array.isArray(collection) || !series) return [];
    return collection
      .filter((item) => item.data.series === series)
      .sort((a, b) => (a.data.series_order || 0) - (b.data.series_order || 0));
  });

  eleventyConfig.addFilter("sitemapEntries", (collection) => {
    if (!Array.isArray(collection)) return [];
    return collection.filter((item) => {
      if (!item.url) return false;
      if (item.data && item.data.eleventyExcludeFromCollections) return false;
      if (item.url.endsWith(".json")) return false;
      return true;
    });
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("post")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addTransform("i18n", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;

    const pageData = this.page && this.page.data ? this.page.data : {};
    const lang = pageData.lang || i18n.defaultLang;
    const translations = i18n.locales[lang];
    if (!translations) return content;

    const root = parse(content);
    const htmlEl = root.querySelector("html");
    if (htmlEl) htmlEl.setAttribute("lang", lang);

    const body = root.querySelector("body");
    const metaOverride = body && body.getAttribute("data-meta-override") === "true";
    const metaPage = body ? body.getAttribute("data-meta-page") : "";
    const pageMeta =
      metaOverride && translations.meta
        ? metaPage && translations.meta[metaPage]
          ? translations.meta[metaPage]
          : translations.meta
        : null;

    if (pageMeta) {
      const titleEl = root.querySelector("#meta-title") || root.querySelector("title");
      if (titleEl && pageMeta.title) titleEl.set_content(escapeHtml(pageMeta.title));
      const descEl = root.querySelector("#meta-description");
      if (descEl && pageMeta.description) descEl.setAttribute("content", pageMeta.description);
      const keywordsEl = root.querySelector("#meta-keywords");
      if (keywordsEl && pageMeta.keywords) keywordsEl.setAttribute("content", pageMeta.keywords);

      const ogTitle = root.querySelector('meta[property="og:title"]');
      if (ogTitle && pageMeta.title) ogTitle.setAttribute("content", pageMeta.title);
      const ogDesc = root.querySelector('meta[property="og:description"]');
      if (ogDesc && pageMeta.description) ogDesc.setAttribute("content", pageMeta.description);
      const twitterTitle = root.querySelector('meta[name="twitter:title"]');
      if (twitterTitle && pageMeta.title) twitterTitle.setAttribute("content", pageMeta.title);
      const twitterDesc = root.querySelector('meta[name="twitter:description"]');
      if (twitterDesc && pageMeta.description) twitterDesc.setAttribute("content", pageMeta.description);
    }

    const ogLocale = root.querySelector('meta[property="og:locale"]');
    if (ogLocale && ogLocaleMap[lang]) {
      ogLocale.setAttribute("content", ogLocaleMap[lang]);
    }

    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const key = element.getAttribute("data-i18n-html");
      const value = getNestedValue(translations, key);
      if (value !== null && value !== undefined) {
        element.set_content(String(value));
      }
    });

    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = getNestedValue(translations, key);
      if (value === null || value === undefined) return;
      const tagName = element.tagName ? element.tagName.toLowerCase() : "";
      if (tagName === "input" || tagName === "textarea") {
        element.setAttribute("placeholder", String(value));
      } else {
        element.set_content(escapeHtml(value));
      }
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const value = getNestedValue(translations, key);
      if (value === null || value === undefined) return;
      element.setAttribute("placeholder", String(value));
    });

    if (lang !== i18n.defaultLang) {
      root.querySelectorAll("a").forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (!href) return;
        const rewritten = rewriteHref(href, lang);
        if (rewritten !== href) anchor.setAttribute("href", rewritten);
      });
    }

    const rendered = root.toString();
    const hasDoctype = /<!doctype html/i.test(content);
    if (hasDoctype && !/<!doctype html/i.test(rendered)) {
      const doctypeMatch = content.match(/<!doctype html[^>]*>/i);
      const doctype = doctypeMatch ? doctypeMatch[0] : "<!doctype html>";
      return `${doctype}\n${rendered}`;
    }

    return rendered;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
