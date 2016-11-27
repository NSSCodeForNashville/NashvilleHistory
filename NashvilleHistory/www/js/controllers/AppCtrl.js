"use strict";

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $q, CustomTourFact, AllPlacesFact) {

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
      $scope.AllPlaces.forEach(generateUID);
      console.log("All places", $scope.AllPlaces);
      $scope.MarkerCards = $scope.AllPlaces;
    });
  }

  function generateUID(element, index) {
      // Generate a UID property on each marker: Marker Lat + Marker Long + First Word in Title, strip periods and minuses
      if ($scope.AllPlaces[index].title) {
        $scope.AllPlaces[index].title = $scope.AllPlaces[index].title.replace(/\[|\]/g,'');
        $scope.AllPlaces[index].uid = ($scope.AllPlaces[index].title.match(/^([\w\-]+)/)[0] + $scope.AllPlaces[index].latitude + $scope.AllPlaces[index].longitude).replace(/\-|\./g,"")
      } else if ($scope.AllPlaces[index].artwork) {
        $scope.AllPlaces[index].uid = ($scope.AllPlaces[index].artwork.match(/^([\w\-]+)/)[0] + $scope.AllPlaces[index].latitude + $scope.AllPlaces[index].longitude).replace(/\-|\./g,"")
      }
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
    } else {
      $scope.loggedInUser = null;
    }
    console.log("Current Logged In User", $scope.loggedInUser)
  });

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

