var express = require('express'),
	jade = require('jade'),
	app = express(),
	updateChecker = require('./modules/update-checker.js');

// setup express.
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/static', express.static('static'));
app.use('/vendor', express.static('vendor'));

app.get('/', function (req, res) {
	res.render('main', { title: "Kitchen Surprise" });
});

app.get('/checkForUpdate', function (req, res) {
	var version = updateChecker.checkUpdate(function (value) {
		res.json(value);
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Example app listening at http://%s:%s', host, port);
});