const { defineConfig } = require('cypress')
const { allureCypress } = require('allure-cypress/reporter')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://conduit.bondaracademy.com/',
    viewportHeight: 1080,
    viewportWidth: 1920,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    //env is used to specify env variables and then reuse them
    env: {
      email: 'emailtest@gmail.com',
      password: '123456aA!'
    },
    retries: {
      //difines how many test retiries in what mode to execute
      runMode: 1,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });
      return config;
    },
  }
})