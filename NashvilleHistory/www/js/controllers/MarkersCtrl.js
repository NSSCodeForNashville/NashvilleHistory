'use strict';

app.controller('PlaylistsCtrl', function($scope, $state,$cordovaGeolocation) {
  //The map that shows up when the user opens the app. It
  //The terrain view of the map should show up
  $scope.options = {
    mapTypeId: 'terrain',
    maxZoom: 18,
    minZoom: 8
  };

  let posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.map = {
        center: {latitude: position.coords.latitude, longitude: position.coords.longitude },
        zoom: 10,
        bounds: {},
        control: {},
        pan: true
      };
    }, function(err) {
      console.log("Could not get location");
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
  });


  watch.clearWatch();
  // OR
  $cordovaGeolocation.clearWatch(watch)
    .then(function(result) {
      // success
      }, function (error) {
      // error
    });
})