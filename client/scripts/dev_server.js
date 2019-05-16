const clientTools = require("@sap-webide/webide-client-tools")

// <startConnect> has an optional options argument which can be used to customize for different scenarios
clientTools.devServer.startConnect()

/*var selenium = require('selenium-standalone');

selenium.install(function() {
    selenium.start({}, function(){})
})
*/