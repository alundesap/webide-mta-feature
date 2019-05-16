'use strict';

let driverFactory = require('../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/driverFactory'),

    assert = require('chai').assert,
    remote = require('selenium-webdriver/remote'),
    utils = require('../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/Utils'),
    configuration = require('./Configuration.js'),
    HcpLoginPage = require('../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/LoginPage'),
    ZipOperations = require('../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/ZipOperations'),
    MTARepositoryBrowser = require('../pageObjects/mtaRepositoryBrowser'),
	path = require('path');

describe('Mta Build Test', function () {
	this.timeout(configuration.startupTimeout);
	let driver;
	let webIDE;
    let mtaRepositoryBrowser;
	let oZipOperations;

	let currentZipProjectName;
	let sProjectName;

	before(function () {
		driver = driverFactory.createDriver(this.test.parent.title);
		driver.setFileDetector(new remote.FileDetector());
		driver.get(configuration.getParam(configuration.KEYS.HOST));

		mtaRepositoryBrowser = new MTARepositoryBrowser(driver, configuration);
        oZipOperations = new ZipOperations(driver, configuration);
		let hcpLoginPage = new HcpLoginPage(driver, configuration);
		let that = this;

        return hcpLoginPage.doWaitAndLoginOrGoToWebIDE(configuration.getParam(configuration.KEYS.USER_NAME), configuration.getParam(configuration.KEYS.PASSWORD)).then(function (oWebIDE) {
			webIDE = oWebIDE;
            console.log("Open Development perspective");
            return webIDE.clickDevelopmentPerspectiveAndGoToDevelopmentPerspectivePage(configuration.defaultTimeout);
		}).thenCatch(function (oError) {
			return utils.reportError(oError, that, driver);
		});
	});

	after(function () {
        return utils.deleteProjectFromWorkspace(driver, sProjectName).then(function(){
            return driver.quit();
        });

	});

    //test that mta feature is deployed in the account on which selenium runs.
    //do this by checking build menu and OpenMtaEditor Menu
    it('Check MTA related menus', function() {
        currentZipProjectName = "mtaProject.zip";
        sProjectName = "mtaProject";
        let that = this;
        console.log("Import MTA project folder");
        return oZipOperations.importZip(path.resolve(__dirname, 'zip/' + currentZipProjectName), true).then(function(){
            console.log("Check Build context menu exists");
            return mtaRepositoryBrowser.rightClickAndCheckContextMenuPath(sProjectName , ["Build", "Build"], true);
        }).then(function(bResult){
            if (bResult){
                console.log("Build ContextMenu exits\n");
            }else{
                console.log("Build ContextMenu doesnt exit\n");
            }
            return assert.isTrue(bResult);
        }).then(function(){
            console.log("Check MTA Editor context menu exists");
            return mtaRepositoryBrowser.rightClickAndCheckContextMenuPath(sProjectName + "/mta.yaml" , ["Open MTA Editor"], true);
        }).then(function(bResult){
            if (bResult){
                console.log("MTA Editor ContextMenu exits\n");
            }else{
                console.log("MTA Editor ContextMenu doesnt exit\n");
            }
            return assert.isTrue(bResult);
        }).thenCatch(function(oError) {
            return utils.reportError(oError, that, driver);
        });
    });


});


