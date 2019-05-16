'use strict';
let BasePageObject = require("../../node_modules/webide/src/main/webapp/test-resources/selenium/common/pageObjects/BasePageObject");
let webdriver = require('selenium-webdriver'),
    Utils = require('../../node_modules/webide/src/main/webapp/test-resources/selenium/common/utilities/Utils'),
    Q = require('q'),
    expect = require("chai").expect,
    _ = require('lodash');



class RepositoryBrowserModule extends BasePageObject {
    constructor(driver, configuration) {
        super(driver, configuration);

        _.assign(this.mappings,	{
            pageObjectLoadedSelector: {type: 'css', path: '.sapWattRepositoryBrowser .sapUiTreeList > .sapUiTreeNode'},
            node : {type:'xpath', path : '//span[@class="sapUiTreeNodeContent" and text()="$1"]'},
            rootNode: {type: 'css', path: '.sapWattRepositoryBrowser .sapUiTreeList > .sapUiTreeNode'},
            deleteConfirmationDialogOkButton: {type: 'xpath', path: '//div[contains(@class, "sapMMessageDialog")]//button/span[.//bdi[text()="Delete"]]'},
            projectInRepositoryBrowserNode : {type: 'xpath',path :'//ul[@class="sapUiTreeList"]/li[contains(@class ,"sapUiTreeNode")][contains(@title ,"Workspace")]/following-sibling::ul//li[contains(@title ,"$1")][@aria-level="2"]'},
            contextMenuRootElement : {type : 'xpath' , path : '//div[contains(@class ,"sapWattContextMenu")]/*/li[div/text()="$1"]'},
            CreateFileDialogfileInputField : {type:'id', path:'CreateFileDialog_InputFileName'},
            CreateFileDialogOKButton : {type:'id', path:'CreateFileDialog_CreateButton'},
            CreateFolderDialogfileInputField : {type:'id', path:'CreateFolderDialog_InputFolderName-inner'},
            CreateFolderDialogOKButton : {type:'xpath', path:'//button[contains(@class, "sapMBtn")]//bdi[text()="OK"]'},
            gitNodeWithBranch : {type:'xpath', path : '//span[@class="sapUiTreeNodeContent" and text()="$1"] /span[@class="rdeRepositoryBrowserSuffixRepo"]'},
            nodeSelected : {type:'css', path : 'li[class*="sapUiTreeNodeSelected"][title*="$1"]'},
            contextMenuSubItem : {type : 'xpath' , path : '//div[contains(@class ,"WattMainMenuSub")]/*/li[div/text()="$1"]'},
            overlayPopupHidden :  { type : 'css' , path : "div[id='sap-ui-blocklayer-popup'][style*='hidden']"},
            filesWithExtension : {type: 'xpath', path: '//li[contains(@title, ".$1")]'},
            renameButton : {type : 'xpath' , path :  '//button[contains(@id,"FileDialogUIRename") and descendant::text()="Rename"]'},
            collapseFolderButton: {type: 'css', path: 'button[title*="Collapse All Projects"]'},
            renameField : {type : 'xpath' , path : '//span[text()="Insert name"]/preceding-sibling::div/input'}
        });
    }

    _createNodeCssSelector(sContainingFolderCssSelector, sNodeTitle) {
        return sContainingFolderCssSelector + ' + .sapUiTreeChildrenNodes > ' +
            '.sapUiTreeNode[title="' + sNodeTitle + '"]';
    }

    _expand (aNodesTitles, sRootFolderCssSelector) {
        let sCurrentFolderLocator = this.toLocator({type: 'css', path: sRootFolderCssSelector});
        let that = this;
        return this.driver.myWaitAndClick(sCurrentFolderLocator).then(function() {
            return that.driver.sleep(500).then(function() {
                return that.driver.myWaitAndSendKeys(webdriver.Key.ARROW_RIGHT, sCurrentFolderLocator);
            });
        }).then(function() {
            //recursion stop condition
            if (aNodesTitles.length === 0) {
                return sCurrentFolderLocator;
            }
            let sNextFolderCssSelector = that._createNodeCssSelector(sRootFolderCssSelector, aNodesTitles[0]);
            aNodesTitles.shift();
            //FIXME - workaround for a bug where a folder is expanded without it's content
            //We need to find a condition that will replace sleep
            return that.driver.sleep(500).then(function() {
                return that._expand(aNodesTitles, sNextFolderCssSelector);
            });
        });
    }

    _goThroughContextMenuAndSelect(aTitles) {
        if(!aTitles.length) {
            return;
        }

        let rootItemTitle = aTitles[0];
        let rootItemTitleLocator = this.toLocator(this.mappings.contextMenuRootElement , [ rootItemTitle ]);

        let callbacks = [];

        let that = this;

        _.each(aTitles.splice(1).reverse() , function(sTitle){

            let oCallbackFn;

            if(callbacks.length) {
                oCallbackFn = callbacks[callbacks.length - 1];
            }

            let newCallback = function() {
                let item = that.toLocator(that.mappings.contextMenuSubItem , [ sTitle ]);
                if(oCallbackFn) {
                    return that.driver.myWaitAndClick(item, that.configuration.defaultTimeout).then(oCallbackFn);
                } else {
                    return that.driver.myWaitAndClick(item, that.configuration.defaultTimeout);
                }
            };

            callbacks.push(newCallback);

        });

        return callbacks.length ? this.driver.myWaitAndClick(rootItemTitleLocator,this.configuration.defaultTimeout).then(callbacks[callbacks.length - 1]) : this.driver.myWaitAndClick(rootItemTitleLocator,this.configuration.defaultTimeout);
    }
    _goThroughContextMenuAndCheck(aTitles) {
        if(!aTitles.length) {
            return;
        }

        let rootItemTitle = aTitles[0];
        let rootItemTitleLocator = this.toLocator(this.mappings.contextMenuRootElement , [ rootItemTitle ]);

        let callbacks = [];

        let that = this;

        _.each(aTitles.splice(1).reverse() , function(sTitle){

            let oCallbackFn;

            if(callbacks.length) {
                oCallbackFn = callbacks[callbacks.length - 1];
            }

            let newCallback = function() {
                let item = that.toLocator(that.mappings.contextMenuSubItem , [ sTitle ]);
                if(oCallbackFn) {
                    return that.driver.myWaitAndClick(item, 1000).then(oCallbackFn);
                } else {
                    return that.driver.myWait(item, that.configuration.defaultTimeout).then(function(){
                        return true;
                    }).thenCatch(function(){
                        return false;
                    });

                }
            };

            callbacks.push(newCallback);

        });
        if (callbacks.length==0) {
            return this.driver.myWait(rootItemTitleLocator, this.configuration.defaultTimeout).then(function(){
                return true;
            }).thenCatch(function (oError) {
                return false;
            });
        }
        else {
            return callbacks.length ? this.driver.myWaitAndClick(rootItemTitleLocator, 1000).then(callbacks[callbacks.length - 1]) : this.driver.myWaitAndClick(rootItemTitleLocator, 1000);
        }
    }
    expand(sPath) {
        console.log("expand " + sPath);
        let aNodesTitles = [];
        if (sPath){
            aNodesTitles = sPath.split('/');
        }
        return this._expand(aNodesTitles, this.mappings.rootNode.path);
    }


    openFile(sPath) {
        console.log("openFile " + sPath);
        let that = this;
        return this.expand(sPath).then(function (sFileLocator) {
            return that.driver.myWaitAndDoubleClick(sFileLocator);
        });
    }

    locateFile(sPath) {
        console.log("locateFile " + sPath);
        return this.expand(sPath);
    }

    openLocatedFile(sFileLocator) {
        console.log("openLocatedFile");
        return this.driver.myWaitAndDoubleClick(sFileLocator);
    }



    selectNode(sPath) {
        console.log("selectNode " + sPath);
        let that = this;
        return this.expand(sPath).then(function(sNodeLocator) {
            return that.driver.myWaitAndClick(sNodeLocator);
        });
    }

    rightClickAndSelectContextMenuPath(sPath, aContextMenuPath) {
        console.log("rightClickAndSelectContextMenuPath " + sPath + " " + aContextMenuPath);
        let that = this;
        return this.expand(sPath).then(function(sNodeLocator) {
            return that.driver.myWait(sNodeLocator);
        }).then(function(oElement){
            return that.driver.myRightClick(oElement);
        }).then(function(){
            that._goThroughContextMenuAndSelect(aContextMenuPath);
        });
    }

    runFromContextMenuPath(sPath, aContextMenuPath) {
        console.log("runFromContextMenuPath " + sPath + " " + aContextMenuPath);
        let that = this;
        // Remove popup flicker during running
        return this.driver.executeScript("window.localStorage.setItem('pageBlockAlertRaised', true);").then(function(){
            return that.expand(sPath);
        }).then(function(sNodeLocator){
            return that.driver.myWait(sNodeLocator);
        }).then(function(oElement){
            return that.driver.myRightClick(oElement);
        }).then(function(){
            that._goThroughContextMenuAndSelect(aContextMenuPath);
        });
    }

    rightClickGitProjectAndSelectContextMenuPath(sPathToProject, aContextMenuPath) {
        console.log("rightClickGitProjectAndSelectContextMenuPath " + sPathToProject + " " + aContextMenuPath);
        let that = this;
        return this.waitForGitNode(sPathToProject).then(function(oElement){
            return that.driver.myRightClick(oElement);
        }).then(function(){
            that._goThroughContextMenuAndSelect(aContextMenuPath);
        });
    }

    rightClickAndCheckContextMenuPath(sPath, aContextMenuPath,bExpectedToExist) {
        console.log("rightClickAndSelectContextMenuPath " + sPath + " " + aContextMenuPath);
        let that = this;
        return this.expand(sPath).then(function(sNodeLocator) {
            return that.driver.myWait(sNodeLocator);
        }).then(function(oElement){
            return that.driver.myRightClick(oElement);
        }).then(function(){
            return that._goThroughContextMenuAndCheck(aContextMenuPath).then(function(result){
                if (bExpectedToExist===result) {
                    return true;
                }
                else {
                    return false;
                }
            });
        });
    }

    deleteNode(sPath) {
        console.log("deleteNode " + sPath);
        let oNodeElement;
        let that = this;
        return this.expand(sPath).then(function(sNodeLocator) {
            oNodeElement = that.driver.findElement(sNodeLocator);
            return that.driver.myWaitAndSendKeys(webdriver.Key.DELETE, sNodeLocator);
        }).then(function() {
            let sDeleteConfirmationDialogOkButtonLocator = that.toLocator(that.mappings.deleteConfirmationDialogOkButton);
            return that.driver.myWaitAndClick(sDeleteConfirmationDialogOkButtonLocator);
        }).then(function() {
            return that.driver.wait(that.until.stalenessOf(oNodeElement), that.configuration.defaultTimeout);
        });
    }

    hasNode(sPath) {
        let pathLocator = this.toLocator(this.mappings.node, [sPath]);
        return this.driver.isElementPresent(pathLocator);
    }

    waitForNode(sPath){
        let folderLocator = this.toLocator(this.mappings.node, [sPath]);
        return this.driver.myWait(folderLocator, this.configuration.defaultTimeout);
    }

    waitForNodeSelected(sPath){
        let folderLocator = this.toLocator(this.mappings.nodeSelected, [sPath]);
        return this.driver.myWait(folderLocator, this.configuration.defaultTimeout);
    }

    waitForGitNode(sPath){
        let folderLocator = this.toLocator(this.mappings.gitNodeWithBranch, [sPath]);
        return this.driver.myWait(folderLocator, this.configuration.defaultTimeout);
    }

    fillFileNameInNewFileDialog(fileName){
        let input = this.toLocator(this.mappings.CreateFileDialogfileInputField);
        return this.driver.myWaitAndSendKeys(fileName,input, this.configuration.defaultTimeout);
    }

    clickOkInNewFileDialog(){
        let OKBtn = this.toLocator(this.mappings.CreateFileDialogOKButton);
        return this.driver.myWaitAndClick(OKBtn);
    }

    fillFolderNameInNewFolderDialog(folderName){
        let input = this.toLocator(this.mappings.CreateFolderDialogfileInputField);
        return this.driver.myWaitAndSendKeys(folderName, input, this.configuration.defaultTimeout);
    }

    clickOkInNewFolderDialog(){
        let OKBtn = this.toLocator(this.mappings.CreateFolderDialogOKButton);
        return this.driver.myWaitAndClick(OKBtn);
    }

    createFileInSelectedProject(sProjectFolder, name){
        let that = this;
        return this.rightClickAndSelectContextMenuPath(sProjectFolder, ["New","File"]).then(function(){
            return that.fillFileNameInNewFileDialog(name);
        }).then(function(){
            return that.clickOkInNewFileDialog();
        }).then(function(){
            return that.driver.myWait(that.toLocator(that.mappings.overlayPopupHidden),that.configuration.defaultTimeout);
        });
    }

    createFileInSelectedGitProject(sProjectFolder, name){
        let that = this;
        return this.rightClickGitProjectAndSelectContextMenuPath(sProjectFolder, ["New","File"]).then(function(){
            return that.fillFileNameInNewFileDialog(name);
        }).then(function(){
            return that.clickOkInNewFileDialog();
        }).then(function(){
            return that.driver.myWait(that.toLocator(that.mappings.overlayPopupHidden),that.configuration.defaultTimeout);
        });
    }





    selectProject(sProjectFolder){
        let that =this;
        var sLocator =  this._createNodeCssSelector(this.mappings.rootNode.path, sProjectFolder);
        var oLocator = Utils.toLocator({type: 'css', path: sLocator});
        return this.driver.myWaitAndRightClick(oLocator, that.configuration.defaultTimeout).then(function(){
            return that.driver.myWaitAndClick(oLocator);
        });
    }



    createFolder(sPath, name){
        let that = this;
        return this.rightClickAndSelectContextMenuPath(sPath, ["New","Folder"]).then(function(){
            return that.fillFolderNameInNewFolderDialog(name);
        }).then(function(){
            return that.clickOkInNewFolderDialog();
        }).then(function(){
            return that.driver.myWait(that.toLocator(that.mappings.overlayPopupHidden),that.configuration.defaultTimeout);
        });
    }

    deleteFileInSelectedProject(sPath){
        return this.deleteNode(sPath);
    }

    selectProjectInRepositoryBrowser(sProjectName) {
        let projectElement = this.toLocator(this.mappings.projectInRepositoryBrowserNode, [sProjectName]);
        return this.driver.myWaitAndClick(projectElement, this.configuration.defaultTimeout);
    }

    selectRepositoryTreeRoot() {
        let sRootNodeLocator = this.toLocator(this.mappings.rootNode);
        return this.driver.myWaitAndClick(sRootNodeLocator);
    }

    //check number of files with extension fileExt under folderPath , expecting expectedNumOfFiles number of files
    checkNumberOfFiles(sProjectName,folderPath,filesExt, expectedNumOfFiles){
        let that = this;
        console.log("selectNode" +folderPath +" folder");
        return this.selectNode(sProjectName + folderPath).then(function () {
            console.log("check number of files");
            var oLocator = Utils.toLocator(that.mappings.filesWithExtension,[filesExt]);
            return that.driver.findElements(oLocator, that.configuration.defaultTimeout).then(function (aElements) {
                console.log("Expected to have " + expectedNumOfFiles + " files . Actual number of files is : " + aElements.length);
                expect(aElements.length).to.equal(expectedNumOfFiles);
            });
        });
    }

    /**
     * @param sFilePath
     * @param sNewFileName
     * allows to rename a file in application, given the path to the file, and the new file name
     */
    renameFile(sFilePath, sNewFileName) {
        let that = this;

        return this.expand(sFilePath).then(function(sNodeLocator) {
            return that.driver.myWait(sNodeLocator);
        }).then(function(oElement){
            return that.driver.myRightClick(oElement);
        }).then(function(){
            that._goThroughContextMenuAndSelect(["Rename"]);
        }).then(function(){
            console.log("select old value with ctrl+a");
            return that.driver.myWaitAndSendKeys(webdriver.Key.chord(webdriver.Key.CONTROL, "a"), Utils.toLocator(that.mappings.renameField), that.configuration.defaultTimeout);
        }).then(function(){
            console.log("set new value");
            return that.driver.myWaitAndSendKeys(sNewFileName ,Utils.toLocator(that.mappings.renameField), that.configuration.defaultTimeout);
        }).then(function(){
            console.log("press rename button");
            return that.driver.myWaitAndClick(Utils.toLocator(that.mappings.renameButton), that.configuration.defaultTimeout);
        }).then(function(){
            console.log("Wait for the background to disappear");
            return that.driver.myWaitForElementToDisappear(Utils.toLocator(that.mappings.blockLayerPopupVisible), that.configuration.defaultTimeout);
        });
    }

    /**
     * Add neoapp.json file to the project, using the Cloud Connectivity command
     *
     * @param sProjectName
     */
    addNeoappFileToApplication(sProjectName) {
        console.log("add a neo-app.json file using the 'HTML5 Application Descriptor' command");
        return this.rightClickAndSelectContextMenuPath(sProjectName, ["New", "HTML5 Application Descriptor"]);
    }

    deleteProjectsByName(sProjectName) {
        var that =this;
        var projectsElement = Utils.toLocator(that.mappings.projectInRepositoryBrowserNode,[sProjectName]);
        var aPromises = [];
        return that.driver.findElements(projectsElement).then(function (aListPromises) {
            return Q.all(aListPromises).then(function(aListItems) {
                var chain = aListItems.reduce(function (previous, item){
                    return previous.then(function(previousValue) {
                        return that.deleteLastProject(projectsElement);
                    })
                }, Q.resolve(true));
                return chain.then(function(lastResult) {
                    //
                });
            });
        });
    }

    deleteLastProject(projectsElement) {
        var that =this;
        return that.driver.findElements(projectsElement).then(function (aListPromises) {
            return Q.all(aListPromises).then(function(aListItems) {
                return that.deleteOneProject(aListItems[aListItems.length - 1]);
            });
        });
    }


    deleteOneProject(item) {
        let that =this;
        return item.getAttribute("title").then(function(title) {
            console.log("delete project " + title);
            return that.deleteNode(title).then(function(){
                console.log("after delete project " + title);
            });
        });
    }

    clickCollapseAllProjects(){
        let collapseFolderBtn = this.toLocator(this.mappings.collapseFolderButton);
        return this.driver.myWaitAndClick(collapseFolderBtn);
    }
}

module.exports = RepositoryBrowserModule;

