'use strict';
var globalConfiguration = require("../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/globalConfiguration");




// KEYS
var KEYS = {
    "HOST": "host",
    "SELENIUM_HOST": "seleniumHost",
    "USER_NAME": "userName",
    "PASSWORD": "password"
};

//Get webIDE host with the url params
function _getWebIDEUrl () {
    var DEF_WEBIDE_HOST = "https://dicidev-xg98ih1clz.dispatcher.int.sap.hana.ondemand.com";
    var webIDEHost = process.env.host ? process.env.host : DEF_WEBIDE_HOST
    var wingParam = process.env.wing ? "&sap-ide-toggles-wing=true" : "";
    webIDEHost= webIDEHost + "?settings=delete&test=selenium" + wingParam;
    return webIDEHost;
}


var testConfiguration = {};
testConfiguration[KEYS.HOST] = _getWebIDEUrl();
testConfiguration[KEYS.SELENIUM_HOST] = "http://localhost:4444/wd/hub";
testConfiguration[KEYS.USER_NAME] = "P1942591119", /*mtafeature@gmail.com/Abcd1234@*/
testConfiguration[KEYS.PASSWORD] = "Mars_1209";

module.exports = {
    KEYS: KEYS,
    url : testConfiguration[globalConfiguration.KEYS.HOST],    endPoint : "api.cf.sap.hana.ondemand.com",
    space : "automation",
    organization :  "devx2",
    startupTimeout : 310000,
    defaultTimeout : 40000,
    templateName : 'Multi-Target Application',
    projectName: 'MTATest',
    projectDataName:"MasterD",
    sHTML5ModuleName : "HTML5Test",
    sNodeJsModuleName : "NodeJsTest",
    sHDBModuleName : "HDBTest",
    sHDBModuleNameWithCDS : "HDBTestWithCDS",
    sJavaModuleName : "JavaTest",
    templateCategory : "All categories",
    importProjectName : "MTA1",
    gitRepo : "https://github.cld.ondemand.com/devx-di/MTA_test1.git",
    gitProjectName: "MTA_test1",
    verison: "0.0.1",
    setParam: function setParam(key, value) {
        testConfiguration[key] = value;
    },

    getParam: function getParam(key) {
        return testConfiguration[key];
    }
};
