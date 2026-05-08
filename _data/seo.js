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
  ],
};
