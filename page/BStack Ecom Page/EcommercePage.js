const { expect } = require("@playwright/test");
const config = require("../../config/config");

class EcommercePage {
  constructor(page, testData = {}) {
    this.page = page;
    this.testData = testData;
    this.locators = {
      usernameDropdown: "#username",
      usernameOptions: ".css-yt9ioa-option",
      passwordDropdown: "#password",
      passwordInput: "#react-select-3-input",
      loginButton: "button#login-btn",
      addToCartButtons: "text=Add to cart",
      checkoutButton: "text=Checkout",
      firstName: "#firstNameInput",
      lastName: "#lastNameInput",
      address: "#addressLine1Input",
      state: "#provinceInput",
      postalCode: "#postCodeInput",
      submitButton: "#checkout-shipping-continue",
      orderSuccessMsg: "legend",
    };
  }

  async open() {
    await this.page.goto(`${config.apps.bstackDemo.baseUrl}/signin`, {
      waitUntil: "domcontentloaded",
    });
  }

  async login() {
    await this.page.click(this.locators.usernameDropdown);
    const firstUserOption = this.page.locator(this.locators.usernameOptions).first();
    await expect(firstUserOption).toBeVisible();
    await firstUserOption.click();

    await this.page.click(this.locators.passwordDropdown);
    await this.page.fill(this.locators.passwordInput, config.apps.bstackDemo.password);
    await this.page.keyboard.press("Enter");

    await this.page.click(this.locators.loginButton);
    await this.page.waitForLoadState("networkidle");
  }

  async addFirstProductToCart() {
    const addToCartButton = this.page.locator(this.locators.addToCartButtons).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
  }

  async proceedToCheckout() {
    const checkoutButton = this.page.locator(this.locators.checkoutButton).first();
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
  }

  async fillShippingAddress(firstName, lastName, address, state, postalCode) {
    await this.page.fill(this.locators.firstName, firstName);
    await this.page.fill(this.locators.lastName, lastName);
    await this.page.fill(this.locators.address, address);
    await this.page.fill(this.locators.state, state);
    await this.page.fill(this.locators.postalCode, postalCode);
  }

  async submitShippingAddress() {
    await this.page.click(this.locators.submitButton);
  }

  async verifyOrderSuccess() {
    await expect(this.page.locator(this.locators.orderSuccessMsg)).toContainText("successfully placed");
  }

  async clickButtonByText(buttonText) {
    await this.page.getByRole("button", { name: buttonText, exact: false }).click();
  }

  async clickSpanByText(spanText) {
    await this.page.getByText(spanText, { exact: false }).click();
  }
}

module.exports = { EcommercePage };
