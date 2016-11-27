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
        // If button was clicked on first place in list, do nothing
        if (index != 0) {
            $scope.$parent.MarkerCards.forEach((element, i) => {
                // Find the element that was ahead and adjust its order down one
                if (i == index - 1) {
                    $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[element.uid].order += 1
                }
            })
            // Move the clicked element's order up one
            $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[uid].order -= 1;
            // Update tours object on Firebase
            CustomTourFact.updatePlaces($state.params.tourId,$scope.$parent.loggedInUser.customTours[$state.params.tourId])
            // Redisplay MarkerCards based on new order
            updateTourMarkers();
        }
    }

    $scope.decreaseOrder = (uid, index) => {
        // If button was clicked on last place in list, do nothing
        if (index != Object.keys($scope.$parent.loggedInUser.customTours[$state.params.tourId].places).length - 1) {
            $scope.$parent.MarkerCards.forEach((element, i) => {
                // Find the element that was behind and adjust its order up one
                if (i == index + 1) {
                    $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[element.uid].order -= 1
                }
            })
            // Move the clicked element's order down one
            $scope.$parent.loggedInUser.customTours[$state.params.tourId].places[uid].order += 1;
            // Update tours object on Firebase
            CustomTourFact.updatePlaces($state.params.tourId,$scope.$parent.loggedInUser.customTours[$state.params.tourId])
            // Redisplay MarkerCards based on new order
            updateTourMarkers();
        }
    }

    function updateTourMarkers() {
        // Grab all places on this tour
        let places = $scope.$parent.loggedInUser.customTours[$state.params.tourId].places;
        // Add an order property to MarkerCards on scope for sorting later
        $scope.$parent.MarkerCards = $scope.$parent.AllPlaces.filter((element,index) => {
            if (places[element.uid]) {
                var orderedMarker = $scope.$parent.AllPlaces[index];
                orderedMarker.order = places[element.uid].order;
                return orderedMarker;
            }
        })
        // Sort MarkerCards according to the order property
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
