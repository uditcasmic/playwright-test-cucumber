const { When, Then } = require("@cucumber/cucumber");

When("I redirect to the BStack Ecommerce Website", async function () {
  await this.pages.ecommerce.open();
});

Then("I log in to the BStack Ecommerce site", async function () {
  await this.pages.ecommerce.login();
});

When("I add the first iPhone to the cart", async function () {
  await this.pages.ecommerce.addFirstProductToCart();
});

Then("I proceed to checkout", async function () {
  await this.pages.ecommerce.proceedToCheckout();
});

Then("I fill up the shipping address", async function (dataTable) {
  const [firstName, lastName, address, state, postalCode] = dataTable.rows()[0];

  await this.pages.ecommerce.fillShippingAddress(
    firstName,
    lastName,
    address,
    state,
    postalCode
  );
  await this.pages.ecommerce.submitShippingAddress();
});

Then("I should see order success message", async function () {
  await this.pages.ecommerce.verifyOrderSuccess();
});

Then("I click on {string} button", async function (buttonText) {
  await this.pages.ecommerce.clickButtonByText(buttonText);
});

Then("I click on {string} span", async function (spanText) {
  await this.pages.ecommerce.clickSpanByText(spanText);
});
