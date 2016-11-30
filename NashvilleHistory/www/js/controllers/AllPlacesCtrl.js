'use strict';

app.controller('AllPlacesCtrl', function($scope, $state, $q, AllPlacesFact, BookmarkFact, AuthFact){

  let HistoricalMarkers;
  let ArtMarkers;
  let CivilWarMarkers;
  let AllMarkers;
  $scope.artFilter = false;
  $scope.historicalFilter = false;
  $scope.civilWarFilter = false;


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
      ArtMarkers = $scope.$parent.AllPlaces.filter((marker)=>{
        if (marker.markerType == "metroArt" || marker.markerType == "publicArt") {
          return marker;
        }
      });
      $scope.$parent.MarkerCards = ArtMarkers.sort($scope.$parent.sortAllPlaces);
    } else {
      $scope.$parent.MarkerCards = $scope.$parent.AllPlaces.sort($scope.$parent.sortAllPlaces);
    }
  }

  $scope.filterHistorical = ()=>{
    $scope.historicalFilter = !$scope.historicalFilter;
    $scope.artFilter = false;
    $scope.civilWarFilter = false;
    if ($scope.historicalFilter){
      HistoricalMarkers = $scope.$parent.AllPlaces.filter((marker)=>{
        if (marker.markerType == "historic") {
          return marker;
        }
      });
      $scope.$parent.MarkerCards = HistoricalMarkers.sort($scope.$parent.sortAllPlaces);
    } else {
      $scope.$parent.MarkerCards = $scope.$parent.AllPlaces.sort($scope.$parent.sortAllPlaces);
    }
  }

  $scope.filterCivilWar = ()=>{
    $scope.civilWarFilter = !$scope.civilWarFilter;
    $scope.historicalFilter = false;
    $scope.artFilter = false;
    if ($scope.civilWarFilter){
      CivilWarMarkers = $scope.$parent.AllPlaces.filter((marker)=>{
        if (marker.civil_war_site) {
          return marker;
        }
      });
      $scope.$parent.MarkerCards = CivilWarMarkers.sort($scope.$parent.sortAllPlaces);
    } else {
      $scope.$parent.MarkerCards = $scope.$parent.AllPlaces.sort($scope.$parent.sortAllPlaces);
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
