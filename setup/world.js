const { setWorldConstructor } = require("@cucumber/cucumber");

class CustomWorld {
  constructor({ attach, log, parameters }) {
    this.attach = attach;
    this.log = log;
    this.parameters = parameters;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.testData = {};
    this.pages = {};
  }
}

setWorldConstructor(CustomWorld);
