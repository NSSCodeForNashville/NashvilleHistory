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
      AllPlaces = AllPlaces.sort(sortAllPlaces);
      console.log("All places", AllPlaces);
      $scope.MarkerCards = AllPlaces;
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

  //The purpose of the following filter functions is to create a new array with only the type of marker that the user selected.
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
      $scope.MarkerCards = ArtMarkers.sort(sortAllPlaces);
    } else {
      $scope.MarkerCards = AllPlaces.sort(sortAllPlaces);
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
      $scope.MarkerCards = HistoricalMarkers.sort(sortAllPlaces);
    } else {
      $scope.MarkerCards = AllPlaces.sort(sortAllPlaces);
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
      $scope.MarkerCards = CivilWarMarkers.sort(sortAllPlaces);
    } else {
      $scope.MarkerCards = AllPlaces.sort(sortAllPlaces);
    }
  }

});
