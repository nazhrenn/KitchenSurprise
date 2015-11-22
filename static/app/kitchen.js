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

kitchenApp.controller("masterController", function () {

});

kitchenApp.controller("homeController", function () {

});