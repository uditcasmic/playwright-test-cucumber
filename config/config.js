require("dotenv").config();

const BROWSERS = {
  chromium: "chromium",
  firefox: "firefox",
  webkit: "webkit",
};

const browserName = process.env.BROWSER || BROWSERS.chromium;

if (!BROWSERS[browserName]) {
  throw new Error(
    `Unsupported BROWSER "${browserName}". Use one of: ${Object.keys(BROWSERS).join(", ")}`
  );
}

module.exports = {
  browserName,
  defaultTimeoutMs: Number(process.env.DEFAULT_TIMEOUT_MS || 90_000),
  browserLaunchOptions: {
    headless: process.env.HEADLESS !== "false",
    slowMo: Number(process.env.SLOW_MO || 0),
    channel: process.env.CHANNEL || undefined,
  },
  contextOptions: {
    recordVideo:
      process.env.RECORD_VIDEO === "false"
        ? undefined
        : {
            dir: "reports/videos",
          },
  },
  apps: {
    orangeHrm: {
      baseUrl:
        process.env.ORANGEHRM_BASE_URL ||
        "https://opensource-demo.orangehrmlive.com/web/index.php",
      username: process.env.ORANGEHRM_USERNAME,
      password: process.env.ORANGEHRM_PASSWORD,
    },
    bstackDemo: {
      baseUrl: process.env.BSTACK_BASE_URL || "https://bstackdemo.com",
      password: process.env.BSTACK_PASSWORD || "testingisfun99",
    },
  },
};
