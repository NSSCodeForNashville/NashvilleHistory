'use strict';

app.controller('ToursCtrl', function($scope, $state, $rootScope, CustomTourFact) {

    // Listen for changes in State
    $rootScope.$on('$stateChangeSuccess', function(event, toState){
        if ($state.current.name == "app.editMyTour") {
            updateTourMarkers();
        }
    })

    $scope.deletePlace = (uid, index) => {
        // Remove card from Markers and resolve Order updates
        $scope.$parent.MarkerCards.splice(index,1);
        $scope.$parent.MarkerCards.forEach((element, i) => {
            console.log(i, index);
            if (i >= index) {
                $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[element.uid].order -= 1
            }
        })
        // Delete card from loggedInUser object
        delete $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[uid];
        // Delete card from Firebase
        CustomTourFact.updatePlaces($state.params.tourId,$scope.$parent.loggedInUser.customTours[$state.params.tourId])
    }

    $scope.increaseOrder = (uid, index) => {
        // Resolve Order updates
        $scope.$parent.MarkerCards.forEach((element, i) => {
            if (i != 0 && i == index - 1) {
                $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[element.uid].order += 1
            }
        })
        $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[uid].order -= 1;
        // Update tours object on Firebase
        CustomTourFact.updatePlaces($state.params.tourId,$scope.$parent.loggedInUser.customTours[$state.params.tourId])
        updateTourMarkers();
    }

    $scope.decreaseOrder = (uid, index) => {
        // Resolve Order updates
        $scope.$parent.MarkerCards.forEach((element, i) => {
            if (i > index) {
                $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[element.uid].order -= 1
            }
        })
        $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[uid].order += 1;
        // Update tours object on Firebase
        CustomTourFact.updatePlaces($state.params.tourId,$scope.$parent.loggedInUser.customTours[$state.params.tourId])
        updateTourMarkers();
    }

    function updateTourMarkers() {
        let places = $scope.$parent.loggedInUser.customTours[$state.params.tourId].places;
        $scope.$parent.MarkerCards = $scope.$parent.AllPlaces.filter((element,index) => {
            if (places[element.uid]) {
                var orderedMarker = $scope.$parent.AllPlaces[index];
                orderedMarker.order = places[element.uid].order;
                return orderedMarker;
            }
        })
        sortMarkersByOrder();
    }

    function sortMarkersByOrder(){
      $scope.$parent.MarkerCards = sortByKey($scope.$parent.MarkerCards, "order");
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

})
