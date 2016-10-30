'use strict';

app.controller('MarkersCtrl', function($scope, $state,$cordovaGeolocation) {
  //The map that shows up when the user opens the app. It
  //The terrain view of the map should show up
  $scope.options = {
    mapTypeId: 'roadmap',
    maxZoom: 18,
    minZoom: 10
  };

  $scope.map = {
    center: {
      latitude: 36.174465,
      longitude: -86.767960
    },
    zoom: 13
  }

  let posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.map = {
        center: {latitude: position.coords.latitude, longitude: position.coords.longitude },
        zoom: 15
      };
      console.log($scope.map)
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
})
