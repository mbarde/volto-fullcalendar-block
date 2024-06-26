const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1280,
  defaultCommandTimeout: 15000,

  env: {
    API_PATH: "http://localhost:8080/Plone",
  },

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
