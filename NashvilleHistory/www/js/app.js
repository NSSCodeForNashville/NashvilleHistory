// Configure app-wide services here
var app = angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'ngCordova'])

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

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, KeyGetter) {
  // Angular Maps Configuration
  uiGmapGoogleMapApiProvider.configure({
      key: KeyGetter.googleMapsKey,
      v: '3.24',
      libraries: 'weather,geometry,visualization,places'
  })

  // ROUTING (works like $routeProvider)
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

