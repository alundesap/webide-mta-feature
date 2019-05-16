sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/PropertyBinding",
	"sap/ui/model/Filter"

], function(Controller, JSONModel, PropertyBinding, Filter) {
	"use strict";

	return Controller.extend("sap.watt.saptoolsets.common.mtayaml.ui.AbstractMtaYamlTab", {

		onInit: function() {
			this._ = require("sap/watt/lib/lodash/lodash");
			this._oModel = new JSONModel();
			this.getView().setModel(this._oModel);
			var oItemsModel = new JSONModel();
			this.getView().setModel(oItemsModel, "ItemsModel");
		},

		setMtaYamlData: function(oMtaYamlData) {
			this._oMtaYamlData = oMtaYamlData;
			if (!this._oBinding) {
				this._oBinding = new PropertyBinding(this._oModel, "", this._oModel.getContext("/"));
			}

			// Unregister model change listener to avoid event raising on setData
			this._oBinding.detachChange(this._onModelChange, this);
			// Convert mta.yaml structure to ui model structure and update model
			var oUIModelData = this.convertMtaYamlToUIModel(this._.cloneDeep(oMtaYamlData));
			this._oModel.setData(oUIModelData);
			this.createRequiresComboBoxItems();

			// Register model change listener 
			this._oBinding.attachChange(this._onModelChange, this);
			this.selectFirstItem();
		},

		selectFirstItem: function() {
			throw new Error("method 'selectFirstItem' must be implemented in the successor controller");
		},

		convertMtaYamlToUIModel: function(oMtaYamlData) {
			throw new Error("method 'convertMtaYamlToUIModel' must be implemented in the successor controller");
		},

		convertUIModelToMtaYaml: function(oUIModelData) {
			throw new Error("method 'convertUIModelToMtaYaml' must be implemented in the successor controller");
		},

		_setFocusOnRowSelection: function(aControlId) {
			var that = this;
			this._.forEach(aControlId, function(sControlId) {
				var oControl = that.byId(sControlId);
				oControl.addEventDelegate({
					onfocusin: function(oEvent) {
						var sName = oEvent.srcControl.getMetadata().getName();
						if (sName === "sap.m.Input" || sName === "sap.m.ComboBox") {
							var sPath = oEvent.srcControl.getBindingContext().getPath();
							var nIndex = parseInt(sPath.substring(sPath.lastIndexOf("/") + 1));
							var oControl2 = that.byId(sControlId);
							if (oControl2.getMetadata().getName() === "sap.m.List") {
								var oSelectedItem = oControl2.getItems()[nIndex];
								oControl2.setSelectedItem(oSelectedItem, true);
								oControl2.fireSelectionChange({
									listItem: oSelectedItem
								});
							} else { //If table
								oControl2.setSelectedIndex(nIndex);
							}
						}
					}
				}, that);
			});
		},

		_convertMapToArray: function(oMap) {
			var that = this;
			return this._.map(oMap, function(vValue, sKey) {
				return {
					key: sKey,
					realValue: vValue,
					displayedValue: that._.isArray(vValue) || that._.isObject(vValue) ? "ComplexType" : vValue,
					editable: !(that._.isArray(vValue) || that._.isObject(vValue))
				};
			});
		},

		_convertArrayToMap: function(aArray, bCheckValidation) {
			var that = this;
			var oMap = {};
			this._.forEach(aArray, function(oItem) {
				var bValid = true;
				if (bCheckValidation) { //this.regexValidiation(sValue){
					bValid = that.isKeyValueNotEmpty(oItem.key) && that.regexValidiation(oItem.key);
				}
				if (bValid) {
					if (oItem.editable) {
						if (oItem.displayedValue === "true" || oItem.displayedValue === "True") {
							oMap[oItem.key] = true;
						} else if (oItem.displayedValue === "false" || oItem.displayedValue === "False") {
							oMap[oItem.key] = false;
						} else if (!isNaN(oItem.displayedValue) && typeof oItem.displayedValue !== "boolean" && oItem.displayedValue !== "") {
							oMap[oItem.key] = parseInt(oItem.displayedValue, 10);
						} else {
							oMap[oItem.key] = oItem.displayedValue;
						}
					} else {
						oMap[oItem.key] = oItem.realValue;
					}
				}
			});
			return oMap;
		},

		_onModelChange: function() {
			var oMtaYamlData = this.convertUIModelToMtaYaml(this._.cloneDeep(this._oModel.getData()));
			this._.assign(this._oMtaYamlData, oMtaYamlData);
			this.fireEvent("mtaYamlChanged");
		},

		onTableAddPress: function(oEvent) {
			var oSrc = oEvent.getSource();
			var oTable = oSrc.getParent().getParent();
			if (oTable.getBinding() && oTable.getBindingContext()) {
				var sAddTo = oTable.getBinding().getPath();
				var oEmptyObject = this._getEmptyObject(oTable.data("location"));

				var oModel = this.getView().getModel();
				var sPath = oTable.getBindingContext().getPath();
				var oParent = oModel.getProperty(sPath);
				var aSection;
				if (oParent) {
					if (!oParent[sAddTo]) {
						oParent[sAddTo] = [];
					}

					aSection = oParent[sAddTo];
					aSection.push(oEmptyObject);
					oModel.setProperty(sPath + "/" + sAddTo, aSection);
					oTable.setSelectedIndex(aSection.length - 1);
				}
			}
		},

		onTableRemovePress: function(oEvent) {
			var oSrc = oEvent.getSource();
			var oTable = oSrc.getParent().getParent();
			var sRemoveFrom = oTable.getBinding().getPath();

			var oModel = this.getView().getModel();
			var sParentPath = oTable.getBindingContext().getPath();
			var sPath = sParentPath + "/" + sRemoveFrom;
			var aSection = oModel.getProperty(sPath);
			var nSelectedIndex = oTable.getSelectedIndex();

			this._.pullAt(aSection, nSelectedIndex);

			if (aSection.length > 0) {
				oModel.setProperty(sPath, aSection);
			} else {
				var oParent = oModel.getProperty(sParentPath);
				delete oParent[sRemoveFrom];
				oModel.setProperty(sParentPath, oParent);
			}

			oTable.setSelectedIndex(nSelectedIndex === aSection.length ? nSelectedIndex - 1 : nSelectedIndex);

		},

		_getEmptyObject: function(sLocation) {
			var oEmptyObject;
			switch (sLocation) {
				case "root":
					oEmptyObject = {
						name: ""
					};
					break;
				case "property":
					oEmptyObject = {
						displayedValue: "",
						editable: true,
						key: ""
					};
                    break;
                case "requires":
                    var sName = "";
                    if (this.getView().getModel("ItemsModel").getProperty("/aRequires").length > 0) {
                        sName = this.getView().getModel("ItemsModel").getProperty("/aRequires")[0].key;
                    }
                    oEmptyObject = {
                        name: sName
                    };
			}
			return oEmptyObject;
		},
		
		isKeyValueNotEmpty: function(sKeyValue) {
			if (!sKeyValue || sKeyValue.length === 0) {
				return false;
			}
			return true;
		},

		//cross validation- check if there is no duplicate keys in modules, provides and resources fields
		//from cross validation list
		keyCrossValidation: function(oEvent) {
			this.createRequiresComboBoxItems();
			var aCrossValidation = this.getView().getModel("ItemsModel").getProperty("/aCrossValidation");
			var mRequires = _.keyBy(aCrossValidation);
			var sValue = oEvent.getParameter("newValue");
			var bValid = this.regexValidiation(sValue) && !mRequires[sValue];
			this.setValueState(oEvent.getSource(), bValid);
			oEvent.getSource().setProperty("value", sValue, true);
		},

		//validate that there is no duplicate keys in the same table (relative)
		keyValidation: function(oEvent) {
			var oInputCtrl = oEvent.getSource();
			var sPathFull = oInputCtrl.getBindingContext().getPath();
			var sPath = sPathFull.substring(0, sPathFull.lastIndexOf("/"));
			var aExistingKeys = oInputCtrl.getModel().getProperty(sPath);
			aExistingKeys = _.keyBy(aExistingKeys, "key");
			var sValue = oEvent.getParameter("newValue");
			var bValid = !aExistingKeys[sValue];
			this.setValueState(oInputCtrl, bValid);
		},

		regexValidiation: function(sValue) {
			var validReg = /(^[A-Za-z0-9_\-\.]+$)/;
			return validReg.test(sValue);
		},

		setValueState: function(oControl, bValid) {
			if (bValid) {
				oControl.setValueState(sap.ui.core.ValueState.None);
			} else {
				oControl.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		//create RequiresComboBoxItems list that will be the cross validation list- collect all
		//keys from modules, provides and resources fields
		createRequiresComboBoxItems: function() {
			var oMtaYamlData = this._oMtaYamlData;
			var aCrossValidation = [];
			_.forEach(oMtaYamlData.resources, function(resource) {
				aCrossValidation.push({
					key: resource.name,
					type: "resource"
				});
			});
			_.forEach(oMtaYamlData.modules, function(module) {
				aCrossValidation.push({
					key: module.name,
					type: "module"
				});
				_.forEach(module.provides, function(provider) {
					aCrossValidation.push({
						key: provider.name,
						type: "provider"
					});
				});
			});
			this.getView().getModel("ItemsModel").setProperty("/aCrossValidation", aCrossValidation);
		},

		// ----------------------------------------------
		onValueHelpRequest: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"sap.watt.saptoolsets.common.mtayaml.ui.optionsListDialog", this);
				this._valueHelpDialog.setModel(oEvent.getSource().getModel("ItemsModel"), "ItemsModel");
				this._valueHelpDialog.setModel(this.getView().getModel("i18n"), "i18n");
				this.getView().addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value
			var sItemsPath = oEvent.getSource().getBinding("suggestionItems").getPath();
			var oItems = this._valueHelpDialog.getModel("ItemsModel").getProperty(sItemsPath);
			this._valueHelpDialog.getModel("ItemsModel").setProperty("/listItems", oItems);
			this._valueHelpDialog.open();
		},

		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var listItem = this.getView().byId(this.inputId);
				listItem.setValue(oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		onValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"name",
				sap.ui.model.FilterOperator.StartsWith, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		}

	});
});
