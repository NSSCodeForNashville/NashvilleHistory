'use strict';

app.controller('AllPlacesCtrl', function($scope, $state, $q, AllPlacesFact){

  let AllPlaces;
  let HistoricalMarkers;
  let ArtMarkers;
  let CivilWarMarkers;
  $scope.artFilter = false;
  $scope.historicalFilter = false;
  $scope.civilWarFilter = false;
  //The purpose of this function is to get all of the markers, art and historical, from the Nashville Gov API and place them in one array.
  function getAllPlaces(){
    return $q.all(
      [AllPlacesFact.getAllHistoricalMarkers(),
      AllPlacesFact.getAllArtInPublicPlacesMarkers(),
      AllPlacesFact.getAllMetroPublicArtMarkers()]
    )
    .then((data)=>{
      AllPlaces = data[0].concat(data[1]).concat(data[2]);
      console.log("All places", AllPlaces);
      $scope.MarkerCards = AllPlaces;
    })
  }

  getAllPlaces();

  $scope.filterArt = ()=>{
    $scope.artFilter = !$scope.artFilter;
    $scope.historicalFilter = false;
    $scope.civilWarFilter = false;
    if ($scope.artFilter){
      ArtMarkers = AllPlaces.filter((marker)=>{
        if (marker.artwork || marker.description || marker.medium) {
          return marker;
        }
      });
    $scope.MarkerCards = ArtMarkers;
    } else {
      $scope.MarkerCards = AllPlaces;
    }
  }

  $scope.filterHistorical = ()=>{
    $scope.historicalFilter = !$scope.historicalFilter;
    $scope.artFilter = false;
    $scope.civilWarFilter = false;
    if ($scope.historicalFilter){
      HistoricalMarkers = AllPlaces.filter((marker)=>{
        if (marker.marker_text) {
          return marker;
        }
      });
      $scope.MarkerCards = HistoricalMarkers;
    } else {
      $scope.MarkerCards = AllPlaces;
    }
  }

  $scope.filterCivilWar = ()=>{
    $scope.civilWarFilter = !$scope.civilWarFilter;
    $scope.historicalFilter = false;
    $scope.artFilter = false;
    if ($scope.civilWarFilter){
      CivilWarMarkers = AllPlaces.filter((marker)=>{
        if (marker.civil_war_site === "X") {
          return marker;
        }
      });
      $scope.MarkerCards = CivilWarMarkers;
    } else {
      $scope.MarkerCards = AllPlaces;
    }
  }

});
