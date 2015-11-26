var kitchenApp = angular.module('kitchenApp', ['ngRoute', 'angular-virtual-keyboard']);

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

var timerClass = function (title, duration, autoStart) {
	this.duration = duration;
	this.title = title;
	this.autoStart = !autoStart ? false : true;
};

kitchenApp.controller("homeController", ['$scope', function ($scope) {

}]);

kitchenApp.directive('pane', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			name: '=name'
		},
		templateUrl: 'static/partials/pane.html'
	};
});

var removeTimer;

kitchenApp.controller('timerController', function () {
	function defaultTimer() {
		return {
			title: '',
			display: '',
			autoStart: false
		};
	}
	var timeCtrl = this;
	this.timers = {};
	this.displayCreateDialog = false;
	this.timer = defaultTimer();

	this.addTimer = function (title, duration, autoStart) {
		var self = this;
		this.timers[title] = new timerClass(title, duration, autoStart);
	};

	removeTimer = function (title) {
		delete timeCtrl.timers[title];
	};

	this.createTimer = function () {
		var segments = this.timer.display.split(":");
		var duration = 0;

		if (segments.length == 3) {
			duration += Number.parseInt(segments[0] * 60 * 60);
			duration += Number.parseInt(segments[1] * 60);
			duration += Number.parseInt(segments[2]);
		}
		else if (segments.length == 2) {
			duration += Number.parseInt(segments[0] * 60);
			duration += Number.parseInt(segments[1]);
		}
		else {
			duration += Number.parseInt(segments[0]);
		}

		this.addTimer(this.timer.title, duration, false);
		this.timer = defaultTimer();
		this.digits = [];
		this.displayCreateDialog = false;
	}

	this.timerSetup = "";
	this.digits = [];
	this.addDigit = function (digit) {
		this.digits.push(digit);
		formatDigits.call(this);
	};

	this.removeDigit = function () {
		this.digits.pop();
		formatDigits.call(this);
	};

	function formatDigits() {
		var hours = null,
			minutes = null,
			seconds = null;
		if (this.digits.length >= 5) {
			hours = this.digits.slice(0, this.digits.length - 4).join('');
		}

		if (this.digits.length >= 4) {
			minutes = this.digits.slice(this.digits.length - 4, this.digits.length - 2).join('');
		}
		else if (this.digits.length >= 3) {
			minutes = this.digits.slice(this.digits.length - 3, this.digits.length - 2).join('');
		}
		seconds = this.digits.slice(this.digits.length - 2, this.digits.length).join('');

		this.timer.display = (hours !== null ? hours + ":" : "") + (minutes !== null ? minutes + ":" : "") + seconds;
	}
});

kitchenApp.directive('timer', ['$interval', 'dateFilter', function ($interval, dateFilter) {
	function link(scope, element, attrs) {
		var format,
			timeoutId;

		var originalDuration = scope.duration;

		scope.toHHMMSS = function (sec_num, displayZeros) {
			if (!displayZeros) {
				displayZeros = false;
			}

			var hours = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			if (hours < 10) { hours = "0" + hours; }
			if (minutes < 10) { minutes = "0" + minutes; }
			if (seconds < 10) { seconds = "0" + seconds; }

			var time = [];
			if (hours > 0 || displayZeros) {
				time.push(hours);
				time.push(":");
			}

			if (minutes > 0 || displayZeros) {
				time.push(minutes);
				time.push(":");
			}

			time.push(seconds);
			return time.join('');
		};

		scope.pause = function () {
			element.removeClass('running');
			element.removeClass('flash');
			element.addClass('paused');

			scope.running = false;
			$interval.cancel(timeoutId);
		};

		scope.start = function () {
			scope.running = true;
			element.addClass('running');
			element.removeClass('flash');
			element.removeClass('paused');

			timeoutId = $interval(function () {
				updateTime(); // update DOM
			}, 1000);
		};

		scope.reset = function () {
			scope.duration = originalDuration;
		};

		scope.flash = function () {
			element.addClass('flash');
			element.removeClass('running');
			element.removeClass('paused');
		};

		scope.remove = function () {
			element.remove();
			removeTimer(scope.title);
		};

		function updateTime() {
			if (scope.duration === 0) {
				scope.pause();
				scope.flash();
			} else {
				scope.duration -= 1;
			}
		}

		scope.$watch(attrs.myCurrentTime, function (value) {
			format = value;
			updateTime();
		});

		element.on('$destroy', function () {
			$interval.cancel(timeoutId);
		});

		// start the UI update process; save the timeoutId for canceling
		if (scope.autoStart) {
			scope.start();
		}
	}

	return {
		restrict: 'E',
		scope: {
			duration: '@',
			title: '@',
			autoStart: '@'
		},
		templateUrl: 'static/partials/timer.html',
		link: link
	};
}]);


kitchenApp.directive('draggable', ['$document', function ($document) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			var startX = 0, startY = 0, x = 0, y = 0;

			element.css({
				position: 'relative'
			});

			element.on('mousedown', function (event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				startX = event.pageX - x;
				startY = event.pageY - y;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				y = event.pageY - startY;
				x = event.pageX - startX;
				element.css({
					top: y + 'px',
					left: x + 'px'
				});
			}

			function mouseup() {
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
			}
		}
	};
}]);