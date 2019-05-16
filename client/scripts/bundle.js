var path = require('path');
var pkgPath = path.resolve(__dirname, '../package.json');

var bundlingOptions = {
    paths: {
        "sap.watt.ideplatform.template/ui/wizard/ProgressIndicator": "empty:"
    }
};

require('@sap-webide/webide-client-tools').bundling.bundleFeature(pkgPath, {
    javaScriptOpts: {
        optimizeOptions: bundlingOptions,
        ignoreValidations: true,
        ignore : [
            "**/*.js",
            "**/*.xml",
            "**/*.json"
        ]
    }
}).catch(function (e) {
    console.log(e);
    process.exit(1);
});