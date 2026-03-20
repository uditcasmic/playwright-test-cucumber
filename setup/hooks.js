const { BeforeAll, Before, After, AfterAll, Status, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium, firefox, webkit } = require("playwright");
const fs = require("fs").promises;
const path = require("path");

const config = require("../config/config");
const { LoginPage } = require("../page/OrangeHRM Page/LoginPage");
const { EcommercePage } = require("../page/BStack Ecom Page/EcommercePage");

const browserTypeMap = { chromium, firefox, webkit };
let browser;

setDefaultTimeout(config.defaultTimeoutMs);

BeforeAll(async function () {
  const browserType = browserTypeMap[config.browserName];
  browser = await browserType.launch(config.browserLaunchOptions);
});

Before(async function () {
  this.browser = browser;
  this.testData = {};

  this.context = await browser.newContext(config.contextOptions);
  this.page = await this.context.newPage();
  this.pages = {
    login: new LoginPage(this.page, this.testData),
    ecommerce: new EcommercePage(this.page, this.testData),
  };
});

After(async function (scenario) {
  const hasPage = this.page && !this.page.isClosed();

  if (scenario.result?.status === Status.FAILED && hasPage) {
    const reportsDirectory = path.resolve("reports");
    const scenarioName = sanitizeFileName(scenario.pickle.name);
    const screenshotFilePath = path.join(reportsDirectory, `${scenarioName}.png`);

    await fs.mkdir(reportsDirectory, { recursive: true });

    const screenshotBuffer = await this.page.screenshot({
      path: screenshotFilePath,
      fullPage: true,
    });

    await this.attach(screenshotBuffer, "image/png");
  }

  const video = hasPage ? this.page.video() : null;

  if (hasPage) {
    await this.page.close();
  }

  if (this.context) {
    await this.context.close();
  }

  if (video) {
    const videoPath = await video.path();
    const videoBuffer = await fs.readFile(videoPath);
    await this.attach(videoBuffer, "video/webm");
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

function sanitizeFileName(fileName) {
  return fileName.replace(/[\\/:"*?<>|]/g, "_");
}
