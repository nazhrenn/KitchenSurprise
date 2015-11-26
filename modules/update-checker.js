var fs = require('fs');

function readCurrentVersion() {
	var current = null;
	try {
		current = fs.readFileSync("./data/currentVersion.dat", "UTF-8");
	} catch (e) {
	}
	return current;
}

module.exports = {
	getVersion: function (callback) {
		return readCurrentVersion();
	}
};