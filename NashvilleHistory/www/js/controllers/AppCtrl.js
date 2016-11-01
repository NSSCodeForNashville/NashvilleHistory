"use strict";

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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

  // Google Login
  $scope.google = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(`Logged In User: ${user}`);
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
    console.log('Doing login', $scope.loginData);
    firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
    .then(function(data) {
      console.log(`Logged In User: ${data}`);
      $scope.modal.hide();
      $scope.modal.remove();
    })
    .catch(function(error) {
      console.error(`Error with Registration, ${error.code}: ${error.message}`);
    });
  };

  // Firebase Registration with Email and Password
  $scope.doRegistration = function() {
    if ($scope.loginData.password !== $scope.loginData.passwordConfirmation) {
      console.error("Passwords do not match.")
    } else {
      console.log('Doing registration', $scope.loginData);
      firebase.auth().createUserWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
      .then(function(data) {
        console.log(`Logged In User: ${data}`);
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

