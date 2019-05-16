define([
	"sap/watt/platform/plugin/platform/service/ui/AbstractEditor",
	"sap/watt/lib/lodash/lodash",
	"sap/watt/toolsets/lib/yamlParser/js-yaml"
	],
	function(AbstractEditor, _, yamlParser) {
	"use strict";

	var Editor = AbstractEditor.extend("sap.watt.saptoolsets.common.plugin.mtayaml.service.MtaYaml", {

		_oDocument: null,
		_oYamlContent: null,
		_aTabsConfiguration: null,

		/**
		 * =============================
		 * Lifecycle methods
		 * =============================
		 */
		configure: function(mConfig) {
			this._aTabsConfiguration = mConfig.tabs;
			return this.context.service.resource.includeStyles(mConfig.styles);
		},

		/**
		 * =======================================================
		 * sap.watt.common.service.editor.Editor interface methods
		 * =======================================================
		 */

		isAvailable: function() {
			return true;
		},

		open: function(oDocument) {
			var that = this;
			this._oDocument = oDocument;

			return this._oDocument.getContent().then(function(sContent) {
				that._oYamlContent = yamlParser.safeLoad(sContent) || {};
				that._oMtaYamlEditorView.getController().setMtaYamlData(that._oYamlContent);
			});
		},

		getContent: function() {
			if (!this._oMtaYamlEditorView) {
				this._oMtaYamlEditorView = sap.ui.view({
					viewName: "sap.watt.saptoolsets.common.mtayaml.ui.MtaYamlEditor",
					type: sap.ui.core.mvc.ViewType.XML,
					viewData: {
						tabsConfiguration: this._aTabsConfiguration
					}
				});

				this.context.i18n.applyTo(this._oMtaYamlEditorView);
				this._oMtaYamlEditorView.getController().attachEvent("mtaYamlChanged", this.onMtaYamlChanged, this);
			}

			return this._oMtaYamlEditorView;
		},

		flush: function() {
			if (this._oDocument.isDirty()) {
				this.updateDocument();
			}
		},

		onMtaYamlChanged: function () {
			this.updateDocument();
		},

		//=====================Update document==================================
		updateDocument: function() {
			var that = this;
			this.context.service.beautifierProcessor.beautify(yamlParser.safeDump(this._oYamlContent), "yaml").then(function (sContent) {
				return that._oDocument.setContent(sContent, that.context.self);
			}).done();
		}
	});

	return Editor;

});
