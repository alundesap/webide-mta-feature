'use strict';
let	BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject");

class mtaYamlGeneralTabPage extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        this.mappings = {
            idInputField: {
                type: 'css',
                path: 'input[id*="mtaYamlGeneralTabIdField"]'
            },
            versionInputField: {
                type: 'css',
                path: 'input[id*="mtaYamlGeneralTabVersionField"]'
            },
            descriptionInputField: {
                type: 'css',
                path: 'input[id*="mtaYamlGeneralTabDescriptionField"]'
            },
            providerInputField: {
                type: 'css',
                path: 'input[id*="mtaYamlGeneralTabProviderField"]'
            },
            copyRightsInputField: {
                type: 'css',
                path: 'input[id*="mtaYamlGeneralTabCopyrightField"]'
            },
            generalPage:{
                type: 'css',
                path: 'div[id*="mtaYaml-settings"]'
            }
        };
    }

    clickOnGeneralPage(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.generalPage), this.configuration.defaultTimeout);
    }

    insertToIdField(sId) {
        return this.driver.myWaitClearAndSendKeys(sId, this.toLocator(this.mappings.idInputField), this.configuration.defaultTimeout);
    }

    insertToVersionField(sVersion) {
        return this.driver.myWaitClearAndSendKeys(sVersion, this.toLocator(this.mappings.versionInputField), this.configuration.defaultTimeout);
    }

    insertToDescriptionField(sDescription) {
        return this.driver.myWaitClearAndSendKeys(sDescription, this.toLocator(this.mappings.descriptionInputField), this.configuration.defaultTimeout);
    }

    insertToProviderField(sProvider) {
        return this.driver.myWaitClearAndSendKeys(sProvider, this.toLocator(this.mappings.providerInputField), this.configuration.defaultTimeout);
    }

    insertToCopyRightsField(sCopyRights) {
        return this.driver.myWaitClearAndSendKeys(sCopyRights, this.toLocator(this.mappings.copyRightsInputField), this.configuration.defaultTimeout);
    }

}

module.exports = mtaYamlGeneralTabPage;
