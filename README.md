# Playwright Cucumber Framework

This repository is a BDD automation framework for:

- OrangeHRM
- BStackDemo Ecommerce

It uses:

- Playwright for browser automation
- Cucumber.js for Gherkin-based execution
- Chai for shared assertions where needed

## Framework Improvements Applied

- Moved browser, context, page, and test data into a scenario-scoped Cucumber `World`
- Removed runtime dependence on `global.page`, `global.browser`, and `global` test data
- Centralized framework configuration in [config/config.js](/d:/Project/playwrightTest/config/config.js)
- Standardized Cucumber bootstrapping through [cucumber.js](/d:/Project/playwrightTest/cucumber.js)
- Updated page objects to use their own `page` instance consistently
- Added cleaner npm scripts for full, headed, and tag-based runs
- Expanded `.gitignore` to exclude generated framework artifacts

## Project Structure

```text
config/             Environment and runtime configuration
features/           Gherkin feature files
page/               Page object models
setup/              Cucumber world, hooks, and shared assertions
step-definitions/   Step bindings
reports/            HTML, JSON, and failure screenshots
```

## Setup

```bash
npm install
npx playwright install
```

Create a `.env` file with:

```env
ORANGEHRM_USERNAME=Admin
ORANGEHRM_PASSWORD=admin123
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php
BSTACK_BASE_URL=https://bstackdemo.com
BSTACK_PASSWORD=testingisfun99
BROWSER=chromium
HEADLESS=true
RECORD_VIDEO=true
DEFAULT_TIMEOUT_MS=90000
```

## Run Tests

```bash
npm test
npm run test:headed
npm run test:orangehrm
npm run test:ecommerce
```

## GitHub Actions

This project includes a CI workflow at `.github/workflows/playwright-bdd.yml`.
It installs dependencies, installs Playwright Chromium, runs the Cucumber suite, and uploads the `reports/` folder as a build artifact.

## Notes

- Reports are generated in `reports/`
- Videos are recorded in `reports/videos/`
- Failed scenarios automatically attach screenshots and videos to the Cucumber output
