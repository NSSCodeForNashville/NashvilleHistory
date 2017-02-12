'use strict';

app.controller('MarkersCtrl', function($scope, $state, $cordovaGeolocation, AuthFact, BookmarkFact, MarkerCardsFact, CustomTourFact, $q, $ionicModal) {

  // IMPORTANT: Locations are given a Unique Id that is a combination of Lat and Long
  // Example: Location with lattitude 36.175226 and longitude -86.774255 will have a uid of "36.175226-86.774255"

  // Holds data for displaying location markers on the Google map
  $scope.markers = [];
  $scope.showDescription = false;
  $scope.markerClicked = false;
  $scope.activeMarker = null;
  let markerId = 0;
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
        zoom: 13
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
      addDistanceToMarkers();
      addMarkersToView();
    }, function(err) {
      /****** TODO
      Create an error message that the user sees if the location cannot be found ******/
      console.log("Could not get location");
    });


    function addMarkersToView() {
      $scope.markers = $scope.$parent.AllPlaces.map((marker, index)=>{
        return {
          id: index,
          latitude: marker.latitude,
          longitude: marker.longitude,
          name: marker.title,
          icon: "../img/aquaMarker.png",
          uid: marker.uid
        }
      });
    }

    // The purpose of this function is to take the latitude and longitude of each marker, find the distance from the user to that marker.
    // This function first calculates distance manually and sorts the AllPlaces array.
    // Then it confirms distance of the closest 10 results via Google Maps Distance Matrix API and sorts again.
    function addDistanceToMarkers(){
      return $q.all(
        $scope.$parent.AllPlace = $scope.$parent.AllPlaces.map((marker)=>{
          return MarkerCardsFact.getManualDistanceToMarker($scope.map.center.latitude.toString(), $scope.map.center.longitude.toString(), marker.latitude.toString(), marker.longitude.toString())
        })
      )
      .then((data)=>{
        //Adding the distance and duration via car to the AllPlaces array
        data.forEach((row, index)=>{
            $scope.$parent.AllPlaces[index].distance = row;
        })
        sortMarkersByDistance();
        var promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(MarkerCardsFact.getDistanceToMarker($scope.map.center.latitude.toString(), $scope.map.center.longitude.toString(),$scope.$parent.AllPlaces[i].latitude.toString(),$scope.$parent.AllPlaces[i].longitude.toString()));
          }
        $q.all(promises).then((data) => {
          data.forEach((row, index)=>{
            // If Google API returned the data
            if (row.rows) {
              $scope.$parent.AllPlaces[index].distance = parseFloat(row.rows[0].elements[0].distance.text.split(" ")[0]);
              $scope.$parent.AllPlaces[index].duration = parseFloat(row.rows[0].elements[0].duration.text.split(" ")[0]);
            // Else use manual calculation
            } else {
              $scope.$parent.AllPlaces[index].distance = row;
            }
          })
          sortMarkersByDistance();
        })
      })
    }

    //The next two functions sort the markers in the given radius from the closest to the furthest away from the user.
    function sortMarkersByDistance(){
      $scope.$parent.AllPlaces = sortByKey($scope.$parent.AllPlaces, "distance");
      $scope.$parent.MarkerCards = $scope.$parent.AllPlaces;
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    $scope.AddToBookmarks = (marker, index)=>{
      marker.userId = AuthFact.getUserId();
      $scope.$parent.MarkerCards[index].isBookmarked = true;
      BookmarkFact.addBookmark(marker);
    }

    //If a marker is clicked the marker should enlarge - become the BigAquaMarker - and the description of that marker should show up underneath the map. If another marker is clicked, the previously chosen marker will go back to normal size and the selected marker will enlarge.
    $scope.markerClick = (instance, event, marker)=>{
      if (marker.id === markerId){
        $scope.markers[markerId].icon = '../img/aquaMarker.png';
        $scope.markerClicked = false;
        $scope.activeMarker = null;
      }
      else {
        // If a marker is already selected, unselect it
        if ($scope.activeMarker) {
          $scope.markers[$scope.activeMarker.id].icon = '../img/aquaMarker.png';
        }
        markerId = marker.id;
        $scope.markers[marker.id].icon = '../img/BigAquaMarker2.png';
        $scope.markerClicked = true;
        $scope.activeMarker = $scope.markers[marker.id];
      }
    }
    //This will close the description of the active marker and show the list of cards as well as change the chosen marker back to a normal size.
    $scope.closeActiveMarker = ()=>{
      $scope.markers[markerId].icon = '../img/aquaMarker.png';
      $scope.markerClicked = false;
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
