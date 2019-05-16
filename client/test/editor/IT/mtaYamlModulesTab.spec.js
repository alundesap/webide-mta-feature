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
    ModulesTabPage = require('../../pageObjects/mtaYamlModulesTabPage'),
    MultiEditorPage = require('../../pageObjects/mtaYamlMultiEditorPage'),
    MtaEditorPage = require('../../pageObjects/mtaYamlEditorPage'),
    YamlParser = require('../../../node_modules/webide/src/main/webapp/resources/sap/watt/toolsets/lib/yamlParser/js-yaml'),
    InputHelpDialog = require('../../pageObjects/mtaYamlInputHelpDialogPage'),

    path = require('path');


describe('mtaYaml Modules Tab Test', function () {
    this.timeout(configuration.startupTimeout);
    let driver;
    let webIDE;
    let repositoryBrowser;
    let codeEditorPage;
    let modulesTabPage;
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
        modulesTabPage = new ModulesTabPage(driver, configuration);
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

    it('update Properties and Description from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Modules Tab");
            return mtaEditorPage.clickOnModulesTab();
        }).then(function () {
            console.log("check if remove button is disable ");
            return modulesTabPage.checkIfRemoveButtonDisabled();
        }).then(function () {
            console.log("click on add properties button");
            return modulesTabPage.clickOnPropertiesAddButton();
        }).then(function () {
            console.log("insert Properties key Input");
            return modulesTabPage.insertToPropertiesKeyField("Props_test_key");
        }).then(function () {
            console.log("insert Properties value Input");
            return modulesTabPage.insertToPropertiesValueField("Props_test_value");
        }).then(function () {
            console.log("update Description field ");
            return modulesTabPage.insertToDescriptionField("test test");
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.modules[0].properties["Props_test_key"], "Props_test_value");
            assert.equal(oMTAYaml.modules[0].description, "test test");
            return;
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });


    it('update Requires from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Modules Tab");
            return mtaEditorPage.clickOnModulesTab();
        }).then(function () {
            console.log("check if parameters table is unvisible");
            return modulesTabPage.checkIfParamsTableIsUnvisible();
        }).then(function () {
            console.log("click on add requires button");
            return modulesTabPage.clickOnRequiresAddButton();
        }).then(function () {
            console.log("click on add requires button");
            return modulesTabPage.clickOnRequiresAddButton();
        }).then(function () {
            console.log("wait for tables to be visible");
            return modulesTabPage.waitForParamsTableToBeVisible();
        }).then(function () {
            console.log("insert requires name Input");
            return modulesTabPage.insertToRequiresNameComboBox("test (resource)");
        }).then(function () {
            console.log("insert requires group Input");
            return modulesTabPage.insertToRequiresGroupInputField("Requires_test_group");
        }).then(function () {
            console.log("check if table title is updated");
            return modulesTabPage.isTableTitleWasUpdated("Parameters of test");
        }).then(function () {
            console.log("click on add requires params button");
            return modulesTabPage.clickOnRequiresParamsAddButton();
        }).then(function () {
            console.log("insert parameters key Input");
            return modulesTabPage.insertToRequiresParamsKeyField("Params_test_key");
        }).then(function () {
            console.log("insert parameters value Input");
            return modulesTabPage.insertToRequiresParamsValueField("Params_test_value");
        }).then(function () {
            console.log("click on add requires params button");
            return modulesTabPage.clickOnRequiresPropsAddButton();
        }).then(function () {
            console.log("insert properties key Input");
            return modulesTabPage.insertToRequiresPropsKeyField("Props_test_key");
        }).then(function () {
            console.log("insert parameters value Input");
            return modulesTabPage.insertToRequiresPropsValueField("Props_test_value");
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.modules[0].requires[0].name, "test");
            assert.equal(oMTAYaml.modules[0].requires[0].group, "Requires_test_group");
            assert.equal(oMTAYaml.modules[0].requires[0].parameters["Params_test_key"], "Params_test_value");
            assert.equal(oMTAYaml.modules[0].requires[0].properties["Props_test_key"], "Props_test_value");
            return;
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    //requires fix in code!! provides property key exits focus after first letter
    it('update Provides from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Modules Tab");
            return mtaEditorPage.clickOnModulesTab();
        }).then(function () {
            console.log("click on add Provides button");
            return modulesTabPage.clickOnProvidesAddButton();
        }).then(function () {
            console.log("click on add Provides button");
            return modulesTabPage.clickOnProvidesAddButton();
        }).then(function () {
            console.log("insert Provides name Input");
            return modulesTabPage.insertToProvidesNameInputField("Provides_test");
        }).then(function () {
            console.log("click on add Provides properties button");
            return modulesTabPage.clickOnProvidesPropsAddButton();
        }).then(function () {
            console.log("insert properties key Input");
            return modulesTabPage.insertToProvidesPropsKeyField("Props_test_key");
        }).then(function () {
            console.log("insert parameters value Input");
            return modulesTabPage.insertToProvidesPropsValueField("Props_test_value");
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.modules[0].provides[0].name, "Provides_test");
            assert.equal(oMTAYaml.modules[0].provides[0].properties["Props_test_key"], "Props_test_value");
            return;
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    it('update Parameters from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Modules Tab");
            return mtaEditorPage.clickOnModulesTab();
        }).then(function () {
            console.log("click on add Parameters button");
            return modulesTabPage.clickOnParametersAddButton();
        }).then(function () {
            console.log("click On Parameters Input Help Button ");
            return modulesTabPage.clickOnParametersInputHelpButton();
            //}).then(function(){
            //console.log("insert prefix of Resource Name In Search Field ");
            //return inputHelpDialog.insertResourceNameInSearchField("p");
            //}).then(function(){
            //console.log("click On Search Button");
            //return inputHelpDialog.clickOnSearchButton();
        }).then(function(){
            console.log("select list item ");
            return inputHelpDialog.clickOnListItem("command");
        }).then(function () {
            console.log("Wait till Parameter key is updated");
            return modulesTabPage.parametersKeySyncErrorGone();
        }).then(function () {
            console.log("insert Parameters value Input");
            return modulesTabPage.insertToParametersValueField("myval");
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.modules[0].parameters["command"], "myval");
            return;
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    it('update Build- Parameters from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Modules Tab");
            return mtaEditorPage.clickOnModulesTab();
            // }).then(function () {
            //     console.log("click On Build Parameters Arrow ");
            //     return modulesTabPage.clickOnBuildParametersArrow();
        }).then(function () {
            console.log("click on add Build Parameters button");
            return modulesTabPage.clickOnBuildParametersAddButton();
        }).then(function () {
            console.log("insert Build Parameters key Input");
            return modulesTabPage.insertToBuildParametersKeyField("Prams_test_key");
        }).then(function () {
            console.log("insert Build Parameters value Input");
            return modulesTabPage.insertToBuildParametersValueField("Params_test_value");
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.modules[0]["build-parameters"]["Prams_test_key"], "Params_test_value");
            return;
        }).thenCatch(function (oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    it('delete all from Ui', function () {
        let that = this;
        console.log("open mta.yaml");
        return repositoryBrowser.openFile("mtaYaml/mta.yaml").then(function () {
            console.log("open MTA Editor Tab");
            return multiEditorPage.clickOnMTAEditorTab();
        }).then(function () {
            console.log("open Modules Tab");
            return mtaEditorPage.clickOnModulesTab();
            //delete properties
        }).then(function () {
            console.log("click On Properties first row");
            return modulesTabPage.clickOnPropertiesFirstRow();
        }).then(function () {
            console.log("click on remove Properties button");
            return modulesTabPage.clickOnPropertiesRemoveButton();
            //delete Requires
        }).then(function () {
            console.log("click On Requires first row");
            return modulesTabPage.clickOnRequiresFirstRow();
        }).then(function () {
            console.log("click on remove Requires button");
            return modulesTabPage.clickOnRequiresRemoveButton();
        }).then(function () {
            console.log("click On Requires first row");
            return modulesTabPage.clickOnRequiresFirstRow();
        }).then(function () {
            console.log("click on remove Requires button");
            return modulesTabPage.clickOnRequiresRemoveButton();
            //delete Provides
        }).then(function () {
            console.log("click On Provides first row");
            return modulesTabPage.clickOnProvidesFirstRow();
        }).then(function () {
            console.log("click on remove Provides button");
            return modulesTabPage.clickOnProvidesRemoveButton();
        }).then(function () {
            console.log("click On Provides first row");
            return modulesTabPage.clickOnProvidesFirstRow();
        }).then(function () {
            console.log("click on remove Provides button");
            return modulesTabPage.clickOnProvidesRemoveButton();
            //delete Parameters
        }).then(function () {
            console.log("click On Parameters first row");
            return modulesTabPage.clickOnParametersFirstRow();
        }).then(function () {
            console.log("click on remove Parameters button");
            return modulesTabPage.clickOnParametersRemoveButton();
            //delete Build Parameters
        }).then(function () {
            console.log("click On Build Parameters first row");
            return modulesTabPage.clickOnBuildParametersFirstRow();
        }).then(function () {
            console.log("click on remove Build Parameters button");
            return modulesTabPage.clickOnBuildParametersRemoveButton();
        }).then(function () {
            console.log("open code editor");
            return multiEditorPage.clickOnCodeEditorTab();
        }).then(function () {
            console.log("get text from code editor");
            return codeEditorPage.getText();
        }).then(function (sContent) {
            console.log("validate updates in the code editor");
            let oMTAYaml = YamlParser.safeLoad(sContent);
            assert.equal(oMTAYaml.modules[0].properties, undefined);
            assert.equal(oMTAYaml.modules[0].requires, undefined);
            assert.equal(oMTAYaml.modules[0].provides, undefined);
            assert.equal(oMTAYaml.modules[0].parameters, undefined);
            assert.equal(oMTAYaml.modules[0]["build-parameters"], undefined);
            return;
        }).thenCatch(function (oError) {
            console.log("Test ==>  'delete all from Ui' failed ");
            return utils.reportError(oError, that, driver);
        });
    });
});