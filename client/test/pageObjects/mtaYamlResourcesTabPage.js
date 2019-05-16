'use strict';
let	BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject"),
webdriver = require('selenium-webdriver');

class mtaYamlResourcesTabPage extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        this.mappings = {
            inputHelpDialog:{
                type: 'css',
                path: 'div[id="mtaYamlInputHelpDialog-dialog"]'
            },

            dropdownListItem : {
                type: 'xpath',
                path: '//div[contains(@id, "popover") and contains(@style, "visibility: visible")]//ul[contains(@role,"listbox")]//li[text() = "$1"]'
            },

            BasicInfoArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlResourcesBasicInfoPanel"] span'
            },

            TypeInputHelpButton: {
                type: 'css',
                path: 'span[id*="mtaYamlResourcesBasicInfoTypeInput"].sapUiIcon'
            },

            ParametersInputHelpButton: {
                type: 'css',
                path: 'span[id*="mtaYamlResourcesParametersKeyInput"].sapUiIcon'
            },

            BasicInfoTypeInput:{
                type: 'css',
                path: 'input[id*="mtaYamlResourcesBasicInfoTypeInput"]'
            },

            BasicInfoField: {
                type: 'css',
                path: '.sapMFocus input[id*="mtaYamlResourcesBasicInfoTypeInput"]'
            },

            BasicInfoDescriptionTextArea:{
                type: 'css',
                path: 'textarea[id*="mtaYamlResourcesBasicInfoDescriptionTextArea"]'
            },

            ResourcesAddButton: {
                type: 'css',
                path: 'button[id*="ResourcesAddResource"]'
            },

            ResourcesRemoveButton: {
                type: 'css',
                path: 'button[id*="ResourcesRemoveResource"]'
            },

            ResourcesListInputField:{
                type: 'css',
                path: 'input[id*="MtaResourcesList-1"]'
            },

            ParametersArrow: {
                type: 'css',
                path: 'div[id*="mtaYamlResourcesParametersPanel"] span'
            },

            ParametersAddButton: {
                type: 'css',
                path: 'button[id*="ResourcesAddParameters"]'
            },

            ParametersRemoveButton: {
                type: 'css',
                path: 'button[id*="ResourcesRemoveParameters"]'
            },
            ParametersKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlResourcesParametersKeyInput"]'
            },
            ParametersKeyInFocus: {
                type: 'css',
                path: '.sapMFocus input[id*="mtaYamlResourcesParametersKeyInput"]'
            },
            ParametersValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlResourcesParametersValueInput"]'
            },
            PropertiesArrow: {
                type: 'css',
                path: 'div[id*="mtaYamlResourcesPropertiesPanel"] span'
            },
            PropertiesAddButton: {
                type: 'css',
                path: 'button[id*="ResourcesAddProperties"]'
            },
            PropertiesRemoveButton: {
                type: 'css',
                path: 'button[id*="ResourcesRemoveProperties"]'
            },
            PropertiesKeyInput:{
                type: 'css',
                path: 'input[id*="MtaResourcesPropertiesKeyInput"]'
            },
            PropertiesValueInput:{
                type: 'css',
                path: 'input[id*="MtaResourcesPropertiesValueInput"]'
            },
            ParametersKeyInError: {
                type: 'css',
                path: '.sapUiTableRowSel .sapMInputBaseError input[id*="mtaYamlResourcesParametersKeyInput"]'
            },
            PropertiesKeyInError:{
                type: 'css',
                path: '.sapUiTableRowSel .sapMInputBaseError input[id*="MtaResourcesPropertiesKeyInput"]'
            }
        };
    }

    clickOnAddResourceButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ResourcesAddButton), this.configuration.defaultTimeout);
    }
    clickOnRemoveResourceButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ResourcesRemoveButton), this.configuration.defaultTimeout);
    }
    insertToResourcesInputFieldInList(sName){
        return this.driver.myWaitAndSendKeys(sName, this.toLocator(this.mappings.ResourcesListInputField), this.configuration.defaultTimeout);
    }

    //Basic info section
    clickOnBasicInfoArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.BasicInfoArrow), this.configuration.defaultTimeout);
    }

    basicInfoInFocus() {
        let that = this;
        let oBasicInfoUpdated = this.toLocator(this.mappings.BasicInfoField);
        return that.driver.myWait(oBasicInfoUpdated, that.configuration.defaultTimeout);
    }

    clickOnTypeInputHelpButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.TypeInputHelpButton), this.configuration.defaultTimeout);
    }

    insertToDescriptionField(sDescription) {
        let that = this;
        let oDescriptionLocator = this.toLocator(this.mappings.BasicInfoDescriptionTextArea);
        return that.driver.myWaitAndClick(oDescriptionLocator, that.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sDescription, oDescriptionLocator, that.configuration.defaultTimeout);
        });
    }

    //Parameters section
    clickOnParametersArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ParametersArrow), this.configuration.defaultTimeout);
    }
    clickOnParametersAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ParametersAddButton), this.configuration.defaultTimeout);
    }

    parametersKeyInFocus() {
        let that = this;
        let paramteresKeyLocator = this.toLocator(this.mappings.ParametersKeyInFocus);
        return this.driver.myWait(paramteresKeyLocator, this.configuration.defaultTimeout);
    }

    clickOnParametersRemoveButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ParametersRemoveButton), this.configuration.defaultTimeout);
    }
    clickOnParametersFirstRow(){
        let that = this;
        let oName = this.toLocator(this.mappings.ParametersKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oName, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndClick(oName, that.configuration.defaultTimeout);
        });
    }

    clickOnParametersInputHelpButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ParametersInputHelpButton), this.configuration.defaultTimeout);
    }

    insertToParametersValueField(sValue) {
        let that = this;
        let oParametersInputLocator = that.toLocator(this.mappings.ParametersValueInput);
        return this.driver.sleep(2000).then(function(){
            return that.driver.myWaitUntilElementIsVisible(oParametersInputLocator, that.configuration.defaultTimeout).then(function(){
                return that.driver.myWaitAndSendKeys(sValue, oParametersInputLocator , that.configuration.defaultTimeout);
            });
        });

    }

    //Properties section
    clickOnPropertiesArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.PropertiesArrow), this.configuration.defaultTimeout);
    }
    clickOnPropertiesAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.PropertiesAddButton), this.configuration.defaultTimeout);
    }

    clickOnPropertiesRemoveButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.PropertiesRemoveButton), this.configuration.defaultTimeout);
    }
    clickOnPropertiesFirstRow(){
        let that = this;
        let oKey = this.toLocator(this.mappings.PropertiesKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndClick(oKey, that.configuration.defaultTimeout);
        });
    }
    insertToPropertiesKeyField(sKey) {
        let that = this;
        let oKey = this.toLocator(this.mappings.PropertiesKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sKey, oKey, that.configuration.defaultTimeout).then(function(){
                console.log("Send keys with ENTER");
                return that.driver.myWaitAndSendKeys(webdriver.Key.ENTER, oKey, that.configuration.defaultTimeout);
            });

        });
    }
    insertToPropertiesValueField(sValue) {
        return this.driver.myWaitAndSendKeys(sValue, this.toLocator(this.mappings.PropertiesValueInput), this.configuration.defaultTimeout);
    }
    waitTillErrorDisapears(oMappings) {
        return this.driver.myWaitForElementToDisappear(this.toLocator(oMappings), this.configuration.defaultTimeout);
    }
    parametersKeySyncErrorGone(){
        return this.waitTillErrorDisapears(this.mappings.ParametersKeyInError);
    }

    propertiesKeySyncErrorGone(){
        return this.waitTillErrorDisapears(this.mappings.PropertiesKeyInError);
    }



}

module.exports = mtaYamlResourcesTabPage;
