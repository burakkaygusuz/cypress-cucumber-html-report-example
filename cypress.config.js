const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const {
  addCucumberPreprocessorPlugin,
  afterRunHandler,
} = require('@badeball/cypress-cucumber-preprocessor');
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const fs = require('fs');

const setupNodeEvents = async (on, config) => {
  await addCucumberPreprocessorPlugin(on, config, {
    omitAfterRunHandler: true,
  });

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    }),
  );

  on('after:run', async (results) => {
    if (results) {
      await afterRunHandler(config);
      fs.writeFileSync(
        'cypress/reports/results.json',
        JSON.stringify(
          {
            browserName: results.browserName,
            browserVersion: results.browserVersion,
            osName: results.osName,
            osVersion: results.osVersion,
            nodeVersion: results.config.resolvedNodeVersion,
            cypressVersion: results.cypressVersion,
            startedTestsAt: results.startedTestsAt,
            endedTestsAt: results.endedTestsAt,
          },
          null,
          '\t',
        ),
      );
    }
  });
  return config;
};

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://jsonplaceholder.cypress.io',
    fixturesFolder: false,
    responseTimeout: 5000,
    specPattern: '**/*.feature',
    supportFile: false,
    video: false,
    setupNodeEvents,
    experimentalInteractiveRunEvents: true,
  },
});
