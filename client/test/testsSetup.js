// A RegExp specifying the pattern for identifying test files.
// These files will be loaded as require.js dependencies during the tests.
window.TEST_FILE_PATTERN = /test\/*\/.*Spec\.js$/;

// This custom requirejs path allows requiring resources using requirejs easily in test files.
window.CUSTOM_REQUIREJS_PATHS = {
    'webide-mta-feature': '/base/src',
    'STF': '/base/node_modules/@sap-webide/webide-client-tools/resources/tests/serviceTestFramework',
    'sinon': '/base/node_modules/sinon/pkg/sinon',
    'sap.watt.mta.build.wing.provider': '/base/src/build/wing'

}

// optional: exposing some globals for our tests
window.expect = chai.expect
window.assert = chai.assert