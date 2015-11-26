var kitchenApp = angular.module('kitchenApp', ['ngRoute']);

kitchenApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'static/views/home.html',
		controller: 'homeController',
		controllerAs: 'home'
	})
	.otherwise({
		redirectTo: '/home'
	});
}]);

kitchenApp.controller("masterController", ['$http', function ($http) {
	(function () {
		var currentVersion = null;
		var checkForUpdate = function $checkForUpdate() {
			$http.get('/getVersion')
				.then(
					function $success(response) {
						if (currentVersion !== null && response.data.version > currentVersion) {
							// refresh page
							window.location.reload();
						}
						currentVersion = response.data.version;
					},
					function $error(response) {
						// log error?
					}
				);
		};

		setInterval(function () {
			checkForUpdate();
		}, 1000 * 60 * 30);
	}());

}]);

kitchenApp.controller("homeController", function () {

});