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
