const existingBlogTargets = {
  "avoid-public-mold-trap-pcb-quality": "/blog/avoid-public-mold-trap-pcb-quality/",
  "nice-came-hormann-compatibility-guide": "/blog/nice-came-hormann-compatibility-guide/",
  "how-to-identify-a-compatible-gate-remote": "/blog/nice-came-hormann-compatibility-guide/",
  "rolling-code-vs-fixed-code-remotes": "/blog/nice-came-hormann-compatibility-guide/",
  "when-oem-remote-control-development-is-needed": "/oem/",
  "what-buyers-should-send-before-rf-matching": "/contact/",
  "oem-odm-hardware-future": "/oem/",
  "circuits-dont-act-good-enough-transmitter-modules": "/blog/choose-433-92mhz-remote-control/",
  "car-key-short-range-window-tint": "/blog/choose-433-92mhz-remote-control/",
};

const legacyBlogLanguages = ["en", "fr", "de", "es", "it", "pt", "ru"];
const legacyBlogRedirects = legacyBlogLanguages.flatMap((lang) =>
  Object.entries(existingBlogTargets).map(([slug, to]) => ({
    from: `/${lang}/blog/${slug}/`,
    to,
  })),
);
const slashlessLegacyBlogRedirects = legacyBlogLanguages.flatMap((lang) =>
  Object.entries(existingBlogTargets).map(([slug, to]) => ({
    from: `/${lang}/blog/${slug}`,
    to,
  })),
);

module.exports = {
  robotsDisallow: [
    "/_next/static/",
    "/_next/image",
    "/?q=",
    "/*?intent=",
    "/*?demand_type=",
  ],
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
    { from: "/catalog.html", to: "/catalog/" },
    { from: "/blog.html", to: "/blog/" },
    { from: "/contact.html", to: "/contact/" },
    { from: "/oem.html", to: "/oem/" },
    { from: "/oem-odm/", to: "/oem/" },
    { from: "/en/blog/", to: "/blog/" },
    { from: "/en/oem-odm/", to: "/oem/" },
    { from: "/privacy.html", to: "/" },
    { from: "/shipping.html", to: "/" },
    { from: "/terms.html", to: "/" },
    { from: "/compatibility-132", to: "/compatibility/" },
    { from: "/compatibility-83", to: "/compatibility/" },
    {
      from: "/blog-post-avoid-public-mold-trap-pcb-quality.html",
      to: "/blog/avoid-public-mold-trap-pcb-quality/",
    },
    {
      from: "/blog/posts/avoid-public-mold-trap-pcb-quality/",
      to: "/blog/avoid-public-mold-trap-pcb-quality/",
    },
    { from: "/catalog/1/", to: "/catalog/" },
    { from: "/catalog/2/", to: "/catalog/" },
    { from: "/catalog/3/", to: "/catalog/" },
    { from: "/catalog/4/", to: "/catalog/" },
    { from: "/catalog/5/", to: "/catalog/" },
    { from: "/en/", to: "/" },
    { from: "/ru/", to: "/" },
    ...legacyBlogRedirects,
  ],
  hostRedirects: [
    {
      from: "http://www.gateremotesource.com/*",
      to: "https://www.gateremotesource.com/:splat",
    },
    {
      from: "https://gateremotesource.com/*",
      to: "https://www.gateremotesource.com/:splat",
    },
    {
      from: "http://gateremotesource.com/*",
      to: "https://www.gateremotesource.com/:splat",
    },
  ],
  patternRedirects: [
    { from: "/index.html", to: "/" },
    { from: "/blog", to: "/blog/" },
    ...slashlessLegacyBlogRedirects,
    { from: "/en/*", to: "/:splat" },
    { from: "/ru/*", to: "/:splat" },
  ],
};
