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
    YamlParser = require('../../../node_modules/webide/src/main/webapp/resources/sap/watt/toolsets/lib/yamlParser/js-yaml'),

	path = require('path');

describe('mtaYaml General Tab Test', function () {
	this.timeout(configuration.startupTimeout);
	let driver;
	let webIDE;
	let repositoryBrowser;
	let codeEditorPage;
	let generalTabPage;
	let multiEditorPage;
	let mtaEditorPage;
	let oZipOperations;
	let currentZipProjectName = "mtaYaml.zip";

	before(function () {
		driver = driverFactory.createDriver();
		driver.setFileDetector(new remote.FileDetector());
		driver.get(configuration.getParam(configuration.KEYS.HOST));
		multiEditorPage = new MultiEditorPage(driver, configuration);
		mtaEditorPage = new MtaEditorPage(driver, configuration);
		repositoryBrowser = new RepositoryBrowser(driver, configuration);
		generalTabPage = new GeneralTabPage(driver, configuration);
		codeEditorPage = new CodeEditorPage(driver, configuration);
		let hcpLoginPage = new HcpLoginPage(driver, configuration);
		let that = this;
		return hcpLoginPage.doWaitAndLoginOrGoToWebIDE(configuration.getParam(configuration.KEYS.USER_NAME), configuration.getParam(configuration.KEYS.PASSWORD)).then(function (oWebIDE) {
			webIDE = oWebIDE;
			return webIDE.clickDevelopmentPerspectiveAndGoToDevelopmentPerspectivePage(configuration.defaultTimeout);
		}).then(function () {
			oZipOperations = new ZipOperations(driver, configuration);
		}).thenCatch(function (oError) {
			return utils.reportError(oError, that, driver);
		});
	});

	after(function () {
		return utils.deleteProjectFromWorkspace(driver, "mtaYaml").thenFinally(function () {
			return driver.quit();
		});
	});

	it('Update general tab fields from Ui', function () {
		let that = this;
		return oZipOperations.importZip(path.resolve(__dirname, 'zip/' + currentZipProjectName), true).then(function () {
			console.log("open mta.yaml");
			return repositoryBrowser.openFile("mtaYaml/mta.yaml");
		}).then(function () {
			console.log("open MTA Editor Tab");
			return multiEditorPage.clickOnMTAEditorTab();
		}).then(function () {
			console.log("open General Tab");
			return mtaEditorPage.clickOnGeneralTab();
		}).then(function () {
			console.log("update id field ");
			return generalTabPage.insertToIdField("my-test");
		}).then(function () {
			console.log("update application version field ");
			return generalTabPage.insertToVersionField("3.0");
		}).then(function () {
			console.log("update description field ");
			return generalTabPage.insertToDescriptionField("my-test");
		}).then(function () {
			console.log("update provider field ");
			return generalTabPage.insertToProviderField("my-test");
		}).then(function () {
			console.log("update copy rightsfield ");
			return generalTabPage.insertToCopyRightsField("my-test");
		}).then(function () {
			console.log("update copy rightsfield ");
			return generalTabPage.clickOnGeneralPage();
		}).then(function () {
			console.log("open code editor");
			return multiEditorPage.clickOnCodeEditorTab();
		}).then(function () {
			console.log("get text from code editor");
			return codeEditorPage.getText();
		}).then(function (sContent) {
			console.log("validate updates in the code editor");
			let oMTAYaml = YamlParser.safeLoad(sContent);
			assert.equal(oMTAYaml.ID, "my-test");
			assert.equal(oMTAYaml.version, "3.0");
			assert.equal(oMTAYaml.description, "my-test");
			assert.equal(oMTAYaml.provider, "my-test");
			assert.equal(oMTAYaml.copyright, "my-test");
			return;
		}).thenCatch(function (oError) {
			return utils.reportError(oError, that, driver);
		});
	});

});
