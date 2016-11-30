'use strict';

app.controller('AllPlacesCtrl', function($scope, $state, $q, AllPlacesFact, BookmarkFact, AuthFact){

  let AllPlaces;
  let HistoricalMarkers;
  let ArtMarkers;
  let CivilWarMarkers;
  let AllMarkers;
  $scope.artFilter = false;
  $scope.historicalFilter = false;
  $scope.civilWarFilter = false;
  // Auto-Login Handler
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
  //The purpose of this function is to get all of the markers, art and historical, from the Nashville Gov API and place them in one array.
  function getAllPlaces(){
    return $q.all(
      [AllPlacesFact.getAllHistoricalMarkers(),
      AllPlacesFact.getAllArtInPublicPlacesMarkers(),
      AllPlacesFact.getAllMetroPublicArtMarkers()]
    )
    .then((data)=>{
      AllMarkers = data[0].concat(data[1]).concat(data[2]);
      AllMarkers = AllMarkers.sort(sortAllPlaces);
      $scope.MarkerCards = AllMarkers;
    });
  }

  function sortAllPlaces(x, y) {
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

  getAllPlaces();


  function areMarkersBookmarked (){
      BookmarkFact.getAllBookmarks(AuthFact.getUserId())
      .then((bookmarks)=>{
        console.log("bookmarked markers", bookmarks);
        Object.keys(bookmarks).map((key)=>{
          AllMarkers.forEach((marker, index)=>{
            if (bookmarks[key].latitude === marker.latitude && bookmarks[key].longitude === marker.longitude){
              AllMarkers[index].isBookmarked = true;
            }
          })
        })
      })
      $scope.MarkerCards = AllMarkers;
    }

  //The purpose of the following filter functions is to create a new array with only the type of marker that the user selected.
  $scope.filterArt = ()=>{
    $scope.artFilter = !$scope.artFilter;
    $scope.historicalFilter = false;
    $scope.civilWarFilter = false;
    if ($scope.artFilter){
      ArtMarkers = AllMarkers.filter((marker)=>{
        if (marker.markerType === "publicArt" || marker.markerType === "metroArt") {
          return marker;
        }
      });
      $scope.MarkerCards = ArtMarkers.sort(sortArtPlaces);
    } else {
      $scope.MarkerCards = AllMarkers.sort(sortAllPlaces);
    }
  }

  $scope.filterHistorical = ()=>{
    $scope.historicalFilter = !$scope.historicalFilter;
    $scope.artFilter = false;
    $scope.civilWarFilter = false;
    if ($scope.historicalFilter){
      HistoricalMarkers = AllMarkers.filter((marker)=>{
        if (marker.markerType === 'historic') {
          return marker;
        }
      });
      $scope.MarkerCards = HistoricalMarkers.sort(sortAllPlaces);
    } else {
      $scope.MarkerCards = AllMarkers.sort(sortAllPlaces);
    }
  }

  $scope.filterCivilWar = ()=>{
    $scope.civilWarFilter = !$scope.civilWarFilter;
    $scope.historicalFilter = false;
    $scope.artFilter = false;
    if ($scope.civilWarFilter){
      CivilWarMarkers = AllMarkers.filter((marker)=>{
        if (marker.civil_war_site) {
          return marker;
        }
      });
      $scope.MarkerCards = CivilWarMarkers.sort(sortAllPlaces);
    } else {
      $scope.MarkerCards = AllMarkers.sort(sortAllPlaces);
    }
  }

  $scope.AddToBookmarks = (marker, index)=>{
      marker.uid = AuthFact.getUserId();
      $scope.MarkerCards[index].isBookmarked = true;
      BookmarkFact.addBookmark(marker)
  }

  $scope.AddToRoute = (marker)=>{
    console.log("clicked add to route");
  }

});
