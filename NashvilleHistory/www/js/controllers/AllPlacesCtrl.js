'use strict';

app.controller('AllPlacesCtrl', function($scope, $state, $q, AllPlacesFact, BookmarkFact, AuthFact){

  let HistoricalMarkers;
  let ArtMarkers;
  let CivilWarMarkers;
  $scope.artFilter = false;
  $scope.historicalFilter = false;
  $scope.civilWarFilter = false;

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
  
});
