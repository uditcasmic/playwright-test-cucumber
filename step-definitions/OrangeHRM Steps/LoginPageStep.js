const { Given, When, Then } = require("@cucumber/cucumber");

Given("I am on the Home screen", async function () {
  await this.pages.login.login();
  await this.pages.login.verifyOnDashboard();
});

When("I navigate to the Dashboard page", async function () {
  await this.pages.login.navigateToDashboard();
});

When("I click on the {string} option from the Sidebar", async function (optionText) {
  await this.pages.login.clickSidebarOption(optionText);
});

When("I click on the {string} button", async function (buttonText) {
  await this.pages.login.clickButtonByText(buttonText);
});

When(
  /^I fill the employee details First Name "([^"]*)" and Last Name "([^"]*)"$/,
  async function (firstName, lastName) {
    await this.pages.login.fillEmployeeDetails(firstName, lastName);
  }
);

Then("I fill in the employee id", async function () {
  await this.pages.login.fillEmployeeId();
});

When("I switch on the toggle button", async function () {
  await this.pages.login.toggleLoginDetails();
});

Then("I fill in random username and password", async function () {
  await this.pages.login.fillRandomUsernameAndPassword();
});

Then("I should see the employee name {string}", async function (expectedName) {
  await this.pages.login.verifyEmployeeName(expectedName);
});

Then("I select the options for the Employee Information", async function (dataTable) {
  const [Nationality, MaritalStatus, DateOfBirth] = dataTable.rows()[0];

  await this.pages.login.fillEmployeeInformation({
    Nationality,
    MaritalStatus,
    DateOfBirth,
  });
});

Then("I should see the generated username in the table", async function () {
  await this.pages.login.verifyGeneratedUsernameInTable();
});

Then("I log out from the application", async function () {
  await this.pages.login.logout();
});
