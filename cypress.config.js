const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');
const {
  addCucumberPreprocessorPlugin,
  afterRunHandler,
} = require('@badeball/cypress-cucumber-preprocessor');
const fs = require('fs').promises;

const setupNodeEvents = async (on, config) => {
  await addCucumberPreprocessorPlugin(on, config, {
    omitAfterRunHandler: true,
  });

  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.feature$/,
              use: [
                {
                  loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                  options: config,
                },
              ],
            },
          ],
        },
      },
    }),
  );

  on('after:run', async (results) => {
    if (results) {
      await afterRunHandler(config);
      await fs.writeFile(
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
