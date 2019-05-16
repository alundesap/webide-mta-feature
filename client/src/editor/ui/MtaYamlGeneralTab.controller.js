sap.ui.define([
	"./AbstractMtaYamlTab.controller"
], function(AbstractMtaYamlTabController) {
	"use strict";

	return AbstractMtaYamlTabController.extend("sap.watt.saptoolsets.common.mtayaml.ui.MtaYamlGeneralTab", {

		convertMtaYamlToUIModel: function(oMtaYamlData) {
			return oMtaYamlData;
		},

		convertUIModelToMtaYaml: function(oUIModelData) {
			return oUIModelData;
		},

		selectFirstItem: function() {},
		
		idValueValidation: function(oEvent){
			var sValue = oEvent.getParameter('newValue');
			this.setValueState(oEvent.getSource(), this.regexValidiation(sValue));
		}
	});
});