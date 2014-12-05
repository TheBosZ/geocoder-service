(function(angular){
	'use strict';
	angular.module('geocoder-service')
	.factory('geocoderService', [
		'$document',
		'$window',
		'$q',
	function(
		$document,
		$window,
		$q
	) {
		var isloading = false,
			finishedLoading = false,
			callbacks = [],
			geocoder;;

		$window.__initMaps = function() {
			finishedLoading = true;
			geocoder = new $window.google.maps.Geocoder();
			for (var x = 0; x < callbacks.length; ++x) {
				callbacks[x].resolve();
			}
			delete $window.__initMaps;
		};

		var buildCallback = function(defer, address) {
			geocoder.geocode({address: address}, function(result, status){
				if (status === $window.google.maps.GeocoderStatus.OK && result.length > 0) {
					defer.resolve(result[0].geometry.location);
				} else {
					defer.reject();
				}
			});
		};

		var loadGeocoder = function() {
			if (isloading) {
				return;
			}
			isloading = true;
			var document = $document[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=__initMaps';
			document.body.appendChild(script);
		};

		return {
			getLatLong: function(address) {
				var defer = $q.defer();
				if (!finishedLoading) {
					var d = $q.defer();
					callbacks.push(d);
					d.promise.then(function(){
						buildCallback(defer, address);
					});
					loadGeocoder();
				} else {
					buildCallback(defer, address);
				}
				return defer.promise;
			}
		};
	}]);
})(angular);