'use strict'

const argv = require("minimist")(process.argv.slice(2))
// flag to indicate running the tests with code coverage on
const coverageMode = !!argv.coverage

const karmaTools = require('@sap-webide/webide-client-tools').karma

module.exports = function (config) {
    if (process.env.XMAKE_TOOL_INSTALLATION_ROOT) {
        console.log("Running in xMake mode. Karma tests will not be executed as no browsers are available...");
        process.exit(0);
    }

    var webideConfig = karmaTools.defaultProps()

    webideConfig.browsers = webideConfig.browsers.concat('ChromeHeadlessNoSandbox')
    webideConfig.customLaunchers = {
        ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
        }
    }

    var userFiles = // extra files configuration see docs at:
        // http://karma-runner.github.io/1.0/config/files.html
        [
            // Chai is a very good assertion library (http://chaijs.com/)
            // Sinon is a standalone test spies, stubs and mocks library (http://sinonjs.org/)
            // They not part of the webide-client-tools, you may use whichever assertion and mock library you prefer...
            'node_modules/chai/chai.js',
            'node_modules/sinon/pkg/sinon.js',

            // The testSetup.js defines the pattern that identifies test files
            // and optionally other test configuration options such as timeouts / custom require.js paths
            'test/testsSetup.js',

            // The karma webserver must "serve" both our production and test sources to enable testing.
            // Add additional patterns here depending on your project's structure.
            { pattern: 'src/**/*', served: true, included: false, nocache: !coverageMode },
            { pattern: 'test/**/*', served: true, included: false, nocache: true }
        ]

    webideConfig.files = userFiles.concat(webideConfig.files)

    webideConfig.reporters = ['mocha', 'coverage', 'junit', 'html'];

    // coverage collection will slow down the performance and make debugging
    // difficult(due to instrumentation, so it is not enabled by default.
    if (coverageMode) {
        const userPreprocessors = {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            "src/**/*.js": ["coverage"]
        }

        webideConfig.preprocessors = Object.assign(
            {},
            webideConfig.preprocessors,
            userPreprocessors
        )

        // optionally augment coverageReporter config to enable thresholds checks.
        // see more options in: https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
        webideConfig.coverageReporter = Object.assign(
            {},
            webideConfig.coverageReporter,
            {
                check: {
                    global: {
                        statements: 75,
                        branches: 71,
                        functions: 82,
                        lines: 75
                    }
                },
                dir: 'coverage/webide-mta-feature',
                reporters: [
                    {type: 'json', subdir: '.'},
                    {type: 'html', subdir: '.'},
                    {type: 'cobertura', subdir: '.', file: 'cobertura.xml'},
                    {type: 'lcov', subdir: '.'}
                ]
            }
        )

        webideConfig.junitReporter = {
            outputFile: 'TEST-karma-webide-mta-feature-results.xml',
            outputDir: 'target/karma/webide-mta-feature/',
            suite: 'webide-mta-feature'
        }

        webideConfig.htmlReporter = {
            outputDir: 'target/karma/webide-mta-feature/', // where to put the reports
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: true, // reports show failures on start
            namedFiles: false, // name files instead of creating sub-directories
            pageTitle: null, // page title for reports; browser info by default
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
            reportName: 'testResults' // report summary filename; browser info by default
        }
    }

    config.set(webideConfig)
}