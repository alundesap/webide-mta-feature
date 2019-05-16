sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/IconTabFilter'
], function(Controller, IconTabFilter) {
	"use strict";

	return Controller.extend("sap.watt.saptoolsets.common.mtayaml.ui.MtaYamlEditor", {

		onInit: function() {
			this._ = require("sap/watt/lib/lodash/lodash");
			this._aTabViews = [];
			var oIconTabBar = this.byId("mtaYamlIconTabBar");
			var aTabsConfiguration = this.getView().getViewData().tabsConfiguration;
			this._.forEach(aTabsConfiguration, function(oTabConfiguration) {
				var oTabView = sap.ui.view({
					viewName: oTabConfiguration.viewName,
					type: sap.ui.core.mvc.ViewType.XML
				});
				oTabView.getController().attachEvent("mtaYamlChanged", this._onMtaYamlChanged, this);
				oIconTabBar.addItem(new IconTabFilter({
					text: oTabConfiguration.tabName,
					content: oTabView
				}));
				this._aTabViews.push(oTabView);
			}.bind(this));
		},

		setMtaYamlData: function(oYamlContent) {
			//TODO try to update via model
			//this._oMtaYamlModel.setData(oYamlContent);
			this._.forEach(this._aTabViews, function(oTabView) {
				oTabView.getController().setMtaYamlData(oYamlContent);
			});
		},

		_onMtaYamlChanged: function() {
			this.fireEvent("mtaYamlChanged");
		}
	});
});