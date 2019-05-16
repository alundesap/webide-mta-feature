'use strict';
let	BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject");

class mtaYamlMultiEditorPage extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        this.mappings = {
            codeEditorTab: {
                type: 'xpath',
                path: '//div[@class="sapUiTabBar"]//li[text() = "Code Editor"]'
            },
            mtaEditorTab: {
                type: 'xpath',
                path: '//div[@class="sapUiTabBar"]//li[text() = "MTA Editor"]'
            },

        };
    }

    clickOnCodeEditorTab() {
        let that = this;
        let oCodeEditorTab = this.toLocator(this.mappings.codeEditorTab);
        return this.driver.myWaitUntilElementIsVisible(oCodeEditorTab).then(function () {
            return that.driver.myWaitAndClick(oCodeEditorTab, that.configuration.defaultTimeout);
        });
    }

    clickOnMTAEditorTab() {
        let that = this;
        let oMTAEditorTab = this.toLocator(this.mappings.mtaEditorTab);
        return this.driver.myWaitUntilElementIsVisible(oMTAEditorTab).then(function () {
            return that.driver.myWaitAndClick(oMTAEditorTab, that.configuration.defaultTimeout);
        });
    }



}

module.exports = mtaYamlMultiEditorPage;
