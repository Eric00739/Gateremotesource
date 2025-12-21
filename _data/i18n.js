const fs = require("fs");
const path = require("path");

const languages = ["en", "es", "de", "it", "fr", "pt"];
const defaultLang = "en";
const localesDir = path.join(__dirname, "..", "locales");

const locales = languages.reduce((acc, lang) => {
  const filePath = path.join(localesDir, `${lang}.json`);
  acc[lang] = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return acc;
}, {});

module.exports = {
  languages,
  defaultLang,
  locales,
};
