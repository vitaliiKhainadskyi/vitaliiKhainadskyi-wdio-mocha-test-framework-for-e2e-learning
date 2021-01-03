const fs = require("fs");
const path = require("path");
const exec = require('child_process').exec;
const { addAttachment } = require('@wdio/allure-reporter').default;
require('ts-node').register({files: true});
require('dotenv').config();

// the path to directory for files downloaded from browser
process.env.DEFAULT_DOWNLOAD_DIR = path.join(__dirname, 'downloads');
// the path to directory for project files needed for tests
process.env.RESOURCES_DIR = path.join(__dirname, 'resources');

// variable that contains project base url
process.env.BASE_URL = 'https://amazon.com/';
// variable that contains site name from url
process.env.SITE_NAME = process.env.BASE_URL.match(/\/(\w+)/)[1]

/**
 * Gets paths for spec files from global variable, and writes file new file paths to it.
 *
 * Using glob library and sync method we search all files that matches pattern into a variable
 * Then it reads each file and it it contains 'it.only(' tag and is not present already,
 * add it to matchedFiles variable
 */
if (process.env.npm_config_argv.includes("specificTests")) {
    process.env.MATCHED_FILES = JSON.stringify([]);
    const glob = require('glob');
    let testFiles = glob.sync(`${process.env.SITE_NAME}/test/specs/**/*.ts`);

    testFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes(`it.only(`)) {
            const matchedFiles = JSON.parse(process.env.MATCHED_FILES);
            if (!matchedFiles.includes(file)) {
                matchedFiles.push(file);
                process.env.MATCHED_FILES = JSON.stringify(matchedFiles);
            }
        }
    })
}

// Variable that contains number of browser instances (threads)
const instances = process.env.INSTANCESS ? +process.env.INSTANCES : 1
// // Variable that contains the number for selenium port, needed for parallel ran (or smth)
const seleniumPort = process.env.SELENIUM_DEFAULT_PORT ? process.env.SELENIUM_DEFAULT_PORT : '4444';

// array variable that contains paths to spec files that needed to be run
const matchedFiles = JSON.parse(process.env.MATCHED_FILES || 0);

let chromeArgs = [
    '--no-sandbox',
    'disable-infobars',
    'disable-extensions',
    'window-size=1920,1080',
    'disable-notifications',
    'disable-popup-blocking',
    '--disable-dev-shm-usage',
    '--disable-impl-side-painting'
];

if (JSON.parse(process.env.HEADLESS || 0)) {
    chromeArgs.push('--headless');
}

let chromeCaps = [{
    port: Number(seleniumPort),
    browserName: 'chrome',
    maxInstances: instances,
    'goog:chromeOptions': {
        args: chromeArgs,
        prefs: {
            download: {
                default_directory: process.env.DEFAULT_DOWNLOAD_DIR
            }
        }
    }
}];

let chromeServices = ['devtools', ['selenium-standalone', {
    args: {
        seleniumArgs: ['-port', seleniumPort]
    }
}]]

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: matchedFiles || [
        `./${process.env.SITE_NAME}/test/specs/**/*.ts`
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: chromeCaps || [{

        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: 5,
        //
        browserName: 'chrome',
        acceptInsecureCerts: true
        // If outputDir is provided WebdriverIO can capture driver session logs
        // it is possible to configure which logTypes to include/exclude.
        // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
        // excludeDriverLogs: ['bugreport', 'server'],
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: process.env.BASE_URL,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: chromeServices || ['chromedriver'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: [ 'dot', 'spec',
        ['allure', {
            outputDir: 'reports/reports-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
            disableMochaHooks: true,
        }]],
    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        // timeout needed for debug and not shutting down session for that time in general
        timeout: 99999999,
        // the num of times tests will be retried until they are passed
        retries: 0
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: async function (config, capabilities) {
        await exec('mkdir -p downloads && rm -rf downloads/*');
        await exec('rm -rf reports/* && mkdir -p reports/allure-report && mkdir -p reports/reports-results;')
    },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {Object}         browser      instance of created browser/device session
     */
    before: function (capabilities, specs) {
        browser.url('');
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    beforeTest: function (test, context) {
        browser.reloadSession();
        browser.url('');
        console.log(`Test: ${test.title}`);
    },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    afterHook: function (test, context, { error, result, duration, passed, retries }) {
        if (error) {
            browser.takeScreenshot();
            const windows = browser.getWindowHandles();
            windows.forEach((w, i) => {
                if (i !== 0) {
                    browser.switchToWindow(windows[i]);
                    browser.closeWindow();
                }
            });
            browser.switchToWindow(windows[0]);
            browser.execute('window.sessionStorage.clear(); window.localStorage.clear();');
            browser.deleteAllCookies();
            browser.url('');
        }
    },
    /**
     * Function to be executed after a test (in Mocha/Jasmine).
     */
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            let screenShot = null;
            try {
                screenShot = browser.takeScreenshot();
                image = new Buffer.from(screenShot, 'base64');
            } catch (e) {
                browser.pause(1000);
                screenShot = browser.takeScreenshot();
                image = new Buffer.from(screenShot, 'base64');
            }
            addAttachment('afterTest screenshot', image, 'image/png')
            console.log('\x1b[31m%s\x1b[0m', `    ${error.stack} \n`);
        }
    },
    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    //onReload: function(oldSessionId, newSessionId) {
    //}
}
