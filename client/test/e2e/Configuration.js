'use strict';
var globalConfiguration = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/globalConfiguration");

// KEYS
var KEYS = {
    "HOST": "host",
    "SELENIUM_HOST": "seleniumHost",
    "USER_NAME": "userName",
    "PASSWORD": "password"
};

//Get webIDE host with the url params
function _getWebIDEUrl () {
    var DEF_WEBIDE_HOST = "https://webidecp-a212e7975.dispatcher.hana.ondemand.com";
    var webIDEHost = process.env.host ? process.env.host : DEF_WEBIDE_HOST
    var wingParam = process.env.wing ? "&sap-ide-toggles-wing=true" : "";
    webIDEHost= webIDEHost + "?settings=delete&test=selenium" + wingParam;
    return webIDEHost;
}




var testConfiguration = {};
testConfiguration[KEYS.HOST] = _getWebIDEUrl();
testConfiguration[KEYS.SELENIUM_HOST] = "http://localhost:4444/wd/hub";
testConfiguration[KEYS.USER_NAME] = "P2001028284";
testConfiguration[KEYS.PASSWORD] = "Abcd1234";

module.exports = {
    KEYS: KEYS,
    startupTimeout : 100000,
    defaultTimeout : 40000,
    setParam: function setParam(key, value) {
        testConfiguration[key] = value;
    },

    getParam: function getParam(key) {
        return testConfiguration[key];
    }
};
