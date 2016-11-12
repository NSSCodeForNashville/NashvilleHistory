'use strict';

app.controller('MarkersCtrl', function($scope, $state, $cordovaGeolocation, MarkerCardsFact, $q) {

  console.log(MarkerCardsFact)

  $scope.HistoricalCards;
  $scope.markers = [];
  $scope.showDescription = false;
  let AllMarkers;
  let lat;
  let long;

  //The map needs to be set to something before the location of the user is found by the phone otherwise there is an error.
  $scope.map = {
    center: {
      latitude: 36.1637,
      longitude: -86.7816
    },
    zoom: 10
  }
  //Similarly, the marker indicating where the user is needs to be set before the phone finds the location of the user otherwise there is an error.
  $scope.youAreHere = {
    id: 0,
    coords: {
      latitude: 36.1637,
      longitude: -86.7816
    },
    options: {
      icon: '../../img/greenMarker.png'
    }
  }
  //The following code block uses the Cordova Geolocation Plugin to access the user's native Geolocation technology within his/her device and find his/her location.
  let posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log(position);
      $scope.map = {
        center: {latitude: position.coords.latitude, longitude: position.coords.longitude },
        zoom: 12
      };
      $scope.youAreHere = {
        id: 0,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        options: {
          icon: '../../img/greenMarker.png'
        }
      }
      //Once the location of the user is found using geolocation, this function is called to find the markers that are within a certain radius of the user's location.
      getMarkersWithinRadius();
    }, function(err) {
      /****** TODO
      Create an error message that the user sees if the location cannot be found ******/
      console.log("Could not get location");
    });

    function getMarkersWithinRadius(){
      lat = $scope.map.center.latitude.toString();
      long = $scope.map.center.longitude.toString();
      //The function called in the factory uses the Historic Markers API to find the markers within a certain radius. This function takes the latitude and longitude of the user (as strings) as well as the desired radius (in meters) as arguments.
      return $q.all(
        [MarkerCardsFact.getHistoricalMarkersInRadius(lat, long, "3500"),
        MarkerCardsFact.getArtInPublicPlacesMarkersInRadius(lat,long, "3500"),
        MarkerCardsFact.getMetroPublicArtMarkersInRadius(lat, long, "3500")]
      )
      .then((data)=>{
        AllMarkers = data[0].concat(data[1]).concat(data[2]);
        console.log("all?", AllMarkers);
        addDistanceToMarkers();
        addMarkersToView();
      })
    }

    function addMarkersToView() {
      $scope.markers = AllMarkers.map((marker, index)=>{
        return {
          id: index,
          latitude: marker.latitude,
          longitude: marker.longitude,
          name: marker.title
        }
      });
      console.log($scope.markers);
    }

    //The purpose of this function is to take the latitude and longitude of each marker, found by the getMarkersInRadius function above, and find the distance from the user to that marker. This function uses a function in the factory to make a call to Google Maps Distance Matrix API.
    function addDistanceToMarkers(){
      return $q.all(
        AllMarkers.map((marker)=>{
          return MarkerCardsFact.getDistanceToMarker(lat, long, marker.latitude.toString(), marker.longitude.toString())
        })
      )
      .then((data)=>{
        console.log("data about distance", data);
        let distanceData = data.map((row)=>{
          return {
            distance: parseFloat(row.rows[0].elements[0].distance.text.split(" ")[0]),
            duration: parseFloat(row.rows[0].elements[0].duration.text.split(" ")[0])
          }
        })
        distanceData.forEach((element, index)=>{
          AllMarkers[index].distance = element.distance;
          AllMarkers[index].duration = element.duration;
        })
        console.log("new array of markers", AllMarkers)
        sortMarkersByDistance();
      })
    }

    //The next two functions sort the markers in the given radius from the closest to the furthest away from the user.
    function sortMarkersByDistance(){
      $scope.MarkerCards = sortByKey(AllMarkers, "distance");
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

  //The following code block watches the user's location and updates the center of the map as the user moves.
  // var watchOptions = { timeout : 5000, enableHighAccuracy: false };

  // var watch = $cordovaGeolocation.watchPosition(watchOptions);
  // watch.then(
  //   null,
  //   function(err) {
  //     console.log("New Location Not Found");
  //   },
  //   function(position) {
  //     $scope.map = {
  //       center: {latitude: position.coords.latitude, longitude: position.coords.longitude },
  //       zoom: 12
  //     };
  // });


  // watch.clearWatch();

})
