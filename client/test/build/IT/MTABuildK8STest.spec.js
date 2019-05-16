'use strict';

let driverFactory = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/driverFactory'),
    webdriver = require('../../../node_modules/selenium-webdriver'),
    assert = require('chai').assert,
    remote = require('selenium-webdriver/remote'),
    utils = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/Utils'),
    configuration = require('./Configuration.js'),
    HcpLoginPage = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/LoginPage'),
    ZipOperations = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/ZipOperations'),
    RepositoryBrowser = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/RepositoryBrowserModule'),
    ConsolePage = require('../../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/ConsolePage'),
	path = require('path');

describe('Mta Build Test', function () {
	this.timeout(configuration.startupTimeout);
	let driver;
	let webIDE;
	let repositoryBrowser;
	let oZipOperations;
	let oConsolePage;

	let currentZipProjectName;
	let sProjectName;

	before(function () {
		driver = driverFactory.createDriver(this.test.parent.title);
		driver.setFileDetector(new remote.FileDetector());
		driver.get(configuration.getParam(configuration.KEYS.HOST));

		repositoryBrowser = new RepositoryBrowser(driver, configuration);
        oZipOperations = new ZipOperations(driver, configuration);
        oConsolePage = new ConsolePage(driver, configuration);
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

    //test build of mta project with simple ui5 module inside in wing environment
    it('Build MTA Project with simple ui5 module', function() {
        currentZipProjectName = "emptyMTA.zip";
        sProjectName = "emptyMTA";
        let that = this;
        console.log("Import MTA project folder");
        return oZipOperations.importZip(path.resolve(__dirname, 'zip/' + currentZipProjectName), true).then(function(){
            console.log("Check console exist");
            return oConsolePage.checkOpenConsole();
        }).then(function(bExist){
            if(!bExist){
                return oConsolePage.OpenConsole();
            }
        }).then(function(){
            console.log("Click Build command from project context menu");
            return repositoryBrowser.rightClickAndSelectContextMenuPath(sProjectName , ["Build","Build"]);
        }).then(function(){
            console.log("Check in console that build is completed");
            let sConsoleText = "adding: mta_archives/emptyMTA_0.0.1.mtar";
            return oConsolePage.searchForStringInConsole(sConsoleText);
        }).then(function(){
            console.log("Check mtar file " + sProjectName + "_0.0.1.mtar created");
            return checkMtarCreated(sProjectName);
        }).then(function(bHasFile){
            if (bHasFile){
                console.log("Finished Successfully\n");
            }else{
                console.log("Mtar file not found\n");
            }
            return assert.isTrue(bHasFile);
        }).thenCatch(function(oError) {
            return utils.reportError(oError, that, driver);
        });
    });

    let checkMtarCreated = function(sProjectName){
        //Use sleep as workaround becuase the build operation is async so we got here before the mta_archive folder is generated
        driver.sleep(4000);
        let sPath = sProjectName + "/mta_archives/" + sProjectName +"_0.0.1.mtar";
        return repositoryBrowser.expand(sPath).then(function(sNodeLocator){
            return driver.myWait(sNodeLocator).then(function(oFile){
                return oFile ? true: false
            });
        });
    };
});


