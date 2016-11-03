'use strict';

app.controller('MarkersCtrl', function($scope, $state, $cordovaGeolocation, MarkerCardsFact, $q) {

  console.log(MarkerCardsFact)

  $scope.HistoricalCards;
  let HistoricalMarkers;
  let lat;
  let long;

  $scope.map = {
    center: {
      latitude: 36.1637,
      longitude: -86.7816
    },
    zoom: 10
  }

  let posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log(position);
      $scope.map = {
        center: {latitude: position.coords.latitude, longitude: position.coords.longitude },
        zoom: 12
      };
      getMarkersWithinRadius();
    }, function(err) {
      console.log("Could not get location");
    });


    function getMarkersWithinRadius(){
      lat = $scope.map.center.latitude.toString();
      long = $scope.map.center.longitude.toString();
      MarkerCardsFact.getMarkersInRadius(lat, long, "6000")
      .then((data)=>{
        console.log("markers in area", data);
        HistoricalMarkers = data;
        addDistanceToMarkers();
      })
    }

    function addDistanceToMarkers(){
      return $q.all(
        HistoricalMarkers.map((marker)=>{
          return calculateDistanceToMarker(lat, long, marker.latitude, marker.longitude)
        })
      )
      .then((data)=>{
        console.log("Calculated Distance",data);
        // console.log("data about distance", data);
        let distanceData = data.map((row)=>{
          return {
            distance: parseFloat(row)
          }
        })
        distanceData.forEach((element, index)=>{
          HistoricalMarkers[index].distance = element.distance;
          HistoricalMarkers[index].duration = element.duration;
        })
        console.log("new array of markers", HistoricalMarkers)
        sortMarkersByDistance();
      })
    }

    function sortMarkersByDistance(){
      $scope.HistoricalCards = sortByKey(HistoricalMarkers, "distance");
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    function calculateDistanceToMarker(lat1, lon1, lat2, lon2){
      var R = 6371e3; // metres
      var φ1 = toRadians(lat1);
      var φ2 = toRadians(lat2);
      var Δφ = toRadians((lat2-lat1));
      var Δλ = toRadians((lon2-lon1));

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return getMiles(d);
    }

    function toRadians(x) {
       return x * Math.PI / 180;
    }

    // Converts meters to miles
    function getMiles(i) {
     return i*0.000621371192;
    }

        //     bounds: {},
        // control: {},
        // pan: true


  // var watchOptions = {
  //   timeout : 3000,
  //   enableHighAccuracy: false // may cause errors if true
  // };

  // var watch = $cordovaGeolocation.watchPosition(watchOptions);
  // watch.then(
  //   null,
  //   function(err) {
  //     // error
  //   },
  //   function(position) {
  //     var lat  = position.coords.latitude
  //     var long = position.coords.longitude
  // });


  // watch.clearWatch();
  // // OR
  // $cordovaGeolocation.clearWatch(watch)
  //   .then(function(result) {
  //     // success
  //     }, function (error) {
  //     // error
  //   });
})
