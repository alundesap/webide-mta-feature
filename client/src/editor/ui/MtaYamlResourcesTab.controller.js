sap.ui.define([
	"./AbstractMtaYamlTab.controller",
	"./CreateListsItems"

], function(AbstractMtaYamlTabController, CreateListsItems) {
	"use strict";

	return AbstractMtaYamlTabController.extend("sap.watt.saptoolsets.common.mtayaml.ui.MtaYamlResourcesTab", {

		onInit: function() {
			AbstractMtaYamlTabController.prototype.onInit.apply(this, arguments);
			var aTablesId = [
				"MtaResourcesList",
				"MtaResourcesParametersTable",
				"MtaResourcesPropertiesTable"
			];
			this._setFocusOnRowSelection.call(this, aTablesId);
			this.initializeListItems();
		},

		initializeListItems: function() {
			if (sap.watt.getEnv("server_type") === "xs2") {
				this.getView().getModel("ItemsModel").setProperty("/aResourceTypes", CreateListsItems.Resource_type);
			} else {
				this.getView().getModel("ItemsModel").setProperty("/aResourceTypes", CreateListsItems.Resource_type_CF);
			}
		},

		convertMtaYamlToUIModel: function(oMtaYamlData) {
			var that = this;
			var aResources = [];
			if (oMtaYamlData && oMtaYamlData.resources) {
				aResources = oMtaYamlData.resources;
				this._.forEach(aResources, function(aResource) {
					if (aResource.properties) {
						aResource.properties = that._convertMapToArray(aResource.properties);
					}
					if (aResource.parameters) {
						aResource.parameters = that._convertMapToArray(aResource.parameters);
					}
				});
			}
			return {
				resources: aResources
			};
		},

		convertUIModelToMtaYaml: function(oUIModelData) {
			var that = this;
			var aResources = [];
			if (oUIModelData && oUIModelData.resources) {
				aResources = oUIModelData.resources;
				this._.forEach(aResources, function(aResource) {
					if (aResource.description === "") {
						delete aResource.description;
					}
					if (aResource.properties) {
						aResource.properties = that._convertArrayToMap(aResource.properties,true);
					}
					if (aResource.parameters) {
						aResource.parameters = that._convertArrayToMap(aResource.parameters,true);
					}
				});
			}
			return {
				resources: aResources
			};
		},

		selectFirstItem: function() {
			var oList = this.byId("MtaResourcesList");
			if (!oList.getSelectedItem()) {
				var oFirstItem = oList.getItems()[0];
				oList.setSelectedItem(oFirstItem, true);
				oList.fireSelectionChange({
					listItem: oFirstItem
				});
				this.filterParametersList();
			}
		},

		onResourceSelectionChange: function(oEvent) {
			if (oEvent && oEvent.getParameter("listItem")) {
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				var oResourceBasicInfoForm = this.byId("ResourcesDetailPage");
				oResourceBasicInfoForm.setBindingContext(oBindingContext);
				var oResourcesPropertiesTableTable = this.byId("MtaResourcesPropertiesTable");
				oResourcesPropertiesTableTable.setBindingContext(oBindingContext);
				oResourcesPropertiesTableTable.bindRows("properties");

				var oResourcesParametersTableTable = this.byId("MtaResourcesParametersTable");
				oResourcesParametersTableTable.setBindingContext(oBindingContext);
				oResourcesParametersTableTable.bindRows("parameters");
				this.filterParametersList();
			}
		},

		onPressAddResources: function(oEvent) {
			var oEmptyObject = {
				name: "",
				type: "",
				description: ""
			};

			var oList = this.byId("MtaResourcesList");
			var oModel = this.getView().getModel();
			var oParent = oModel.getProperty("/");
			var aSection;

			if (!oParent.resources) {
				oParent.resources = [];
			}

			aSection = oParent.resources;
			aSection.push(oEmptyObject);
			oModel.setProperty("/resources", aSection);
			var oRemoveButton = this.byId("ResourcesRemoveResource");
			oRemoveButton.setProperty("enabled", true);

			var oLastItem = oList.getItems()[oList.getItems().length - 1];
			oList.setSelectedItem(oLastItem, true);
			oList.fireSelectionChange({
				listItem: oLastItem
			});
		},

		onPressRemoveResources: function(oEvent) {
			var oList = this.byId("MtaResourcesList");
			var oModel = this.getView().getModel();
			var aSection = oModel.getProperty("/resources");
			var oSelectedItemPath = oList.getSelectedItem().getBindingContextPath();
			var aSelectedItemPath = oSelectedItemPath.split("/");
			var nSelectedIndex = aSelectedItemPath[aSelectedItemPath.length - 1];
			this._.pullAt(aSection, nSelectedIndex);

			oModel.setProperty("/resources", aSection);

			if (aSection.length > 0) { // if list isn't empty after remove
				var oLastItem = oList.getItems()[oList.getItems().length - 1];
				oList.setSelectedItem(oLastItem, true);
				oList.fireSelectionChange({
					listItem: oLastItem
				});
			} else {
				var oRemoveButton = this.byId("ResourcesRemoveResource");
				oRemoveButton.setProperty("enabled", false);
				this.byId("MtaResourcesPropertiesTable").unbindRows();
				this.byId("MtaResourcesParametersTable").unbindRows();
			}
		},

		isResourcesListEmpty: function(oResources) {
			return oResources ? oResources.length > 0 : false;
		},

		// update resource parameters dropdown items by resource type
		filterParametersList: function() {
			var oList = this.byId("MtaResourcesList");
			var oSelectedItem= oList.getSelectedItem();
			var aParameters = CreateListsItems.default_resource_parameters;
			if (oSelectedItem) {
				var sType = this.getView().getModel().getProperty(oSelectedItem.getBindingContextPath()).type;
				var Resource_type_CF = _.keyBy(CreateListsItems.Resource_type_CF, "name");
				if (Resource_type_CF[sType] &&  Resource_type_CF[sType].parameters) {
					aParameters = Resource_type_CF[sType].parameters;
				}
				this.getView().getModel("ItemsModel").setProperty("/aResourceParameters", aParameters);
			}
		},
		
       regexValidiation: function(sValue) {
            var validReg = /(^[A-Za-z0-9_\-\.]+$)/;
            return validReg.test(sValue);
        },

        valueStateFormatterProperties: function(sValue){
            var oData = this.getView().getModel().getData();
            var iDupKeys = 0;
            if(!_.isEmpty(oData)){
                if(!_.isEmpty(oData.resources)){
                	 if(typeof oData.resources[0] !== 'undefined' && typeof oData.resources[0].properties !== 'undefined'){
	                    var aProperties = oData.resources[0].properties;
	                    for(var i=0;i<aProperties.length;i++){
	                        if(sValue === aProperties[i].key){
	                            iDupKeys++;
	                        }
	                    }
                	 }
                }
            }
            if(sValue && this.regexValidiation(sValue) && iDupKeys<2){
                return sap.ui.core.ValueState.None;
            }
            return sap.ui.core.ValueState.Error;
        },

        valueStateFormatterParameters: function(sValue){
            var oData = this.getView().getModel().getData();
            var iDupKeys = 0;
            if(!_.isEmpty(oData)){
                if(!_.isEmpty(oData.resources)){
                	if(typeof oData.resources[0] !== 'undefined' && typeof oData.resources[0].parameters !== 'undefined'){
	                    var aParameters = oData.resources[0].parameters;
	                    for(var i=0;i<aParameters.length;i++){
	                        if(sValue === aParameters[i].key){
	                            iDupKeys++;
	                        }
	                    }
                	}
                }
            }
            if(sValue && this.regexValidiation(sValue) && iDupKeys<2){
                return sap.ui.core.ValueState.None;
            }
            return sap.ui.core.ValueState.Error;
        }
	
 
	});
});