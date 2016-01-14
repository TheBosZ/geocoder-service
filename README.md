geocoder-service
================

Simple geocoder service with no external dependencies for AngularJS. It uses Google's API so it's not for high-volume look ups. Google's library is lazy-loaded upon first use and then retained until page reload to make subsequent look ups faster.

#### Installation
* ````bower install geocoder-service````

Include as a dependency in your AngularJS app:
````javascript
angular.module('yourApp', ['geocoder-service']);
````

Make sure to include the geocoder-service.js file, either in your build process or directly using a script tag.

#### Usage

Inject the geocoderService into your controller and use like so

````javascript
$scope.latitude = null;
$scope.longitude = null;
$scope.geocodeError = false;
$scope.isFinished = false;
$scope.address = '1600 Pennsylvania Avenue NW, Washington, D.C. 20500';

geocoderService.getLatLong($scope.address).then(function(latlng){
	$scope.latitude = latlng.lat();
	$scope.longitude = latlng.lng();
}, function(){
	$scope.geocodeError = true;
}).finally(function(){
	$scope.isFinished = true;
});
````

#### Methods

getLatLong:
* Arguments: ````address````, type: String
  * Address to look up
* Return: promise
  * When promise is resolved successfully, the argument passed to the success function is a [Google Maps LatLng object](https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal)
  * When promise is resolved with an error, that means the service failed to geocode the given address