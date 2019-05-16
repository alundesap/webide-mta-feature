sap.ui.define([], function() {
	"use strict";
	return {
		Resource_type: [
			{name: "com.sap.xs.hdi-container"},
			{name: "com.sap.xs.hana-sbss"},
			{name: "com.sap.xs.hana-schema"},
			{name: "com.sap.xs.hana-securestore"},
			{name: "com.sap.xs.job-scheduler"},
			{name: "com.sap.xs.fs"},
			{name: "com.sap.xs.uaa"},
			{name: "com.sap.xs.uaa-devuser"},
			{name: "com.sap.xs.uaa-space"},
			{name: "com.sap.xs.sds"},
			{name: "org.cloudfoundry.user-provided-service", parameters: [{name:"service-name"}, {name:"config"}] },
			{name: "org.cloudfoundry.managed-service", parameters: [{name:"service"},{name: "service-plan"}]},
			{name: "org.cloudfoundry.existing-service", parameters: [{name:"service"}, {name:"service-plan"}]}
		],

		Resource_type_CF: [
			{name: "com.sap.xs.hdi-container"},
			{name: "com.sap.xs.hana-sbss"},
			{name: "com.sap.xs.hana-schema"},
			{name: "com.sap.xs.hana-securestore"},
			{name: "com.sap.xs.job-scheduler"},
			{name: "com.sap.xs.fs"},
			{name: "com.sap.xs.uaa"},
			{name: "com.sap.xs.uaa-devuser"},
			{name: "com.sap.xs.uaa-space"},
			{name: "com.sap.xs.sds"},
			{name: "org.cloudfoundry.user-provided-service", parameters: [{name:"service-name"}, {name:"config"}] },
			{name: "org.cloudfoundry.managed-service", parameters: [{name:"service"},{name: "service-plan"}]},
			{name: "org.cloudfoundry.existing-service", parameters: [{name:"service"}, {name:"service-plan"}]},
			{name: "configuration", parameters: [{name:"provider-nid"}, {name:"provider-id"}, {name:"version"}, {name:"target"},{name: "filter"}]}
		],
		Module_parameters: [{name: "app-name"}, {name: "buildpack"}, {name:"command"}, {name: "dependency-type"}, {name: "disk-quota"},
			{name: "domain"}, {name: "domains"}, {name: "host"}, {name: "hosts"}, {name: "instances"},{ name: "memory"}, {name: "port"}, {name: "ports"}
		],

		default_resource_parameters: [{name: "service"} ,{name: "service-name"}, {name: "service-plan"}]

	};
});