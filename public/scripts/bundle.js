var fs = require('fs-extra');

fs.emptyDirSync("dist");
fs.copySync("neo-app.json", "dist/neo-app.json");
fs.copySync("xs-app.json", "dist/xs-app.json");
fs.copySync("package.json", "dist/package.json");
fs.copySync("node_modules", "dist/node_modules");
fs.moveSync("dist_client_tmp", "dist/client");