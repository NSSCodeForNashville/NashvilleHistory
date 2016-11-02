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
          return MarkerCardsFact.getDistanceToMarker(lat, long, marker.latitude.toString(), marker.longitude.toString())
        })
      )
      .then((data)=>{
        // console.log("data about distance", data);
        let distanceData = data.map((row)=>{
          return {
            distance: parseFloat(row.rows[0].elements[0].distance.text.split(" ")[0]),
            duration: parseFloat(row.rows[0].elements[0].duration.text.split(" ")[0])
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
