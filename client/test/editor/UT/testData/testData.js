define([], function(){
	
var sMtaYaml = 
'_schema-version: "2.0.0" \n' +
'ID: OPENSAP_HANA5_EXAMPLE \n' +
'version: 1.12.1 \n' +
'modules: \n' +
'- name: openSAP5-ex-web \n' +
'  description:  ""\n' +
'  build-parameters: \n' +
'    builder: grunt \n' +
'  properties: \n' +
'    plugin_name: ${name} \n' +
'  provides:  \n' +
'    - name: web \n' +
'      properties: \n' +
'        ui-url: "${default-url}" \n' +
'  requires: \n' +
'    - name: openSAP5-ex-uaa \n' +
'      properties: \n' +
'        ui-url: "${default-url}" \n' +
'      parameters: \n' +
'        ui-url: "${default-url}" \n' +
'      group: ""\n' +
' \n' +
'  parameters:  \n' +
'    host: web  \n' +
'         \n' +
'resources: \n' +
'- name: plugins \n' +
'  type: configuration \n' +
'  parameters: \n' +
'    filter: \n' +
'      type: com.acme.plugin \n' +
'  properties: \n' +
'    plugin_name: ${name} \n' +
'    plugin_url: ${url}/sources \n'
;

	var oFileStructure =  {
		"testProj": {
		    "mta.yaml": sMtaYaml
		}
	};

    return oFileStructure;
});