'use strict';


let driverFactory = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/driverFactory'),
    webdriver = require('../../../node_modules/selenium-webdriver'),
    assert = require('chai').assert,
    remote = require('selenium-webdriver/remote'),
    utils = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/Utils'),
    configuration = require('./Configuration.js'),
    HcpLoginPage = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/LoginPage'),
    ZipOperations = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/ZipOperations'),
    CodeEditorPage = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/CodeEditorPage'),
    RepositoryBrowser = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/RepositoryBrowserModule'),
    GeneralTabPage = require('../../pageObjects/mtaYamlGeneralTabPage'),
    MultiEditorPage = require('../../pageObjects/mtaYamlMultiEditorPage'),
    MtaEditorPage = require('../../pageObjects/mtaYamlEditorPage'),
    ResourcesTabPage = require('../../pageObjects/mtaYamlResourcesTabPage'),
    YamlParser = require('../../../node_modules/webide/src/main/webapp/resources/sap/watt/toolsets/lib/yamlParser/js-yaml'),
    InputHelpDialog = require('../../pageObjects/mtaYamlInputHelpDialogPage'),
    path = require('path');

describe('mtaYaml Resources Tab Test', function () {
    this.timeout(configuration.startupTimeout);
    let driver;
    let webIDE;
    let repositoryBrowser;
    let codeEditorPage;
    let resourcesTabPage;
    let multiEditorPage;
    let mtaEditorPage;
    let inputHelpDialog;
    let currentZipProjectName = "mtaYaml.zip";

    before(function () {
        driver = driverFactory.createDriver();
        driver.setFileDetector(new remote.FileDetector());
        driver.get(configuration.getParam(configuration.KEYS.HOST));
        multiEditorPage = new MultiEditorPage(driver, configuration);
        mtaEditorPage = new MtaEditorPage(driver, configuration);
        repositoryBrowser = new RepositoryBrowser(driver, configuration);
        resourcesTabPage = new ResourcesTabPage(driver, configuration);
        codeEditorPage = new CodeEditorPage(driver, configuration);
        inputHelpDialog = new InputHelpDialog(driver, configuration);
        let hcpLoginPage = new HcpLoginPage(driver, configuration);
        let that = this;
        return hcpLoginPage.doWaitAndLoginOrGoToWebIDE(configuration.getParam(configuration.KEYS.USER_NAME), configuration.getParam(configuration.KEYS.PASSWORD)).then(function (oWebIDE) {
            webIDE = oWebIDE;
            return webIDE.clickDevelopmentPerspectiveAndGoToDevelopmentPerspectivePage(configuration.defaultTimeout);
        }).then(function () {
            let oZipOperations = new ZipOperations(driver, configuration);
            return oZipOperations.importZip(path.resolve(__dirname, 'zip/' + currentZipProjectName), true);
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    after(function () {
        return utils.deleteProjectFromWorkspace(driver, "mtaYaml").thenFinally(function () {
            return driver.quit();
        });
    });

    it('create new resource and update basic info', function () {
        console.log("****-> create new resource and update basic info ");
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Resources Tab");
            return mtaEditorPage.clickOnResourcesTab();
        }).then(function () {
            console.log("click on add resource button");
            return resourcesTabPage.clickOnAddResourceButton();
        }).then(function () {
            console.log("click on resources input field in list");
            return resourcesTabPage.insertToResourcesInputFieldInList("test_resources");
        }).then(function () {
            console.log("click On Type Input Help Button ");
            return resourcesTabPage.clickOnTypeInputHelpButton();
        }).then(function(){
            console.log("insert prefix of Resource Name In Search Field ");
            return inputHelpDialog.insertResourceNameInSearchField("c");
        }).then(function(){
            console.log("insert prefix of Resource Name In Search Field ");
            return inputHelpDialog.clickOnSearchButton();
        }).then(function() {
            console.log("select list item ");
            return inputHelpDialog.clickOnListItem("com.sap.xs.hdi-container");
        }).then(function () {
            console.log("Item updated in basic info");
            return resourcesTabPage.basicInfoInFocus();
        }).then(function () {
            console.log("update Description field ");
            return resourcesTabPage.insertToDescriptionField('test test');

        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.resources[1].name, "test_resources");
            assert.equal(oMTAYaml.resources[1].type, "com.sap.xs.hdi-container");
            assert.equal(oMTAYaml.resources[1].description, "test test");
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    //depends on the first test
    it('update Parameters from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Resources Tab");
            return mtaEditorPage.clickOnResourcesTab();
        }).then(function () {
            console.log("click on add Parameters button");
            return resourcesTabPage.clickOnParametersAddButton();
        }).then(function () {
            console.log("click On Parameters Input Help Button ");
            return resourcesTabPage.clickOnParametersInputHelpButton();
        }).then(function(){
            console.log("select list item ");
            return inputHelpDialog.clickOnListItem("service");
        }).then(function () {
            console.log("Wait till Parameter key is updated");
            return resourcesTabPage.parametersKeySyncErrorGone();
        }).then(function () {
            console.log("insert Parameters value Input");
            return resourcesTabPage.insertToParametersValueField("myval");
        }).then(function () {
            return resourcesTabPage.clickOnParametersArrow();
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.resources[1].parameters["service"], "myval");
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    //depends on the first test
    it('update Properties from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Resources Tab");
            return mtaEditorPage.clickOnResourcesTab();
        }).then(function () {
            console.log("click on add Properties button");
            return resourcesTabPage.clickOnPropertiesAddButton();
        }).then(function () {
            console.log("insert Properties key Input");
            return resourcesTabPage.insertToPropertiesKeyField("Props_test_key");
        }).then(function () {
            console.log("wait till Properties key is updated");
            return resourcesTabPage.propertiesKeySyncErrorGone();
        }).then(function () {
            console.log("insert Properties value Input");
            return resourcesTabPage.insertToPropertiesValueField("Props_test_value");
        }).then(function () {
            return resourcesTabPage.clickOnPropertiesArrow();
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.resources[1].properties["Props_test_key"], "Props_test_value");
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    //depends on previous tests, if one of them fails, wont run!!
    it('delete all from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Resources Tab");
            return mtaEditorPage.clickOnResourcesTab();
            //delete Parameters
        }).then(function () {
            console.log("click On Parameters Arrow");
            return resourcesTabPage.clickOnParametersArrow();
        }).then(function () {
            console.log("click On Parameters first row");
            return resourcesTabPage.clickOnParametersFirstRow();
        }).then(function () {
            console.log("click on remove Parameters button");
            return resourcesTabPage.clickOnParametersRemoveButton();
            // delete properties
        }).then(function () {
            console.log("click On Properties Arrow");
            return resourcesTabPage.clickOnPropertiesArrow();
        }).then(function () {
            console.log("click On Properties first row");
            return resourcesTabPage.clickOnPropertiesFirstRow();
        }).then(function () {
            console.log("click on remove Properties button");
            return resourcesTabPage.clickOnPropertiesRemoveButton();
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate delete in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.resources[1].parameters, undefined);
            assert.equal(oMTAYaml.resources[1].properties, undefined);
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

});