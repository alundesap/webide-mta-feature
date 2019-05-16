define(["STF"], function (STF) {
    "use strict";

    describe("Mta Editor service test", function () {
        var suiteName = "MtaEditor_service_tests";
        var oFakeFileDAOService;
        var sandbox;
        var oProjectTestData;
        var oMtaYamlEditorService;
        var oDocumentService;
        var oMtaYamlEditorContent;
        var oDocument;

        before(function () {
            return STF.startWebIde(suiteName).then(function () {
                oFakeFileDAOService = STF.getService(suiteName, "fakeFileDAO");
                oMtaYamlEditorService = STF.getService(suiteName, "mtayamleditor");
                oDocumentService = STF.getService(suiteName, "document");
                sandbox = sinon.createSandbox();
                return oMtaYamlEditorService.getContent().then(function (_oMtaYamlEditorContent) {
                    oMtaYamlEditorContent = _oMtaYamlEditorContent;
                    return STF.require(suiteName, [
                        "/base/test/editor/UT/testData/testData.js"
                    ]);
                }).spread(function (_oProjectTestData) {
                    oProjectTestData = _oProjectTestData;
                    return oFakeFileDAOService.setContent(oProjectTestData);
                }).then(function () {
                    return oDocumentService.getDocumentByPath("/testProj/mta.yaml");
                }).then(function (oDoc) {
                    oDocument = oDoc;
                });
            });
        });

        after(function () {
            STF.shutdownWebIde(suiteName);
        });

        afterEach(function () {
            sandbox.restore();
        });

        describe("MtaYaml Service ", function () {
            it("Document should open with no errors", function () {
                var oExpectedModel = {
                    "_schema-version": "2.0.0",
                    "ID": "OPENSAP_HANA5_EXAMPLE",
                    "version": "1.12.1",
                    "modules": [{
                        "name": "openSAP5-ex-web",
                        "description": "",
                        "properties": {
                            "plugin_name": "${name}"
                        },
                        "build-parameters": {
                            "builder": "grunt"
                        },
                        "provides": [{
                            "name": "web",
                            "properties": {
                                "ui-url": "${default-url}"
                            }
                        }],
                        "requires": [{
                            "name": "openSAP5-ex-uaa",
                            "properties": {
                                "ui-url": "${default-url}"
                            },
                            "parameters": {
                                "ui-url": "${default-url}"
                            },
                            "group": ""
                        }],
                        "parameters": {
                            "host": "web"
                        }
                    }],
                    "resources": [{
                        "name": "plugins",
                        "type": "configuration",
                        "parameters": {
                            "filter": {
                                "type": "com.acme.plugin"
                            }
                        },
                        "properties": {
                            "plugin_name": "${name}",
                            "plugin_url": "${url}/sources"
                        }
                    }]
                };
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oModel = oMtaYamlEditorContent.getController()._aTabViews[2].getModel().getData();
                    expect(oModel).to.deep.equal(oExpectedModel);
                });
            });

            it("Should always be available", function () {
                return oMtaYamlEditorService.isAvailable().then(function (available) {
                    expect(available).to.be.true;
                });
            });

            it("Updates the document when flushing", function () {
                var oMtaYamlEditorServicePrivateImplPromise = STF.getServicePrivateImpl(oMtaYamlEditorService);
                return oMtaYamlEditorServicePrivateImplPromise.then(function (oMtaYamlEditorServicePrivateImpl) {
                    sandbox.stub(oMtaYamlEditorServicePrivateImpl._oDocument, "isDirty").callsFake(function () {
                        return true;
                    });
                    var updateDocumentSpy = sandbox.spy(oMtaYamlEditorServicePrivateImpl, "updateDocument");

                    return oMtaYamlEditorService.flush().then(function () {
                        expect(updateDocumentSpy.calledOnce).to.be.true;
                    });
                });
            });

            it("Does not update the document when no content to flush", function () {
                var oMtaYamlEditorServicePrivateImplPromise = STF.getServicePrivateImpl(oMtaYamlEditorService);
                return oMtaYamlEditorServicePrivateImplPromise.then(function (oMtaYamlEditorServicePrivateImpl) {
                    sandbox.stub(oMtaYamlEditorServicePrivateImpl._oDocument, "isDirty").callsFake(function () {
                        return false;
                    });
                    var updateDocumentSpy = sandbox.spy(oMtaYamlEditorServicePrivateImpl, "updateDocument");

                    return oMtaYamlEditorService.flush().then(function () {
                        expect(updateDocumentSpy.called).to.be.false;
                    });
                });
            });

            it("Gets the existing content, when it exists", function () {
                var FAKE_CONTENT = "FAKE CONTENT";

                var oMtaYamlEditorServicePrivateImplPromise = STF.getServicePrivateImpl(oMtaYamlEditorService);
                return oMtaYamlEditorServicePrivateImplPromise.then(function (oMtaYamlEditorServicePrivateImpl) {
                    var oMtaYamlEditorView = oMtaYamlEditorServicePrivateImpl._oMtaYamlEditorView; // Save original value
                    oMtaYamlEditorServicePrivateImpl._oMtaYamlEditorView = FAKE_CONTENT;

                    return oMtaYamlEditorService.getContent().then(function (content) {
                        expect(content).to.equal(FAKE_CONTENT);
                        oMtaYamlEditorServicePrivateImpl._oMtaYamlEditorView = oMtaYamlEditorView; // Restore original value
                    });

                });
            });
        });

        describe("General Tab", function () {
            var oGeneralTabController;

            before(function () {
                oGeneralTabController = oMtaYamlEditorContent.getController()._aTabViews[2].getController();
            });

            it("Should Convert MtaYaml To UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oMtaYamlData = oGeneralTabController._oMtaYamlData;
                    var oModel = oGeneralTabController.convertMtaYamlToUIModel(_.cloneDeep(oMtaYamlData));
                    var expectedModel = oGeneralTabController._oModel.getData();
                    expect(oModel).to.deep.equal(expectedModel);
                });
            });

            it("Should Convert UI Model To MtaYaml", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oUIModelData = oGeneralTabController._oModel.getData();
                    var oYamlData = oGeneralTabController.convertUIModelToMtaYaml(oUIModelData);
                    var expectedData = oGeneralTabController._oMtaYamlData;
                    expect(oYamlData).to.deep.equal(expectedData);
                });
            });

            it("idValueValidation sets value state", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var setValueStateFake = sandbox.stub(oGeneralTabController, "setValueState").callsFake(function () {
                    });
                    var oModel = oGeneralTabController.idValueValidation({
                        getParameter: function getParameter() {
                            return "getParameter";
                        },
                        getSource: function getSource() {
                            return "getSource";
                        }
                    });
                    expect(setValueStateFake.calledOnce).to.be.true;
                });
            });
        });

        describe("Modules Tab", function () {
            var oModulesTabController;

            before(function () {
                oModulesTabController = oMtaYamlEditorContent.getController()._aTabViews[0].getController();
            });

            it("Should Convert MtaYaml To UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oMtaYamlData = oModulesTabController._oMtaYamlData;
                    var aModules = oModulesTabController.convertMtaYamlToUIModel(_.cloneDeep(oMtaYamlData));
                    var expectedModel = oModulesTabController._oModel.getData();
                    expect(aModules).to.deep.equal(expectedModel);
                });
            });

            it("Should return an empty array when converting an empty MTA YAML To a UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {

                    const EMPTY_RESULTS = {
                        modules: []
                    };
                    // No MTA YAML data
                    var uiModel = oModulesTabController.convertMtaYamlToUIModel(undefined);
                    expect(uiModel).to.deep.equal(EMPTY_RESULTS);

                    // No modules
                    var uiModel = oModulesTabController.convertMtaYamlToUIModel({});
                    expect(uiModel).to.deep.equal(EMPTY_RESULTS);
                });
            });

            it("Should convert module properties to a UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {

                    const PROPERTIES = "PROPERTIES";
                    sandbox.stub(oModulesTabController, "_convertMapToArray").callsFake(function () {
                        return PROPERTIES;
                    });
                    var uiModel = oModulesTabController.convertMtaYamlToUIModel({
                        modules: [
                            {
                                properties: PROPERTIES
                            }
                        ]
                    });
                    expect(uiModel.modules[0].properties).to.equal(PROPERTIES);
                });
            });

            it("Should convert module build-parameters to a UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {

                    const BUILD_PARAMETERS = "build-parameters";
                    sandbox.stub(oModulesTabController, "_convertMapToArray").callsFake(function () {
                        return BUILD_PARAMETERS;
                    });
                    var uiModel = oModulesTabController.convertMtaYamlToUIModel({
                        modules: [
                            {
                                "build-parameters": BUILD_PARAMETERS
                            }
                        ]
                    });
                    expect(uiModel.modules[0]["build-parameters"]).to.equal(BUILD_PARAMETERS);
                });
            });

            it("Should convert module requires' properties to a UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {

                    const REQUIRED_PROPERTIES = "REQUIRED_PROPERTIES";
                    sandbox.stub(oModulesTabController, "_convertMapToArray").callsFake(function () {
                        return REQUIRED_PROPERTIES;
                    });
                    var uiModel = oModulesTabController.convertMtaYamlToUIModel({
                        modules: [
                            {
                                requires: [
                                    {
                                        properties: "ORIGINAL PROPERTY"
                                    }
                                ]
                            }
                        ]
                    });
                    expect(uiModel.modules[0].requires[0].properties).to.equal(REQUIRED_PROPERTIES);
                });
            });

            it("Should convert module requires' parameters to a UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {

                    const REQUIRED_PARAMETERS = "REQUIRED_PARAMETERS";
                    sandbox.stub(oModulesTabController, "_convertMapToArray").callsFake(function () {
                        return REQUIRED_PARAMETERS;
                    });
                    var uiModel = oModulesTabController.convertMtaYamlToUIModel({
                        modules: [
                            {
                                requires: [
                                    {
                                        parameters: "ORIGINAL PARAMETER"
                                    }
                                ]
                            }
                        ]
                    });
                    expect(uiModel.modules[0].requires[0].parameters).to.equal(REQUIRED_PARAMETERS);
                });
            });

            it("Should Convert UI Model To MtaYaml", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oUIModelData = oModulesTabController._oModel.getData();
                    var aModulesData = oModulesTabController.convertUIModelToMtaYaml(oUIModelData);
                    var expectedData = oModulesTabController._oMtaYamlData.modules;
                    expect(aModulesData.modules).to.deep.equal(expectedData);
                });
            });

            it("Should update mtaYaml /modules/0/requires/0/name field according to model change", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oModulesTabController.getView().getModel().setProperty("/modules/0/requires/0/name", "testRequires");
                    var expectedUpdatedData = oModulesTabController._oMtaYamlData.modules[0].requires[0].name;
                    expect(expectedUpdatedData).to.be.equal("testRequires");
                });
            });

            it("Should update mtaYaml /modules/0/provides/0/name field according to model change", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oModulesTabController.getView().getModel().setProperty("/modules/0/provides/0/name", "testProvides");
                    var expectedUpdatedData = oModulesTabController._oMtaYamlData.modules[0].provides[0].name;
                    expect(expectedUpdatedData).to.be.equal("testProvides");
                });
            });

            it("Should update mtaYaml modules field according to model change", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oModulesTabController.getView().getModel().setProperty("/modules", "test");
                    var expectedUpdatedData = oModulesTabController._oMtaYamlData.modules;
                    expect(expectedUpdatedData).to.be.equal("test");
                });
            });

            it("Should filter current module from requires list", function () {
                var aCrossValidationTest = [{
                    key: "test1",
                    type: "resource"
                }, {
                    key: "test2",
                    type: "module"
                }, {
                    key: "test3",
                    type: "module"
                }];
                var aModulesTest = [{
                    name: "test3",
                    type: "module"
                }, {
                    name: "test2",
                    type: "resource"
                }];
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oModulesTabController.getView().getModel().setProperty("/modules", aModulesTest);
                    oModulesTabController.getView().getModel("ItemsModel").setProperty("/aCrossValidation", aCrossValidationTest);
                    oModulesTabController.filterRequiresComboBoxItems();
                    var aRequiresResult = oModulesTabController.getView().getModel("ItemsModel").getProperty("/aRequires");
                    expect(aRequiresResult).to.have.lengthOf(aCrossValidationTest.length - 1);
                });
            });

            it("Should create and filter current module from requires list", function () {
                var aCrossValidationTest = [{
                    key: "test1",
                    type: "resource"
                }, {
                    key: "test2",
                    type: "module"
                }, {
                    key: "test3",
                    type: "module"
                }];
                var aModulesTest = [{
                    name: "test3",
                    type: "module"
                }, {
                    name: "test2",
                    type: "resource"
                }];
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oModulesTabController.getView().getModel().setProperty("/resources/0/name", "newResource1");
                    oModulesTabController.getView().getModel().setProperty("/resources/1/name", "newResource2");
                    oModulesTabController.getView().getModel().setProperty("/resources/0/modules", "newModule1");
                    oModulesTabController.getView().getModel().setProperty("/resources/1/modules", "newModule2");
                    oModulesTabController.getView().getModel().setProperty("/resources/0/provides", "newProvides1");
                    oModulesTabController.getView().getModel().setProperty("/resources/1/provides", "newProvides2");
                    oModulesTabController.requireListRegenerator();
                    var aRequiresResult = oModulesTabController.getView().getModel("ItemsModel").getProperty("/aRequires");
                    expect(aRequiresResult).to.have.lengthOf(aCrossValidationTest.length - 1);
                });
            });

            it("getModuleIcon by type", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var sIcon = oModulesTabController.getModuleIcon("java");
                    expect(sIcon).to.deep.equal("sap-icon://watt/tmpl-java-application");
                    sIcon = oModulesTabController.getModuleIcon("dwf");
                    expect(sIcon).to.deep.equal("sap-icon://watt/tmpl-dwf");
                    sIcon = oModulesTabController.getModuleIcon("hdb");
                    expect(sIcon).to.deep.equal("sap-icon://database");
                    sIcon = oModulesTabController.getModuleIcon("html5");
                    expect(sIcon).to.deep.equal("sap-icon://sap-ui5");
                    sIcon = oModulesTabController.getModuleIcon("nodejs");
                    expect(sIcon).to.deep.equal("sap-icon://watt/tmpl-nodejs-application");
                    sIcon = oModulesTabController.getModuleIcon("cds");
                    expect(sIcon).to.deep.equal("sap-icon://watt/cds-icon");
                    sIcon = oModulesTabController.getModuleIcon("cfportalsite");
                    expect(sIcon).to.deep.equal("sap-icon://watt/tmpl-flp");
                });
            });
        });

        describe("Resources Tab", function () {
            var oResourcesTabController;

            before(function () {
                oResourcesTabController = oMtaYamlEditorContent.getController()._aTabViews[1].getController();
            });

            it("Should Convert MtaYaml To UI Model", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oMtaYamlData = oResourcesTabController._oMtaYamlData;
                    var aResources = oResourcesTabController.convertMtaYamlToUIModel(_.cloneDeep(oMtaYamlData));
                    var expectedModel = oResourcesTabController._oModel.getData();
                    expect(aResources).to.deep.equal(expectedModel);
                });
            });

            it("Should Convert UI Model To MtaYaml", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var oUIModelData = oResourcesTabController._oModel.getData();
                    var aModulesData = oResourcesTabController.convertUIModelToMtaYaml(oUIModelData);
                    var expectedData = oResourcesTabController._oMtaYamlData.resources;
                    expect(aModulesData.resources).to.deep.equal(expectedData);
                });
            });

            it("Should update mtaYaml /resources/0/name field according to model change", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oResourcesTabController.getView().getModel().setProperty("/resources/0/name", "newResource");
                    var expectedUpdatedData = oResourcesTabController._oMtaYamlData.resources[0].name;
                    expect(expectedUpdatedData).to.be.equal("newResource");
                });
            });

            it("Should update mtaYaml /resources/0/properties field according to model change", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    oResourcesTabController.getView().getModel().setProperty("/resources/0/properties/0/displayedValue", "test");
                    var expectedUpdatedData = oResourcesTabController._oMtaYamlData.resources[0].properties.plugin_name;
                    expect(expectedUpdatedData).to.be.equal("test");
                });
            });

            it("onPressAddResources should add new resource item", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var currentUpdatedData = oResourcesTabController._oMtaYamlData.resources.length;
                    oResourcesTabController.onPressAddResources(null);
                    var expectedUpdatedData = oResourcesTabController._oMtaYamlData.resources.length;
                    expect(expectedUpdatedData).to.be.equal(currentUpdatedData+1);

                });
            });
            
            it("onPressRemoveResources should remove resource item when resources list is not empty", function () {
                return oMtaYamlEditorService.open(oDocument).then(function () {
                    var currentUpdatedData = oResourcesTabController._oMtaYamlData.resources.length;
                    oResourcesTabController.onPressRemoveResources(null);
                    var expectedUpdatedData = oResourcesTabController._oMtaYamlData.resources.length;
                    expect(expectedUpdatedData).to.be.equal(currentUpdatedData-1);

                });
            });
        });

    });
});