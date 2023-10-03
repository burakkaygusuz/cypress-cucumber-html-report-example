const report = require('multiple-cucumber-html-reporter');
const dayjs = require('dayjs');
const fs = require('fs');

const runInfo = JSON.parse(fs.readFileSync('cypress/reports/results.json', 'utf8'));

const getOSName = () => {
  const osNames = {
    darwin: 'osx',
    win32: 'windows',
    ubuntu: 'ubuntu',
  };

  return osNames[runInfo['osName']] || console.log('Undefined browser');
};

const generateReport = () => {
  report.generate({
    jsonDir: 'cypress/reports/json',
    reportPath: 'cypress/reports',
    metadata: {
      browser: {
        name: runInfo['browserName'],
        version: runInfo['browserVersion'],
      },
      device: 'Local Test Machine',
      platform: {
        name: getOSName(),
        version: runInfo['osVersion'],
      },
    },
    customData: {
      title: 'Run Info',
      data: [
        { label: 'Project', value: 'Sample Project' },
        { label: 'Release', value: '1.0.0' },
        { label: 'Cypress Version', value: runInfo['cypressVersion'] },
        { label: 'Node Version', value: runInfo['nodeVersion'] },
        {
          label: 'Execution Start Time',
          value: dayjs(runInfo['startedTestsAt']).format('YYYY-MM-DD HH:mm:ss.SSS'),
        },
        {
          label: 'Execution End Time',
          value: dayjs(runInfo['endedTestsAt']).format('YYYY-MM-DD HH:mm:ss.SSS'),
        },
      ],
    },
    disableLog: true,
    pageTitle: 'Cypress Cucumber Html Report Example',
    openReportInBrowser: true,
    displayDuration: true,
  });
};

generateReport();
