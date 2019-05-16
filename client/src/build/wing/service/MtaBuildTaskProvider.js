define(["sap/watt/lib/lodash/lodash"], function (_) {
    "use strict";
    return {
        MTA_TARGET_FOLDER: "mta_archives",
        COMP_NAME: "MTA BUILD",

        /**
         * Return i18n text message by ke and args from i18n/i18n.properties file
         */
        _geti18nText: function (sKey, aArgs) {
            return this.context.i18n.getText("i18n", sKey, aArgs);
        },

        //Check whether the webIDE work on internal mode
        _isInternalMode: function () {
            return sap.watt.getEnv("internal");
        },

        /**
         * Return the execution task configuration for build execution
         *  - Define the command to execute
         *  - Define the copy-back folder for the project mtar file
         */
        _getExecutionTask: function (oDocument) {
            var that = this;
            var projName = oDocument.getProjectMetadata().name;
            var mtaBuildCommand = "webide_mta_build.sh";
            if (this._isInternalMode()) {
                //Add internal flag to the mta build command only in internal env
                mtaBuildCommand = mtaBuildCommand + " --internal-mode true"
            }
            return {
                type: "shell",
                label: "Task for mta build",
                command: mtaBuildCommand,
                options: {
                    cwd: "${current.project.path}"
                },
                webideOptions: {
                    targetDocument: oDocument,
                    presentation: {
                        notificationFailureText: that._geti18nText("mta.buildprovider.build.failed", projName),
                        notificationSuccessText: that._geti18nText("mta.buildprovider.build.completed", projName)
                    },
                    copyBack: {
                        required: true,
                        location: this.MTA_TARGET_FOLDER + "/mta_archives.zip",
                        mapper: "default-mapper"
                    }
                }
            };
        },

        /**
         * In case git configure, add the target folder (mta_archive) to gitignore
         */
        _addArchivefolderToGitignore: function (aProjectDocument) {
            if (aProjectDocument) {
                var that = this;
                return this.context.service.git.getGitMetadataByDocument(aProjectDocument).then(function (oGit) {
                    if (!_.isEmpty(oGit)) {
                        var fullPath = aProjectDocument.getEntity().getFullPath();
                        var mtaArchivePath = fullPath + "/" + that.MTA_TARGET_FOLDER;
                        return that.context.service.filesystem.documentProvider.getDocument(mtaArchivePath).then(function (mtaArchivesDoc) {
                            if (_.isEmpty(mtaArchivesDoc)) {
                                that.context.service.log.warn(that.COMP_NAME, that._geti18nText("mta.buildprovider.build.addToGitIgnore.failed", that.MTA_TARGET_FOLDER), ["user"]);
                            } else {
                                return that.context.service.git.setIgnore(mtaArchivesDoc.getEntity()).then(function () {
                                })
                            }
                        })
                    } else {
                        return Q()
                    }
                })
            }
            return Q();
        },

        /**
         * Execute the build task, on succ add the arachive folder to .gitIgnore
         */
        executeBuild: function (oDocument) {
            var that = this;
            var projName = oDocument.getProjectMetadata().name;
            that.context.service.log.info(that.COMP_NAME, that._geti18nText("mta.buildprovider.build.started", projName, ["user"]));
            var oTask = this._getExecutionTask(oDocument);
            //call to ExecuteTask
            return this.context.service.task.execute(oTask).then(function () {
                that._addArchivefolderToGitignore(oDocument).done();
                that.context.service.log.info("mtaBuildTask", oTask.webideOptions.presentation.notificationSuccessText);
            }).fail(function (oError) {
                if (oError && oError.message) {
                    that.context.service.log.error(that.COMP_NAME, oError.message, ["user"]);
                    that.context.service.log.error(that.COMP_NAME, oTask.webideOptions.presentation.notificationFailureText, ["user"]);
                }
            });
        }
    };
});
