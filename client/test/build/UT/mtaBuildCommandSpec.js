/**
 *  This unit test check the below MTA build functionality:
 *  1. Check that the command is available
 *  2. Check the flow of the mta build execution (on, succ and failure)
 *  3. Check if the project is MTA
 *  4. Check selected document
 */
define(["STF"
  ,"sap/watt/lib/lodash/lodash"
  , "sap.watt.mta.build.wing.provider/command/MtaBuildCommand"
  , "sap.watt.mta.build.wing.provider/service/MtaBuildTaskProvider"
], function (STF, _, mtaBuildCommand, mtaBuildTaskProvider) {
    "use strict";
    describe("*** TEST MTA BUILD COMMAND FOR WING ***", function () {
        var sandbox;
        var oContext;

        before(function () {
            oContext = getDefaultContext(mtaBuildTaskProvider);
            mtaBuildTaskProvider.context = oContext;
            mtaBuildCommand.context = oContext;

        });

        afterEach(function () {
            sandbox.restore();
        });

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        describe("TEST BUILD AVAILABILITY", function () {

            it("mtaBuildCommand.isAvailable() true", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand.isAvailable().then(function (isAvailable) {
                    return expect(isAvailable).to.be.true;
                });
            });

            it("mtaBuildCommand.isAvailable() false - When type is not MTA", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                mtaProjectDoc.getProjectMetadata().type = "hdb";
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand.isAvailable().then(function (isAvailable) {
                    return expect(isAvailable).to.be.false;
                });
            });

            it("mtaBuildCommand.isAvailable() false - When Document is not a project ", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                mtaProjectDoc.entity.isProjectFlag = false;
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand.isAvailable().then(function (isAvailable) {
                    return expect(isAvailable).to.be.false;
                });
            });

            it("mtaBuildCommand.isAvailable() false - When Document is null ", function () {
                var mtaProjectDoc = null;
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand.isAvailable().then(function (isAvailable) {
                    return expect(isAvailable).to.be.false;
                });

            });

        });

        describe("TEST BUILD EXECUTION FLOW", function () {
            it("mtaBuildCommand.execute() - Validate execution call", function () {
                var oExecuteBuildSpy = sandbox.stub(oContext.service.mta.buildprovider, "executeBuild").returns(Q);
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand.execute().then(function () {
                    expect(oExecuteBuildSpy.calledOnce).to.be.true;
                });
            });
        });

        describe("TEST IF THE PROJECT IS MTA", function () {
            it("mtaBuildCommand._isMtaProject() - When Document is MTA project", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand._isMtaProject(mtaProjectDoc).then(function(isMtaProject) {
                    expect(isMtaProject).to.be.true;
                });
            });

            it("mtaBuildCommand._isMtaProject() - When Document is not a project", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                mtaProjectDoc.entity.isProjectFlag = false;
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand._isMtaProject(mtaProjectDoc).then(function(isMtaProject) {
                    expect(isMtaProject).to.be.false;
                });
            });

            it("mtaBuildCommand._isMtaProject() - When Document is not MTA project", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                //Rename the name to dummy to make ssure that this project is not mta project
                mtaProjectDoc.metaData.type = "dummyProject";
                sandbox.stub(mtaBuildCommand, "_getSelectedDocument").returns(Q(mtaProjectDoc));
                return mtaBuildCommand._isMtaProject(mtaProjectDoc).then(function(isMtaProject) {
                    expect(isMtaProject).to.be.false;
                });
            });
        });

        describe("TEST SELECT DOCUMENT", function () {
            it("mtaBuildCommand._getSelectedDocument() - When Selection is null ", function () {
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                return mtaBuildCommand._getSelectedDocument().then(function (oSelectedDoc) {
                    expect(oSelectedDoc).equals(undefined);
                });
            });

            it("mtaBuildCommand._getSelectedDocument() - When Selection take the first document ", function () {

                var documents = [
                    {document: {name : "doc1"}},
                    {document: {name : "doc2"}}
                ];
                oContext.service.selection.selectionDocs=documents;
                return mtaBuildCommand._getSelectedDocument().then(function (oSelectedDoc) {
                    expect(oSelectedDoc.name).equals("doc1");
                });
            });
        });

    });

    /**
     * Prepare default struct for mta project documentation
     */
     function _getDefaultMtaProjectDoc() {
         var projectEntity = {
             isProjectFlag : true,
             isProject: function () {
                 return this.isProjectFlag;
             },
             getFullPath: function () {
               return "/project";
             }
         };

         var projectMetaData = {
             type: "mta",
             name: "mta-proj"
         };

         var mtaProjectDoc = {
             entity: projectEntity,
             metaData: projectMetaData,
             getEntity: function () {
                 return this.entity
             },
             getProjectMetadata: function () {
                 return this.metaData
             }
         };
        var document = {
            entity: projectEntity,
            metaData: projectMetaData,
            getEntity: function () {
                return this.entity
            },
            getProjectMetadata: function () {
                return this.metaData
            },
            getProject: function () {
                return Q(mtaProjectDoc);
            }

        };
        return document;
    }

    /**
     * Prepare default context for the test
     */
    function getDefaultContext(mtaBuildTaskProvider) {
        return  {
            service: {
                selection: {
                    selectionDocs : null,
                    getSelection: function () {
                        return Q(this.selectionDocs);
                    }
                },
                task: {
                    execute: function() {
                        return Q();
                    }
                },
                mta: {
                    buildprovider: mtaBuildTaskProvider
                }
            }
        };
    }
});