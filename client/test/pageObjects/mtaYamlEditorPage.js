'use strict';
let BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject");

class mtaYamlEditorPage extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        this.mappings = {
            GeneralTab:{
                type: 'xpath',
                path: '//div[@class="sapMITBText"][text()="Basic Information"]'
            },
            ModulesTab:{
                type: 'xpath',
                path: '//div[@class="sapMITBText"][text() = "Modules"]'
            },
            ResourcesTab:{
                type: 'xpath',
                path: '//div[@class="sapMITBText"][text() = "Resources"]'
            },
        };
    }

    clickOnGeneralTab() {
        let that = this;
        let oGeneralTab = this.toLocator(this.mappings.GeneralTab);
        return this.driver.myWaitUntilElementIsVisible(oGeneralTab).then(function () {
            return that.driver.myWaitAndClick(oGeneralTab, that.configuration.defaultTimeout);
        });
    }

    clickOnResourcesTab() {
        let that = this;
        let oResourcesTab = this.toLocator(this.mappings.ResourcesTab);
        return this.driver.myWaitUntilElementIsVisible(oResourcesTab).then(function () {
            return that.driver.myWaitAndClick(oResourcesTab, that.configuration.defaultTimeout);
        });
    }

    clickOnModulesTab() {
        let that = this;
        let oModulesTab = this.toLocator(this.mappings.ModulesTab);
        return this.driver.myWaitUntilElementIsVisible(oModulesTab).then(function () {
            return that.driver.myWaitAndClick(oModulesTab, that.configuration.defaultTimeout);
        });
    }
}

module.exports = mtaYamlEditorPage;
