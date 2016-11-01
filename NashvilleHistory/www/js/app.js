// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'ngCordova'])
.constant("FirebaseURL", "https://www.gstatic.com/firebasejs/3.5.2/firebase.js")

.config(function(uiGmapGoogleMapApiProvider, KeyGetter) {
  uiGmapGoogleMapApiProvider.configure({
      key: KeyGetter.googleMapsKey,
      v: '3.24',
      libraries: 'weather,geometry,visualization,places'
  })
})

.run(function($ionicPlatform, KeyGetter) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  let creds = KeyGetter;
  let authConfig = {
    apiKey: creds.apiKey,
    authDomain: creds.authDomain,
    databaseURL: creds.databaseURL
  }
  firebase.initializeApp(authConfig);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.allPieces', {
      url: '/all',
      views: {
        'menuContent': {
          templateUrl: 'templates/all-pieces.html',
          controller: 'AllPiecesCtrl'
        }
      }
    })
  .state('app.markers', {
    url: '/markers',
    views: {
      'menuContent': {
        templateUrl: 'templates/markers.html',
        controller: 'MarkersCtrl'
      }
    }
  })
  .state('app.guidedTours', {
    url: '/guided-tours',
    views: {
      'menuContent': {
        templateUrl: 'templates/guided-tours.html',
        controller: 'ToursCtrl'
      }
    }
  })
  .state('app.contribute', {
    url: '/contribute',
    views: {
      'menuContent': {
        templateUrl: 'templates/contribute.html',
        controller: 'ContributeCtrl'
      }
    }
  })
  .state('app.myTours', {
    url: '/my-tours',
    views: {
      'menuContent': {
        templateUrl: 'templates/my-tours.html',
        controller: 'ToursCtrl'
      }
    }
  })
  .state('app.bookmarks', {
    url: '/bookmarks',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarks.html',
        controller: 'BookmarkCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/markers');
});

