'use strict';
let	BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject");

class mtaYamlInputHelpDialogPage extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        this.mappings = {
            inputHelpDialog:{
                type: 'css',
                path: 'div[id="mtaYamlInputHelpDialog-dialog"]'
            },
            listItem: {
                type: 'xpath',
                path: '//div[contains(@id, "mtaYamlInputHelpDialogListItem")]//div[text()="$1"]'
            },

            searchInputField:{
                type: 'css',
                path: 'input[id^="mtaYamlInputHelpDialog-searchField"]'
            },
            searchButton:{
                type: 'css',
                path: 'div[id*="mtaYamlInputHelpDialog-searchField-search"]'
            }

        };
    }

    clickOnListItem(sItem){
        let oListItemLocator = this.toLocator(this.mappings.listItem, [sItem]);
        return this.driver.myWaitAndClick(oListItemLocator);
    }
    insertResourceNameInSearchField(sText) {
		return this.driver.myWaitAndSendKeys(sText, this.toLocator(this.mappings.searchInputField));
    }

    clickOnSearchButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.searchButton));

    }

}

module.exports = mtaYamlInputHelpDialogPage;
