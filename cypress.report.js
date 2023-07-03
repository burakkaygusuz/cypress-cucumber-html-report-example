const report = require('multiple-cucumber-html-reporter');
const dayjs = require('dayjs');
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const BASE_URL = 'https://github.com/cucumber/json-formatter/releases/download/v19.0.0';
const FILE_NAME = 'cucumber-json-formatter';

let url = '';
let fileName = FILE_NAME;

switch (os.platform()) {
  case 'win32':
    url = `${BASE_URL}/${FILE_NAME}-windows-amd64`;
    fileName += '.exe';
    break;
  case 'darwin':
    url = `${BASE_URL}/${FILE_NAME}-darwin-amd64`;
    break;
  case 'linux':
    url = `${BASE_URL}/${FILE_NAME}-linux-amd64`;
    break;
  default:
    console.log('Unsupported platform');
    process.exit(1);
}

const filePath = path.join('./.bin', fileName);
fs.mkdirSync('./.bin', { recursive: true });
const file = fs.createWriteStream(filePath);

https
  .get(url, (response) => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('File downloaded and renamed successfully');

      if (os.platform() === 'darwin' || os.platform() === 'linux') {
        exec(`chmod +x ${filePath}`, (error) => {
          if (error) {
            console.log(`Error changing file permission: ${error}`);
          } else {
            console.log('File permission changed successfully');
          }
        });
      }
    });
  })
  .on('error', (err) => {
    fs.unlinkSync(filePath);
    console.log('Error: ', err.message);
  });

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
