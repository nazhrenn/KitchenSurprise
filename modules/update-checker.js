var fs = require('fs');

var previousVersion = null;
module.exports = {
	checkUpdate: function (callback) {
		fs.readFile("./data/updateCounter.dat", "UTF-8", function (error, value) {
			if (previousVersion == null) {
				previousVersion = value;
				callback({ value: value, update: false });
			} else {
				var isUpdate = value > previousVersion;
				previousVersion = value;
				callback({ value: value, update: isUpdate });
			}
		});
	}
};