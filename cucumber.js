module.exports = {
  default: {
    require: [
      "setup/world.js",
      "setup/assertions.js",
      "setup/hooks.js",
      "step-definitions/**/*.js",
    ],
    paths: ["features/**/*.feature"],
    format: [
      "html:reports/cucumber_report.html",
      "json:reports/cucumber_report.json",
      "summary",
      "@cucumber/pretty-formatter",
    ],
    retry: 0,
  },
};
