(function(angular){
	'use strict';
	angular.module('geocoder-service', [])
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
			geocoder;

		$window.__initMaps = function() {
			finishedLoading = true;
			geocoder = new $window.google.maps.Geocoder();
			for (var x = 0; x < callbacks.length; ++x) {
				callbacks[x].resolve();
			}
			delete $window.__initMaps;
		};

		var geocodeAddress = function(address) {
			var callback = function(address, defer) {
				geocoder.geocode({address: address}, function(result, status){
					if (status === $window.google.maps.GeocoderStatus.OK && result.length > 0) {
						defer.resolve(result[0]);
					} else {
						defer.reject();
					}
				});
			};
			var defer = $q.defer();
			
				if (!finishedLoading) {
					var d = $q.defer();
					callbacks.push(d);
					d.promise.then(function(){
						callback(address, defer);
					});
					loadGeocoder();
				} else {
					callback(address, defer);
				}
			return defer.promise;	
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
		var obj = {};

		obj.getLatLong = function(address) {
			return obj.getLocation(address).then(function(result){
				return result.geometry.location;
			});
		};
		obj.getLocation = function(address) {
			return geocodeAddress(address);
		};
		return obj;
	}]);
})(angular);