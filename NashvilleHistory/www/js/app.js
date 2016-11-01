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
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
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

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/markers.html',
        controller: 'MarkersCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/markers');
});

