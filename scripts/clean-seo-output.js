const fs = require("node:fs");
const path = require("node:path");

const distDir = path.join(process.cwd(), "dist");
const stalePaths = [
  "docs",
  "OPTIMIZATION_CHECKLIST",
  "OPTIMIZATION_GUIDE",
  path.join("blog", "posts"),
];

stalePaths.forEach((relativePath) => {
  const target = path.join(distDir, relativePath);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
});
