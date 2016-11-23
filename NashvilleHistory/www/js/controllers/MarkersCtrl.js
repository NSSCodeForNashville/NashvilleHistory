'use strict';

app.controller('MarkersCtrl', function($scope, $state, $cordovaGeolocation, MarkerCardsFact, $q, BookmarkFact, AuthFact) {

  console.log(MarkerCardsFact)

  $scope.HistoricalCards;
  $scope.markers = [];
  $scope.showDescription = false;
  $scope.markerClicked = false;
  $scope.activeMarker = null;
  let markerId = 0;
  let AllMarkers;
  let lat;
  let long;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.loggedInUser = user;
      $scope.userLoggedIn = true;
    }
    else {
      $scope.loggedInUser = null;
      $scope.userLoggedIn = false;
    }
  });
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
      getMarkersWithinRadius();
    }, function(err) {
      /****** TODO
      Create an error message that the user sees if the location cannot be found ******/
      console.log("Could not get location");
    });

    //The purpose of this function is to get all of the markers in a certain radius from the user, art and historical, from the Nashville Gov API and place them in one array.
    function getMarkersWithinRadius(){
      lat = $scope.map.center.latitude.toString();
      long = $scope.map.center.longitude.toString();
      return $q.all(
        [MarkerCardsFact.getHistoricalMarkersInRadius(lat, long, "3500"),
        MarkerCardsFact.getArtInPublicPlacesMarkersInRadius(lat,long, "3500"),
        MarkerCardsFact.getMetroPublicArtMarkersInRadius(lat, long, "3500")]
      )
      .then((data)=>{
        AllMarkers = data[0].concat(data[1]).concat(data[2]);
        console.log("markers from API", AllMarkers);
        addDistanceToMarkers();
      })
    }
     //All of these properties need to be added to avoid calling the API when a marker is clicked and more information about the marker needs to be displayed below the map.
    function addMarkersToView() {
      $scope.markers = AllMarkers.map((marker, index)=>{
        marker.id = index;
        marker.icon = "../img/aquaMarker.png";
        return marker;
      });
    }

    //The purpose of this function is to take the latitude and longitude of each marker, found by the getMarkersInRadius function above, and find the distance from the user to that marker. This function uses a function in the factory to make a call to Google Maps Distance Matrix API.
    function addDistanceToMarkers(){
        let distanceData = AllMarkers.map((marker)=>{
          return MarkerCardsFact.calculateDistanceToMarker(lat, long, marker.latitude, marker.longitude)
        })
        distanceData.forEach((element, index)=>{
          AllMarkers[index].distance = element;
        })
        sortMarkersByDistance();
        areMarkersBookmarked();
    }

    //The next two functions sort the markers in the given radius from the closest to the furthest away from the user.
    function sortMarkersByDistance(){
      AllMarkers = sortByKey(AllMarkers, "distance");
      addMarkersToView();
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    //TODO: Get the bookmarked markers and make sure the user cannot add a marker twice to his/her bookmarks
    function areMarkersBookmarked (){
      BookmarkFact.getAllBookmarks(AuthFact.getUserId())
      .then((bookmarks)=>{
        console.log("bookmarked markers", bookmarks);
        Object.keys(bookmarks).map((key)=>{
          AllMarkers.forEach((marker, index)=>{
            if (bookmarks[key].latitude === marker.latitude && bookmarks[key].longitude === marker.longitude){
              AllMarkers[index].isBookmarked = true;
            }
          });
        });
      });
    }

    $scope.AddToBookmarks = (marker, index)=>{
      marker.uid = AuthFact.getUserId();
      $scope.markers[index].isBookmarked = true;
      BookmarkFact.addBookmark(marker);
    }

    $scope.AddToRoute = (marker)=>{
      console.log("clicked add to route");
      /**TODO: Add the marker to a route **/
    }

    //If a marker is clicked the marker should enlarge - become the BigAquaMarker - and the description of that marker should show up underneath the map. If another marker is clicked, the previously chosen marker will go back to normal size and the selected marker will enlarge.
    $scope.markerClick = (instance, event, marker)=>{
      $scope.markers[marker.id].icon = '../img/BigAquaMarker2.png';
      if (marker.id === markerId){
        $scope.markerClicked = !$scope.markerClicked;
      }
      else {
        $scope.markers[markerId].icon = '../img/aquaMarker.png';
        markerId = marker.id;
        $scope.markerClicked = true;
      }
      $scope.activeMarker = marker;
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
