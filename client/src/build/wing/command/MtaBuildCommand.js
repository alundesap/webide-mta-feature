define([],
    function () {
        "use strict";

        return {
            MTA_PROJECT_TYPE: "mta",

            /**
             *  Check that the project is an MTA project
             *  return value :
             *     return true in case that the doc entity is project the type is MTA otherwise return false
             */
            _isMtaProject: function (oSelectionDoc) {
                if (oSelectionDoc && oSelectionDoc.getEntity().isProject()) {
                    var that = this;
                    return oSelectionDoc.getProject().then(function(oProjectDoc) {
                        var oMetadata = oProjectDoc.getProjectMetadata();
                        return (oMetadata.type === that.MTA_PROJECT_TYPE);
                    });
                }
                return Q(false);
            },

            /**
             *   Return the selected document
             */
            _getSelectedDocument: function () {
                return this.context.service.selection.getSelection().then(function (aSelection) {
                    if (aSelection && aSelection[0]) {
                        return aSelection[0].document;
                    }
                });
            },

            /**
             * Check if the build is available
             * Return Value:
             *   true - When the project is MTA
             *   false - The project is not MTA
             */
            isAvailable: function () {
                var that = this;
                return this._getSelectedDocument().then(function (oSelectionDoc) {
                    return that._isMtaProject(oSelectionDoc);
                });
            },

            /**
             * Execute the build
             */
            execute: function () {
                var that = this;
                return this._getSelectedDocument().then(function (oSelectionDoc) {
                    that.context.service.mta.buildprovider.executeBuild(oSelectionDoc).done();
                });
            }
        }
    });
