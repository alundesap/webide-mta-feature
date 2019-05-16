/**
 *  This unit test check the below MTA build functionality:
 *  1. Check the task definition
 *  2. Check the flow of the mta build execution (on, succ and failure)
 *  3. Check the flow of adding the archive folder to gitIgnore
 */
define(["STF"
    ,"sap/watt/lib/lodash/lodash"
    ,"sap.watt.mta.build.wing.provider/service/MtaBuildTaskProvider"
], function (STF, _, mtaBuildTaskProvider) {
    "use strict";

    describe("*** TEST MTA BUILDER TASK PROVIDER FOR WING ***", function () {
        var sandbox;
        var oContext;
        var myI18n = this.i18n;

        before(function () {
        });

        afterEach(function () {
            sandbox.restore();
        });

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            oContext = getDefaultContext(mtaBuildTaskProvider);
            mtaBuildTaskProvider.context = oContext;
        });


        /*
            Check add project to gitIgnore functionality
         */
        describe("TEST FLOW OF addArchivefolderToGitignore ", function () {

            beforeEach(function () {
                //Set default value to non internal mode
                sandbox.stub(mtaBuildTaskProvider, "_isInternalMode").returns(false);
            });


            it("mtaBuildTaskProvider._addArchivefolderToGitignore - When git is not configure ", function () {
                var ogetGitMetadataByDocumentSpy = sandbox.spy(oContext.service.git, "getGitMetadataByDocument");
                var oIsEmptySpy = sandbox.spy(_, "isEmpty");
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                return mtaBuildTaskProvider._addArchivefolderToGitignore(mtaProjectDoc).then(function () {
                    expect(ogetGitMetadataByDocumentSpy.calledOnce).to.be.true;
                    expect(oIsEmptySpy.calledOnce).to.be.true;
                });
            });

            it("mtaBuildTaskProvider._addArchivefolderToGitignore - When git is configured and succ", function () {
                var ogetGitMetadataByDocumentSpy = sandbox.spy(oContext.service.git, "getGitMetadataByDocument");
                var oFileSystemDocumentSpy = sandbox.spy(oContext.service.filesystem.documentProvider, "getDocument");
                var oGitSetIgnore =  sandbox.spy(oContext.service.git, "setIgnore");
                var oIsEmptySpy = sandbox.spy(_, "isEmpty");
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                var dummyGitObj = { name: "git"};
                oContext.service.git.gitObj = dummyGitObj;
                var mtaArchivesDoc = {
                    getEntity: function () {
                        return Q();
                    }
                };
                //Add a dummy  mta archive doc to make the test pass
                oContext.service.filesystem.documentProvider.document = mtaArchivesDoc;
                return mtaBuildTaskProvider._addArchivefolderToGitignore(mtaProjectDoc).then(function () {
                    expect(ogetGitMetadataByDocumentSpy.calledOnce).to.be.true;
                    expect(oFileSystemDocumentSpy.calledOnce).to.be.true;
                    expect(oIsEmptySpy.calledTwice).to.be.true;
                    expect(oGitSetIgnore.calledOnce).to.be.true;
                });
            });

            /**
             * Set mtaArchive document to null to test it on error
             */
            it("mtaBuildTaskProvider._addArchivefolderToGitignore - When git is configured and failed", function () {
                var ogetGitMetadataByDocumentSpy = sandbox.spy(oContext.service.git, "getGitMetadataByDocument");
                var oFileSystemDocumentSpy = sandbox.spy(oContext.service.filesystem.documentProvider, "getDocument");
                var oLogWarnSpy = sandbox.spy(oContext.service.log, "warn");
                var oGitSetIgnore =  sandbox.spy(oContext.service.git, "setIgnore");
                var oIsEmptySpy = sandbox.spy(_, "isEmpty");
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                var dummyGitObj = { name: "git"};
                oContext.service.git.gitObj = dummyGitObj;
                oContext.service.filesystem.documentProvider.document = null;

                return mtaBuildTaskProvider._addArchivefolderToGitignore(mtaProjectDoc).then(function () {
                    expect(ogetGitMetadataByDocumentSpy.calledOnce).to.be.true;
                    expect(oFileSystemDocumentSpy.calledOnce).to.be.true;
                    expect(oIsEmptySpy.calledTwice).to.be.true;
                    expect(oLogWarnSpy.calledOnce).to.be.true;
                    expect(oGitSetIgnore.called).to.be.false;
                });
            });

            /**
             * Set mtaArchive document to null to test it on error
             */
            it("mtaBuildTaskProvider._addArchivefolderToGitignore - When MTA Archive folder Doc is null", function () {
                var ogetGitMetadataByDocumentSpy = sandbox.spy(oContext.service.git, "getGitMetadataByDocument");
                var oFileSystemDocumentSpy = sandbox.spy(oContext.service.filesystem.documentProvider, "getDocument");
                var oLogWarnSpy = sandbox.spy(oContext.service.log, "warn");
                var oGitSetIgnore =  sandbox.spy(oContext.service.git, "setIgnore");
                var oIsEmptySpy = sandbox.spy(_, "isEmpty");
                //pass null to document. and check that not function is called
                return mtaBuildTaskProvider._addArchivefolderToGitignore().then(function () {
                    expect(ogetGitMetadataByDocumentSpy.called).to.be.false;
                    expect(oFileSystemDocumentSpy.called).to.be.false;
                    expect(oIsEmptySpy.called).to.be.false;
                    expect(oLogWarnSpy.called).to.be.false;
                    expect(oGitSetIgnore.called).to.be.false;
                });
            });

        })


        /**
         * Check definition of task execution
         */
        describe("TEST DEFINITION OF BUILD TASK EXECUTION", function () {

            it("mtaBuildTaskProvider._getExecutionTask() none internal mode - Validate data", function () {
                checkExecutionTask(false);
            });

            it("mtaBuildTaskProvider._getExecutionTask() on internal mode - Validate data", function () {
                checkExecutionTask(true);
            });

            //Check the execution task metadata on internal mode and none internal mode
            function checkExecutionTask(isInternalMode) {
                var oDocument = _getDefaultMtaProjectDoc();
                //Simulate the internal mode to true
                sandbox.stub(mtaBuildTaskProvider, "_isInternalMode").returns(isInternalMode);
                var task = mtaBuildTaskProvider._getExecutionTask(oDocument);
                task.type ===  "shell"
                expect(task.type).equal("shell");
                expect(task.label).equal("Task for mta build");

                var expectedCommand = "webide_mta_build.sh";
                if (isInternalMode) {
                    expectedCommand = expectedCommand + " --internal-mode true";
                }
                expect(task.command).equal(expectedCommand);
                expect(task.options.cwd).equal("${current.project.path}");
                expect(task.webideOptions.copyBack.required).to.be.true;
                expect(task.webideOptions.copyBack.location).equal("mta_archives/mta_archives.zip");
                expect(task.webideOptions.copyBack.mapper).equal("default-mapper");
            }
        });


        describe("TEST BUILD EXECUTION FLOW", function () {
            beforeEach(function () {
                //Set default value to non internal mode
                sandbox.stub(mtaBuildTaskProvider, "_isInternalMode").returns(false);
            });

            it("mtaBuildTaskProvider.execute() - When Execute SUCC", function () {
                var oExecutorSpy = sandbox.spy(oContext.service.task, "execute");
                var oLogInfoSpy = sandbox.spy(oContext.service.log, "info");
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                return mtaBuildTaskProvider.executeBuild(mtaProjectDoc).then(function () {
                    expect(oLogInfoSpy.calledTwice).to.be.true;
                    expect(oExecutorSpy.calledOnce).to.be.true;
                });
            });

            it("mtaBuildTaskProvider.execute() - When Execute FAILED with error message", function () {
                var oArchiveGitIgnoreSpy = sandbox.spy(mtaBuildTaskProvider, "_addArchivefolderToGitignore");
                //Force the execute task to failed
                var errorSpy = sandbox.spy(oContext.service.log, "error");
                var error = new Error("Deploy failed ...");
                var oExecutorSpy = sandbox.stub(oContext.service.task, "execute").returns(Q.reject(error));
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                return mtaBuildTaskProvider.executeBuild(mtaProjectDoc).then(function () {
                    expect(oExecutorSpy.calledOnce).to.be.true;
                    expect(oArchiveGitIgnoreSpy.called).to.be.false;
                    expect(errorSpy.calledWith(error));
                });
            });

            it("mtaBuildTaskProvider.execute() - When Execute FAILED without error message", function () {
                var oArchiveGitIgnoreSpy = sandbox.spy(mtaBuildTaskProvider, "_addArchivefolderToGitignore");
                //Force the execute task to failed
                var errorSpy = sandbox.spy(oContext.service.log, "error");
                var error = new Error();
                var oExecutorSpy = sandbox.stub(oContext.service.task, "execute").returns(Q.reject(error));
                var mtaProjectDoc = _getDefaultMtaProjectDoc();
                return mtaBuildTaskProvider.executeBuild(mtaProjectDoc).then(function () {
                    expect(oExecutorSpy.calledOnce).to.be.true;
                    expect(oArchiveGitIgnoreSpy.called).to.be.false;
                    expect(errorSpy.calledWith(error));
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
        return mtaProjectDoc;
    }

    /**
     * Prepare default context for the test
     */
    function getDefaultContext(mtaBuildTaskProvider) {
        var oDocumentProvider = {
            document : null,
            getDocument: function () {
                return Q(this.document);
            }
        };

        var oFilesystem = {
            documentProvider: oDocumentProvider
        };

        return  {
            i18n: {
                getText: function (i18n, sKey, aArgs) {
                    return "";
                }
            },
            service: {
                log : {
                    info: function () {
                    },
                    warn: function () {
                    },
                    error: function () {
                    }
                },

                filesystem: oFilesystem,
                selection: {
                    getSelection: function () {
                        return Q();
                    }
                },
                task: {
                    execute: function() {
                        return Q();
                    }
                },
                mta: {
                    buildprovider: mtaBuildTaskProvider
                },
                document: {
                    getDocumentByPath: function() {
                        return Q();
                    }
                },
                git : {
                    gitObj: null,
                    getGitMetadataByDocument : function () {
                        return Q(this.gitObj);
                    },
                    setIgnore: function () {
                        return Q();
                    }
                }
            }
        };
    }



});

