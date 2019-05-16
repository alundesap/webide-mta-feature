sap.ui.define([
	"./AbstractMtaYamlTab.controller",
	"./CreateListsItems"
], function(AbstractMtaYamlTabController, CreateListsItems) {
	"use strict";

	return AbstractMtaYamlTabController.extend("sap.watt.saptoolsets.common.mtayaml.ui.MtaYamlModulesTab", {

		onInit: function() {
			AbstractMtaYamlTabController.prototype.onInit.apply(this, arguments);
			var aTablesId = [
				"MtaProvidesTableKey",
				"MtaRequiresTableKey",
				"MtaRequiresTableParams",
				"MtaRequiresTableProps",
				"MtaProvidesTable",
				"mtaModuleParametersTable",
				"mtaModulePropertiesTable",
				"MtaBuildParametersTable"
			];
			this._setFocusOnRowSelection.call(this, aTablesId);
			this.initializeListItems();
		},

		initializeListItems: function() {
			this.getView().getModel("ItemsModel").setProperty("/aModuleParameters", CreateListsItems.Module_parameters);
		},

		limitSizeAndNameValueValidation: function(oEvent) {
			oEvent.getSource().getAggregation("myListBox").addStyleClass("mtayamlTabs_comboBox");
			var sSelectedItem = oEvent.getParameter("liveValue");
			this.setValueState(oEvent.getSource(), sSelectedItem);
			this.requireListRegenerator();
		},

        onBeforeRendering: function(oEvent){
            if(this._oMtaYamlData){
                this.requireListRegenerator();
            }
        },

		convertMtaYamlToUIModel: function(oMtaYamlData) {
			var that = this;
			var aModules = [];
			if (oMtaYamlData && oMtaYamlData.modules) {
				aModules = oMtaYamlData.modules;
				this._.forEach(aModules, function(oModule) {
					if (oModule.properties) {
						oModule.properties = that._convertMapToArray(oModule.properties);
					}
					if (oModule.parameters) {
						oModule.parameters = that._convertMapToArray(oModule.parameters);
					}
					if (oModule["build-parameters"]) {
						oModule["build-parameters"] = that._convertMapToArray(oModule["build-parameters"]);
					}
					that._.forEach(oModule.provides, function(oProvided) {
						if (oProvided.properties) {
							oProvided.properties = that._convertMapToArray(oProvided.properties);
						}
					});
					that._.forEach(oModule.requires, function(oRequired) {
						if (oRequired.properties) {
							oRequired.properties = that._convertMapToArray(oRequired.properties);
						}
						if (oRequired.parameters) {
							oRequired.parameters = that._convertMapToArray(oRequired.parameters);
						}
					});
				});
			}
			return {
				modules: aModules
			};
		},

		convertUIModelToMtaYaml: function(oUIModelData) {
			var that = this;
			var aModules = [];
			if (oUIModelData && oUIModelData.modules) {
				aModules = oUIModelData.modules;
				this._.forEach(aModules, function(oModule) {
					if (oModule.description === "") {
						delete oModule.description;
					}
					if (oModule.properties) {
						oModule.properties = that._convertArrayToMap(oModule.properties,true);
					}
					if (oModule.parameters) {
						oModule.parameters = that._convertArrayToMap(oModule.parameters,true);
					}
					if (oModule["build-parameters"]) {
						oModule["build-parameters"] = that._convertArrayToMap(oModule["build-parameters"],true);
					}
					that._.forEach(oModule.provides, function(oProvided) {
						if (oProvided.properties) {
							oProvided.properties = that._convertArrayToMap(oProvided.properties,true);
						}
					});
					that._.forEach(oModule.requires, function(oRequired) {
						if (oRequired.properties) {
							oRequired.properties = that._convertArrayToMap(oRequired.properties,true);
						}
						if (oRequired.parameters) {
							oRequired.parameters = that._convertArrayToMap(oRequired.parameters,true);
						}
						if (oRequired.group === "") {
							delete oRequired.group;
						}
					});
				});
			}
			return {
				modules: aModules
			};
		},

		selectFirstItem: function() {
			//Select first module in list
			var oList = this.byId("mtaYamlListModules");
			if (!oList.getSelectedItem()) {
				var oFirstItem = oList.getItems()[0];
				oList.setSelectedItem(oFirstItem, true);
				oList.fireSelectionChange({
					listItem: oFirstItem
				});
			}
			this.filterRequiresComboBoxItems();
		},

		onModuleSelectionChange: function(oEvent) {
			if (oEvent && oEvent.getParameter("listItem")) {
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				var oModuleDetailForm = this.byId("ModulesDetailPage");
				oModuleDetailForm.setBindingContext(oBindingContext);

				//TODO Find better solution
				var oModuleProvidesTable = this.byId("MtaProvidesTableKey");
				oModuleProvidesTable.setSelectedIndex(-1);
				oModuleProvidesTable.setSelectedIndex(0);

				var oModuleRequiresTable = this.byId("MtaRequiresTableKey");
				oModuleRequiresTable.setSelectedIndex(-1);
				oModuleRequiresTable.setSelectedIndex(0);
				this.filterRequiresComboBoxItems();
			}
		},

		onProvidesSelectionChange: function(oEvent) {
			var oRowContext = oEvent.getParameter("rowContext");
			var oModuleProvidesPropertiesTable = this.byId("MtaProvidesTable");
			oModuleProvidesPropertiesTable.setBindingContext(oRowContext);
			if (this.byId("MtaProvidesTableKey").getBinding("rows").getLength() > 0) {
				oModuleProvidesPropertiesTable.bindRows("properties");
			}
		},

		onRequiresSelectionChange: function(oEvent) {
			var oRowContext = oEvent.getParameter("rowContext");

			if (this.byId("MtaRequiresTableKey").getBinding("rows").getLength() > 0) {
				var oModuleRequiresParametersTable = this.byId("MtaRequiresTableParams");
				oModuleRequiresParametersTable.setBindingContext(oRowContext);
				oModuleRequiresParametersTable.bindRows("parameters");

				var oModuleRequiresPropertiesTable = this.byId("MtaRequiresTableProps");
				oModuleRequiresPropertiesTable.setBindingContext(oRowContext);
				oModuleRequiresPropertiesTable.bindRows("properties");
			}
		},

		onProvidesTableRemovePress: function(oEvent) {
			//call abstract remove function, check if parent table is empty and unbind rows if it is
			AbstractMtaYamlTabController.prototype.onTableRemovePress.apply(this, arguments);
			if (this.byId("MtaProvidesTableKey").getBinding("rows").getLength() === 0) {
				this.byId("MtaProvidesTable").unbindRows();
			}
		},

		onRequiresTableRemovePress: function(oEvent) {
			//call abstract remove function, check if parent table is empty and unbind rows if it is
			AbstractMtaYamlTabController.prototype.onTableRemovePress.apply(this, arguments);
			if (this.byId("MtaRequiresTableKey").getBinding("rows").getLength() === 0) {
				this.byId("MtaRequiresTableProps").unbindRows();
				this.byId("MtaRequiresTableParams").unbindRows();
			}
		},

		isRequiresParamsAndPropsTableVisible: function() {
			return this._isTableVisible("requires");
		},

		isProvidesPropTableVisible: function() {
			return this._isTableVisible("provides");
		},

		_isTableVisible: function(sPropertyName) {
			var oModulesList = this.byId("mtaYamlListModules");
			var oSelectedModule = oModulesList.getSelectedItem();
			if (oSelectedModule) {
				var sModulePath = oModulesList.getSelectedItem().getBindingContext().getPath();
				var oModule = this.getView().getModel().getProperty(sModulePath);
				return !!oModule[sPropertyName];
			} else {
				//list is not rendered yet
				return false;
			}
		},

		getModuleIcon: function(sType) {
			switch (sType) {
				case "java":
					return "sap-icon://watt/tmpl-java-application";
				case "dwf":
					return "sap-icon://watt/tmpl-dwf";
				case "hdb":
					return "sap-icon://database";
				case "html5":
					return "sap-icon://sap-ui5";
				case "nodejs":
					return "sap-icon://watt/tmpl-nodejs-application";
				case "cds":
					return "sap-icon://watt/cds-icon";
                		case "cfportalsite":
                			return "sap-icon://watt/tmpl-flp";
			}
		},
		requireListRegenerator:function(){
			this.createRequiresComboBoxItems();
			this.filterRequiresComboBoxItems();
		},

		filterRequiresComboBoxItems: function() {
			var aRequires = [];
			var aCrossValidation = this.getView().getModel("ItemsModel").getProperty("/aCrossValidation");
			var aModulesList = this.getView().byId("mtaYamlListModules");
			if (aModulesList) {
				var curModuleName = this.getView().byId("mtaYamlListModules").getSelectedItem() ? this.getView().byId("mtaYamlListModules").getSelectedItem()
					.getTitle() : "";
			}
			//include items from the aCrossValidation except current Module
			aRequires = _.filter(aCrossValidation, function(item) {
				return !(item.key === curModuleName && item.type === "module");
			});
			this.getView().getModel("ItemsModel").setProperty("/aRequires", aRequires);
		},
		
		regexValidiation: function(sValue) {
			var validReg = /(^[A-Za-z0-9_\-\.]+$)/;
			return validReg.test(sValue);
		},
		
		valueStateFormatterProperties: function(sValue){
			var oData = this.getView().getModel().getData();
			var iDupKeys = 0;
			if(!_.isEmpty(oData)){
                if(!_.isEmpty(oData.modules)) {
                	if(typeof oData.modules[0] !== 'undefined' && typeof oData.modules[0].properties !== 'undefined'){
	                    var aProperties = oData.modules[0].properties;
	                    for (var i = 0; i < aProperties.length; i++) {
	                        if (sValue === aProperties[i].key) {
	                            iDupKeys++;
	                        }
	                    }
                	}
                }
			}
			if(sValue && this.regexValidiation(sValue) && iDupKeys < 2){
            	return sap.ui.core.ValueState.None;
            }
                return sap.ui.core.ValueState.Error;
		},
		
		valueStateFormatterParameters: function(sValue){
			var oData = this.getView().getModel().getData();
			var iDupKeys = 0;
			if(!_.isEmpty(oData)){
                if(!_.isEmpty(oData.modules)) {
                     if(typeof oData.modules[0] !== 'undefined' && typeof oData.modules[0].parameters !== 'undefined'){
                    	var aParameters = oData.modules[0].parameters;
	                    for (var i = 0; i < aParameters.length; i++) {
	                        if (sValue === aParameters[i].key) {
	                            iDupKeys++;
	                        }
	                    }
                    }
                }
			}
			if(sValue && this.regexValidiation(sValue) && iDupKeys < 2){
            	return sap.ui.core.ValueState.None;
            }
                return sap.ui.core.ValueState.Error;
		},
		
		valueStateFormatterBuildParam: function(sValue){
			var oData = this.getView().getModel().getData();
			var iDupKeys = 0;
			if(!_.isEmpty(oData)){
                if(!_.isEmpty(oData.modules)) {
                	if(typeof oData.modules[0] !== 'undefined' && typeof oData.modules[0]["build-parameters"] !== 'undefined'){
	                    var aBuildParam = oData.modules[0]["build-parameters"];
	                    for (var i = 0; i < aBuildParam.length; i++) {
	                        if (sValue === aBuildParam[i].key) {
	                            iDupKeys++;
	                        }
	                    }
                	}
                }
			}
			if(sValue && this.regexValidiation(sValue) && iDupKeys < 2){
            	return sap.ui.core.ValueState.None;
            }
                return sap.ui.core.ValueState.Error;
		},
		
		valueStateFormatter: function(sValue){
    		if(sValue && this.regexValidiation(sValue)){
            	return sap.ui.core.ValueState.None;
            }
                return sap.ui.core.ValueState.Error;
		}
	});
});