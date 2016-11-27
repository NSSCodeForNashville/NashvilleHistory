'use strict';

app.controller('MarkersCtrl', function($scope, $state, $cordovaGeolocation, MarkerCardsFact, CustomTourFact, $q, $ionicModal) {

  // IMPORTANT: Locations are given a Unique Id that is a combination of Lat and Long
  // Example: Location with lattitude 36.175226 and longitude -86.774255 will have a uid of "36.175226-86.774255"

  // Holds data for displaying location markers on the Google map
  $scope.markers = [];
  $scope.showDescription = false;
  // Stores current marker for Add to Route modal
  $scope.selectedMarker;
  // Stores active tour/route for Add to Route modal
  $scope.activeTour = {id: ""};
  $scope.newTour = {name: "", places: {}};

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
          name: marker.title
        }
      });
      console.log("Map Markers",$scope.markers);
    }

    //The purpose of this function is to take the latitude and longitude of each marker, found by the getMarkersInRadius function above, and find the distance from the user to that marker. This function uses a function in the factory to make a call to Google Maps Distance Matrix API.
    // This function also calculates a uid for each marker and assigns a title for artwork
    function addDistanceToMarkers(){
      console.log("Add Distance to Markers", $scope.$parent.AllPlaces);
      return $q.all(
        $scope.$parent.AllPlace = $scope.$parent.AllPlaces.map((marker)=>{
          return MarkerCardsFact.getDistanceToMarker($scope.map.center.latitude.toString(), $scope.map.center.longitude.toString(), marker.latitude.toString(), marker.longitude.toString())
        })
      )
      .then((data)=>{
        console.log("distance data from Google", data)
        //Adding the distance and duration via car to the AllPlaces array
        let distanceData = data.forEach((row, index)=>{
          // If Google API returned the data
          if (row.rows) {
            $scope.$parent.AllPlaces[index].distance = parseFloat(row.rows[0].elements[0].distance.text.split(" ")[0]);
            $scope.$parent.AllPlaces[index].duration = parseFloat(row.rows[0].elements[0].duration.text.split(" ")[0]);
          // Else use the manual calculation
          } else {
            $scope.$parent.AllPlaces[index].distance = row;
          }
        })
        sortMarkersByDistance();
      })
    }

    // ADD TO ROUTE/TOUR FUNCTIONALITY
    // Add to Route modal
    $scope.tourModal = function(markerUID) {
      // Create the login modal and show it
      $ionicModal.fromTemplateUrl('templates/tourModal.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        setSelectedMarker(markerUID);
        $scope.modal.show();
      });
    };

    // Triggered in the route/tour modal to close it
    $scope.closeTourModal = function() {
      $scope.modal.hide();
      $scope.modal.remove();
    };

    $scope.doAddToRoute = function() {;
      // Prepare place object
      let newPlace = {
          dateAdded: Date.now()
        }
      // Preparing a new route/tour to be added to Firebase
      if ($scope.activeTour.id == "new") {
        newPlace.order = 1;
        $scope.newTour.userId = $scope.$parent.loggedInUser.uid;
        $scope.newTour.dateAdded = Date.now();
        $scope.newTour.public = false;
        $scope.newTour.places[$scope.selectedMarker.uid] = newPlace;
        console.log($scope.newTour);
        // Ship off to Firebase
        CustomTourFact.pushNewTour($scope.newTour)
          .then((tourUID) => {
            // Add new Tour to user object with provided tourUID
            $scope.$parent.loggedInUser.customTours[tourUID] = $scope.newTour;
            // Clear New Tour object
            $scope.newTour = {name: "", places: {}};
          })
      // If we're just adding to an existing tour on Firebase
      } else {
        // Assign an Order to the place, according to how many places already exist on this route
        if ($scope.$parent.loggedInUser.customTours[$scope.activeTour.id].places) {
          newPlace.order = Object.keys($scope.$parent.loggedInUser.customTours[$scope.activeTour.id].places).length + 1;
        } else {
          newPlace.order = 1;
        }
        CustomTourFact.putNewPlace($scope.activeTour.id,$scope.selectedMarker.uid,newPlace)
          .then((response)=> {
            // Add newly created place to user object
            if ($scope.$parent.loggedInUser.customTours[$scope.activeTour.id].places) {
              $scope.$parent.loggedInUser.customTours[$scope.activeTour.id].places[$scope.selectedMarker.uid] = newPlace;
            } else {
              $scope.$parent.loggedInUser.customTours[$scope.activeTour.id].places = {};
              $scope.$parent.loggedInUser.customTours[$scope.activeTour.id].places[$scope.selectedMarker.uid] = newPlace;
            }
          })
      }
    }

    //The next two functions sort the markers in the given radius from the closest to the furthest away from the user.
    function sortMarkersByDistance(){
      $scope.$parent.MarkerCards = sortByKey($scope.$parent.AllPlaces, "distance");
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    function setSelectedMarker(uid) {
      for (let i = 0; i < $scope.$parent.AllPlaces.length; i++) {
        if ($scope.$parent.AllPlaces[i].uid == uid) {
          $scope.selectedMarker = $scope.$parent.AllPlaces[i];
        }
      }
      console.log("Selected Marker", $scope.selectedMarker);
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
