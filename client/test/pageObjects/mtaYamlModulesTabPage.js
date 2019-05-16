'use strict';
let	BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject"),
    webdriver = require('selenium-webdriver');;

class mtaYamlModulesTabPage extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        this.mappings = {
            inputHelpDialog:{
                type: 'css',
                path: 'div[id="mtaYamlInputHelpDialog-dialog"]'
            },
            BasicInfoArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlPanelBasicInfo"] span'
            },

            BasicInfoDescriptionTextArea:{
                type: 'css',
                path: 'textarea[id*="mtaYamlModulesBasicInfoDescriptionTextArea"]'
            },

            PropertiesArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlPanelProperties"] span'
            },

            PropertiesRemoveButtonDisabled: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesPropertiesDeleteButton"][disabled="disabled"]'
            },
            PropertiesAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesPropertiesAddButton"]'
            },
            PropertiesRemoveButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesPropertiesDeleteButton"]'
            },
            PropertiesKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesPropertiesKeyInput"]'
            },
            PropertiesValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesPropertiesValueInput"]'
            },
            RequiresArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlPanelRequires"] span'
            },

            RequiresAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesRequiresAddButton"]'
            },
            RequiresRemoveButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesRequiresDeleteButton"]'
            },
            RequiresParamsTitle: {
                type: 'xpath',
                path: '//div[contains(@id ,"MtaRequiresTableParams")] //span[text()="$1"]'

            },
            RequiresParamsTable: {
                type: 'css',
                path: 'span[id*="MtaRequiresTableParams"]'
            },
            RequiresParamsTableHidden: {
                type: 'css',
                path: 'span[id*="MtaRequiresTableParams"][aria-hidden ="true"]'
            },
            RequiresParamsAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesRequiresParamAddButton"]'
            },
            RequiresPropsAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesRequiresPropAddButton"]'
            },

            RequiresNameInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesRequiresNameInput"]'
            },

            RequiresNameComboBoxButton:{
                type: 'css',
                path: 'td[id*="MtaRequiresTableKey-rows-row0-col0"] div[id*="mtaYamlModulesRequiresNameInput"][role="combobox"] div'
            },

            dropdownListItem : {
                type: 'xpath',
                path: '//div[contains(@id, "mtaYamlModulesRequiresNameInput") and contains(@style, "visibility: visible")]//ul[contains(@role,"listbox")]//li//span[text() = "test (resource)"]'
            },

            RequiresGroupInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesRequiresGroupInput"]'
            },

            RequiresParamsKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesRequiresParamKeyInput"]'
            },

            RequiresParamsValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesRequiresParamValueInput"]'
            },

            RequiresPropsKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesRequiresPropKeyInput"]'
            },

            RequiresPropsValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesRequiresPropValueInput"]'
            },

            ProvidesArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlPanelProvides"] span'
            },

            ProvidesAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesProvidesAddButoon"]'
            },

            ProvidesRemoveButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesProvidesDeleteButoon"]'
            },
            ProvidesPropsAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesProvidesPropAddButton"]'
            },

            ProvidesNameInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesProvidesNameInput"]'
            },

            ProvidesPropsKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesProvidesPropKeyInput"]'
            },

            ProvidesPropsValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesProvidesPropValueInput"]'
            },

            ParametersKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesParametersKeyInput"]'
            },

            ParameteresKeyInFocus:{
                type: 'css',
                path: '.sapMFocus input[id*="mtaYamlModulesParametersKeyInput"]'
            },

            ParametersInputHelpButton: {
                type: 'css',
                path: 'span[id*="mtaYamlModulesParametersKeyInput"].sapUiIcon'
            },

            ParametersArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlPanelParameters"] span'
            },

            ParametersAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesParametersAddButton"]'
            },

            ParametersRemoveButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesParametersDeleteButton"]'
            },

            ParametersKeyComboBoxButton:{
                type: 'css',
                path: 'span[id*="mtaYamlModulesParametersKeyInput"]'
            },

            ParametersValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesParametersValueInput"]'
            },

            BuildParametersArrow: {
                type: 'css',
                path: 'section[id*="mtaYamlPanelBuildParameters"] span'
            },

            BuildParametersAddButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesBuildParamAddButton"]'
            },
            BuildParametersRemoveButton: {
                type: 'css',
                path: 'button[id*="mtaYamlModulesBuildParamDeleteButton"]'
            },
            BuildParametersKeyInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesBuildParamKeyInput"]'
            },

            BuildParametersValueInput:{
                type: 'css',
                path: 'input[id*="mtaYamlModulesBuildParamValueInput"]'
            },
            ParametersKeyInError:{
                type: 'css',
                path: '.sapUiTableRowSel .sapMInputBaseError input[id*="mtaYamlModulesParametersKeyInput"]'
            }

        };
    }


    //Basic info section
       insertToDescriptionField(sDescription) {
        let that = this;
        let oDescription = this.toLocator(this.mappings.BasicInfoDescriptionTextArea);
        return this.driver.myWaitUntilElementIsVisible(oDescription, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sDescription, oDescription, that.configuration.defaultTimeout);
        });
    }

    //Properties section
    checkIfRemoveButtonDisabled(){
        return this.driver.myWait(this.toLocator(this.mappings.PropertiesRemoveButtonDisabled), this.configuration.defaultTimeout);
    }

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
        //return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
        return that.driver.myWaitAndSendKeys(sKey, oKey, that.configuration.defaultTimeout).then(function(){
            console.log("Send keys with ENTER");
            return that.driver.myWaitAndSendKeys(webdriver.Key.ENTER, oKey, that.configuration.defaultTimeout);
        });
        //});
    }
    insertToPropertiesValueField(sValue) {
        return this.driver.myWaitAndSendKeys(sValue, this.toLocator(this.mappings.PropertiesValueInput), this.configuration.defaultTimeout);
    }

    //Requires section
    waitForParamsTableToBeVisible(){
        return this.driver.myWait(this.toLocator(this.mappings.RequiresParamsTable), this.configuration.defaultTimeout);
    }
    isTableTitleWasUpdated(sTitle){
        return this.driver.myWait(this.toLocator(this.mappings.RequiresParamsTitle, [sTitle]), this.configuration.defaultTimeout);
    }
    checkIfParamsTableIsUnvisible(){
        return this.driver.myWait(this.toLocator(this.mappings.RequiresParamsTableHidden), this.configuration.defaultTimeout);
    }
    clickOnRequiresArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.RequiresArrow), this.configuration.defaultTimeout);
    }
    clickOnRequiresAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.RequiresAddButton), this.configuration.defaultTimeout);
    }
    clickOnRequiresRemoveButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.RequiresRemoveButton), this.configuration.defaultTimeout);
    }
    clickOnRequiresFirstRow(){
        let that = this;
        let oName = this.toLocator(this.mappings.RequiresGroupInput);
        return this.driver.myWaitUntilElementIsVisible(oName, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndClick(oName, that.configuration.defaultTimeout);
        });
    }
    clickOnRequiresParamsAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.RequiresParamsAddButton), this.configuration.defaultTimeout);
    }
    clickOnRequiresPropsAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.RequiresPropsAddButton), this.configuration.defaultTimeout);
    }

    insertToRequiresNameComboBox(sName){
        let oListItem = this.toLocator(this.mappings.RequiresNameComboBoxButton);
        let that = this;
        return this.driver.myWaitUntilElementIsVisible(oListItem).then(function () {
            return that.driver.myWaitAndClick(oListItem, that.configuration.defaultTimeout).then(function () {
                return that.chooseFromDropDownList(sName);
            });
        });
    }
    chooseFromDropDownList(sListItemTitle) {
        let that = this;
        let oListItem = that.toLocator(that.mappings.dropdownListItem, [sListItemTitle]);
        return that.driver.myWaitAndClick(oListItem, that.configuration.defaultTimeout).then(function () {
            return that.driver.myWaitForElementToDisappear(oListItem);
        });
    }

    insertToRequiresGroupInputField(sGroup) {
        return this.driver.myWaitAndSendKeys(sGroup, this.toLocator(this.mappings.RequiresGroupInput), this.configuration.defaultTimeout);
    }
    insertToRequiresParamsKeyField(sKey) {
        let that = this;
        let oKey = this.toLocator(this.mappings.RequiresParamsKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sKey, oKey, that.configuration.defaultTimeout).then(function(){
                console.log("Send keys with ENTER");
                return that.driver.myWaitAndSendKeys(webdriver.Key.ENTER, oKey, that.configuration.defaultTimeout);
            });
        });
    }
    insertToRequiresParamsValueField(sValue) {
        return this.driver.myWaitAndSendKeys(sValue, this.toLocator(this.mappings.RequiresParamsValueInput), this.configuration.defaultTimeout);
    }
    insertToRequiresPropsKeyField(sKey) {
        let that = this;
        let oKey = this.toLocator(this.mappings.RequiresPropsKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sKey, oKey, that.configuration.defaultTimeout).then(function(){
                console.log("Send keys with ENTER");
                return that.driver.myWaitAndSendKeys(webdriver.Key.ENTER, oKey, that.configuration.defaultTimeout);
            });
        });
    }
    insertToRequiresPropsValueField(sValue) {
        return this.driver.myWaitAndSendKeys(sValue, this.toLocator(this.mappings.RequiresPropsValueInput), this.configuration.defaultTimeout);
    }

    //Provides section
    clickOnProvidesArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ProvidesArrow), this.configuration.defaultTimeout);
    }
    clickOnProvidesAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ProvidesAddButton), this.configuration.defaultTimeout);
    }
    clickOnProvidesRemoveButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ProvidesRemoveButton), this.configuration.defaultTimeout);
    }
    clickOnProvidesFirstRow(){
        let that = this;
        let oName = this.toLocator(this.mappings.ProvidesNameInput);
        return this.driver.myWaitUntilElementIsVisible(oName, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndClick(oName, that.configuration.defaultTimeout);
        });
    }
    clickOnProvidesPropsAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ProvidesPropsAddButton), this.configuration.defaultTimeout);
    }
    insertToProvidesNameInputField(sName) {
        let that = this;
        let oName = this.toLocator(this.mappings.ProvidesNameInput);
        return this.driver.myWaitUntilElementIsVisible(oName, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sName, oName, that.configuration.defaultTimeout);
        });
    }

    insertToProvidesPropsKeyField(sKey) {
        let that = this;
        let oKey = this.toLocator(this.mappings.ProvidesPropsKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sKey, oKey, that.configuration.defaultTimeout).then(function(){
                console.log("Send keys with ENTER");
                return that.driver.myWaitAndSendKeys(webdriver.Key.ENTER, oKey, that.configuration.defaultTimeout);
            });
        });
    }
    insertToProvidesPropsValueField(sValue) {
        return this.driver.myWaitAndSendKeys(sValue, this.toLocator(this.mappings.ProvidesPropsValueInput), this.configuration.defaultTimeout);
    }

    //Parameters section
    clickOnParametersArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ParametersArrow), this.configuration.defaultTimeout);
    }
    clickOnParametersAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.ParametersAddButton), this.configuration.defaultTimeout);
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

    parametersInputInFocus() {
        let that = this;
        let oParameteresKeyUpdated = this.toLocator(this.mappings.ParameteresKeyInFocus);
        return that.driver.myWait(oParameteresKeyUpdated, that.configuration.defaultTimeout);
    }

    insertToParametersValueField(sValue) {
        let that = this;
        let oParamtersFieldLocator = that.toLocator(that.mappings.ParametersValueInput);
        return this.driver.sleep(2000).then(function(){
            return that.driver.myWaitUntilElementIsVisible(oParamtersFieldLocator, that.configuration.defaultTimeout).then(function() {
                return that.driver.myWaitAndSendKeys(sValue, oParamtersFieldLocator, that.configuration.defaultTimeout);
            });
        });

    }

    //Build Parameters section
    clickOnBuildParametersArrow(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.BuildParametersArrow), this.configuration.defaultTimeout);
    }
    clickOnBuildParametersAddButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.BuildParametersAddButton), this.configuration.defaultTimeout);
    }
    clickOnBuildParametersRemoveButton(){
        return this.driver.myWaitAndClick(this.toLocator(this.mappings.BuildParametersRemoveButton), this.configuration.defaultTimeout);
    }
    clickOnBuildParametersFirstRow(){
        let that = this;
        let oName = this.toLocator(this.mappings.BuildParametersKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oName, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndClick(oName, that.configuration.defaultTimeout);
        });
    }
    insertToBuildParametersKeyField(sKey) {
        let that = this;
        let oKey = this.toLocator(this.mappings.BuildParametersKeyInput);
        return this.driver.myWaitUntilElementIsVisible(oKey, this.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndSendKeys(sKey, oKey, that.configuration.defaultTimeout).then(function(){
                console.log("Send keys with ENTER");
                return that.driver.myWaitAndSendKeys(webdriver.Key.ENTER, oKey, that.configuration.defaultTimeout);
            });
        });
    }
    insertToBuildParametersValueField(sValue) {
        return this.driver.myWaitAndSendKeys(sValue, this.toLocator(this.mappings.BuildParametersValueInput), this.configuration.defaultTimeout);
    }

    parametersKeySyncErrorGone(){
        var oMappings = this.mappings.ParametersKeyInError;
        return this.driver.myWaitForElementToDisappear(this.toLocator(oMappings), this.configuration.defaultTimeout);
    }

}

module.exports = mtaYamlModulesTabPage;
