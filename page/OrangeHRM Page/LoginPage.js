const { expect } = require("@playwright/test");
const config = require("../../config/config");

class LoginPage {
  constructor(page, testData = {}) {
    this.page = page;
    this.testData = testData;
    this.locators = {
      usernameInput: 'input[name="username"]',
      passwordInput: 'input[name="password"]',
      loginButton: 'button[type="submit"]',
      firstName: 'input[name="firstName"]',
      lastName: 'input[name="lastName"]',
      employeeUserName: "//label[text()='Username']/following::input[1]",
      passwordFields: 'input[type="password"]',
      toggleSwitch: ".oxd-switch-input",
      employeeNameHeader: ".orangehrm-edit-employee-name h6",
      nationalityDropdown:
        "label:text('Nationality') >> xpath=following::div[contains(@class,'oxd-select-text-input')][1]",
      maritalStatusDropdown:
        "label:text('Marital Status') >> xpath=following::div[contains(@class,'oxd-select-text-input')][1]",
      tableCells: ".oxd-table-cell.oxd-padding-cell",
      userDropdownIcon: ".oxd-userdropdown-icon",
      logoutLink: "a:text('Logout')",
    };
  }

  async login(username = config.apps.orangeHrm.username, password = config.apps.orangeHrm.password) {
    if (!username || !password) {
      throw new Error("OrangeHRM credentials are missing. Set ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD in .env.");
    }

    await this.page.goto(`${config.apps.orangeHrm.baseUrl}/auth/login`, {
      waitUntil: "domcontentloaded",
    });
    await this.page.fill(this.locators.usernameInput, username);
    await this.page.fill(this.locators.passwordInput, password);
    await this.page.click(this.locators.loginButton);
    await this.page.waitForURL(/dashboard\/index$/, { timeout: 20_000 });
  }

  async verifyOnDashboard() {
    await expect(this.page).toHaveURL(/dashboard\/index$/);
  }

  async navigateToDashboard() {
    await this.page.goto(`${config.apps.orangeHrm.baseUrl}/dashboard/index`, {
      waitUntil: "networkidle",
    });
  }

  async clickSidebarOption(optionText) {
    const sidebarOption = this.page.getByText(optionText, { exact: true });
    await expect(sidebarOption).toBeVisible();
    await sidebarOption.click();
  }

  async clickButtonByText(buttonText) {
    const button = this.page.locator(`//button[normalize-space()='${buttonText}']`).first();
    await expect(button).toBeVisible();
    await button.click();

    if (buttonText === "Save") {
      await this.waitForPageToSettle();
    }
  }

  async fillEmployeeDetails(firstName, lastName) {
    await this.page.fill(this.locators.firstName, firstName);
    await this.page.fill(this.locators.lastName, lastName);
    this.testData.employeeName = `${firstName} ${lastName}`.trim();
  }

  async toggleLoginDetails() {
    const toggle = this.page.locator(this.locators.toggleSwitch).first();
    await expect(toggle).toBeVisible();
    await toggle.click();
  }

  async fillRandomUsernameAndPassword() {
    const randomString = Math.random().toString(36).slice(2, 9);
    const username = `user_${randomString}`;
    const password = `Pass_${randomString}1!`;

    this.testData.generatedUsername = username;
    this.testData.generatedPassword = password;

    await this.page.fill(this.locators.employeeUserName, username);

    const passwordFields = this.page.locator(this.locators.passwordFields);
    const passwordFieldCount = await passwordFields.count();

    if (passwordFieldCount < 2) {
      throw new Error("Password and confirm password fields were not available.");
    }

    await passwordFields.nth(passwordFieldCount - 2).fill(password);
    await passwordFields.nth(passwordFieldCount - 1).fill(password);
  }

  async fillEmployeeId() {
    const employeeId = Math.floor(100000 + Math.random() * 900000).toString();
    const employeeIdInput = this.page.locator(
      "//label[text()='Employee Id']/following::input[contains(@class,'oxd-input')][1]"
    );

    await employeeIdInput.fill(employeeId);
    this.testData.employeeId = employeeId;
    return employeeId;
  }

  async verifyEmployeeName(expectedName) {
    await this.waitForPageToSettle();
    await this.page.waitForURL(/viewPersonalDetails\/empNumber\//, { timeout: 20_000 });

    const [expectedFirstName, expectedLastName] = expectedName.split(" ");

    await expect(this.page.locator(this.locators.firstName)).toHaveValue(expectedFirstName, {
      timeout: 15_000,
    });
    await expect(this.page.locator(this.locators.lastName)).toHaveValue(expectedLastName, {
      timeout: 15_000,
    });
  }

  async fillEmployeeInformation({ Nationality, MaritalStatus, DateOfBirth }) {
    if (Nationality) {
      await this.selectDropdownOption(this.locators.nationalityDropdown, Nationality);
    }

    if (MaritalStatus) {
      await this.selectDropdownOption(this.locators.maritalStatusDropdown, MaritalStatus);
    }

    if (DateOfBirth) {
      const dobInput = this.page
        .locator("//label[text()='Date of Birth']/following::input[@placeholder='yyyy-mm-dd']")
        .or(this.page.locator("//label[text()='Date of Birth']/following::input[@placeholder='yyyy-dd-mm']"))
        .first();

      await expect(dobInput).toBeVisible();
      await dobInput.fill(DateOfBirth);
    }
  }

  async verifyGeneratedUsernameInTable() {
    if (!this.testData.generatedUsername) {
      throw new Error("Generated username was not captured for this scenario.");
    }

    await expect(
      this.page
        .locator(this.locators.tableCells)
        .filter({ hasText: this.testData.generatedUsername })
        .first()
    ).toBeVisible();
  }

  async logout() {
    await this.page.locator(this.locators.userDropdownIcon).click();
    await this.page.locator(this.locators.logoutLink).click();
    await expect(this.page).toHaveURL(/auth\/login$/);
  }

  async selectDropdownOption(dropdownLocator, optionText) {
    await this.page.locator(dropdownLocator).click();
    await this.page.getByRole("option", { name: optionText, exact: true }).click();
  }

  async waitForPageToSettle() {
    await this.page.waitForLoadState("networkidle").catch(() => {});
    await this.page.locator(".oxd-loading-spinner").waitFor({ state: "hidden", timeout: 15_000 }).catch(() => {});
  }
}

module.exports = { LoginPage };
