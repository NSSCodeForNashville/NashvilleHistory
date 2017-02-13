"use strict";

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $q, $location, CustomTourFact, AllPlacesFact, BookmarkFact, $ionicSideMenuDelegate) {

  // Cards that will be displayed on whichever page
  $scope.MarkerCards;
  // All places available in memory
  $scope.AllPlaces;

  //The purpose of this function is to get all of the markers, art and historical, from the Nashville Gov API and place them in one array.
  function getAllPlaces(){
    return $q.all(
      [AllPlacesFact.getAllHistoricalMarkers(),
      AllPlacesFact.getAllArtInPublicPlacesMarkers(),
      AllPlacesFact.getAllMetroPublicArtMarkers()]
    )
    .then((data)=>{
      $scope.AllPlaces = data[0].concat(data[1]).concat(data[2]);
      $scope.AllPlaces = $scope.AllPlaces.sort($scope.sortAllPlaces);
      console.log("All places", $scope.AllPlaces);
      $scope.MarkerCards = $scope.AllPlaces;
    });
  }

  $scope.sortAllPlaces = (x, y) => {
    // Determines if the place is a historical marker or artwork
    // Returns the name of the place to be used when sorting
    function getPlaceName(place) {
      if (place.title) {
        return place.title.toLowerCase();
      } else if (place.artwork) {
        return place.artwork.toLowerCase();
      }
    }

    return getPlaceName(x) < getPlaceName(y) ? -1 : 1;
  }

  // Execute on start
  getAllPlaces();

  // ADD TO ROUTE/TOUR FUNCTIONALITY

  // Stores current marker for Add to Route modal
  $scope.selectedMarker;
  // Stores active tour/route for Add to Route modal
  $scope.activeTour = {id: ""};
  $scope.newTour = {name: "", places: {}};

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
      $scope.newTour.userId = $scope.loggedInUser.uid;
      $scope.newTour.dateAdded = Date.now();
      $scope.newTour.public = false;
      $scope.newTour.places[$scope.selectedMarker.uid] = newPlace;
      console.log($scope.newTour);
      // Ship off to Firebase
      CustomTourFact.pushNewTour($scope.newTour)
        .then((tourUID) => {
          // Add new Tour to user object with provided tourUID
          $scope.loggedInUser.customTours[tourUID] = $scope.newTour;
          // Clear New Tour object
          $scope.newTour = {name: "", places: {}};
        })
    // If we're just adding to an existing tour on Firebase
    } else {
      // Assign an Order to the place, according to how many places already exist on this route
      if ($scope.loggedInUser.customTours[$scope.activeTour.id].places) {
        newPlace.order = Object.keys($scope.loggedInUser.customTours[$scope.activeTour.id].places).length + 1;
      } else {
        newPlace.order = 1;
      }
      CustomTourFact.putNewPlace($scope.activeTour.id,$scope.selectedMarker.uid,newPlace)
        .then((response)=> {
          // Add newly created place to user object
          if ($scope.loggedInUser.customTours[$scope.activeTour.id].places) {
            $scope.loggedInUser.customTours[$scope.activeTour.id].places[$scope.selectedMarker.uid] = newPlace;
          } else {
            $scope.loggedInUser.customTours[$scope.activeTour.id].places = {};
            $scope.loggedInUser.customTours[$scope.activeTour.id].places[$scope.selectedMarker.uid] = newPlace;
          }
        })
    }
    $scope.modal.hide();
    $scope.modal.remove();
  }

  function setSelectedMarker(uid) {
    for (let i = 0; i < $scope.AllPlaces.length; i++) {
      if ($scope.AllPlaces[i].uid == uid) {
        $scope.selectedMarker = $scope.AllPlaces[i];
      }
    }
  }

  $ionicSideMenuDelegate.canDragContent(false);

  // Returns the current location, strips any router variables
  $scope.getLocation = function() {
    var url = $location.url(); // "/app/location/router-variables"
    url = url.split("/"); // [ '', 'app', 'location', 'router-variables' ]
    return url[2]; // location only
  }

  // Current Firebase Logged-In User Object
  $scope.loggedInUser = null;

  // Form data for the login modal
  $scope.loginData = {};

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    $scope.modal.remove();
  };

  // Open the login modal
  $scope.login = function() {
    // Create the login modal and show it
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  // Switch to the register modal
  $scope.register = function() {
    // Remove the login modal
    $scope.modal.hide();
    $scope.modal.remove();
    // Create the register modal and show it
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  // Auto-Login Handler
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.loggedInUser = user;
      // Retrieve custom tours for this user on login
      CustomTourFact.retrieveCustomTours(user.uid)
        .then((tours)=> {
          $scope.loggedInUser.customTours = tours;
        })
      // Retrieve bookmarks for this user on login
      areMarkersBookmarked(user);
    } else {
      $scope.loggedInUser = null;
    }
  });

  // Retrieve user bookmarks and update AllPlaces with new detail
  function areMarkersBookmarked (user){
    BookmarkFact.getAllBookmarks(user.uid)
    .then((bookmarks)=>{
      Object.keys(bookmarks).map((key)=>{
        $scope.AllPlaces.forEach((marker, index)=>{
          if (bookmarks[key].uid === marker.uid){
            $scope.AllPlaces[index].isBookmarked = true;
          }
        })
      })
    })
  }

  // Logout
  $scope.logout = function() {
    firebase.auth().signOut()
      .then(function(data){
        console.log("success log out", data)
        $scope.loggedInUser = null;
      })
  }

  // Google Login
  $scope.google = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
    .then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      $scope.loggedInUser = result.user;
    }).catch(function(error) {
      console.error(`Error with Registration, ${error.code}: ${error.message}`);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  }

  // Firebase Login with Email and Password
  $scope.doLogin = function() {
    firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
    .then(function(data) {
      $scope.loggedInUser = data;
      $scope.modal.hide();
      $scope.modal.remove();
    })
    .catch(function(error) {
      console.error(`Error with Login, ${error.code}: ${error.message}`);
    });
  };

  // Firebase Registration with Email and Password
  $scope.doRegistration = function() {
    if ($scope.loginData.password !== $scope.loginData.passwordConfirmation) {
      console.error("Passwords do not match.")
    } else {
      firebase.auth().createUserWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
      .then(function(data) {
        $scope.loggedInUser = data;
        $scope.modal.hide();
        $scope.modal.remove();
      })
      .catch(function(error) {
        // Handle Errors here.
        console.error(`Error with Registration, ${error.code}: ${error.message}`);
      });
    };
  }
})

