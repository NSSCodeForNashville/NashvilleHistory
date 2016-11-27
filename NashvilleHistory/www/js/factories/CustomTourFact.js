'use strict';

app.factory("CustomTourFact", ($q, $http, KeyGetter)=>{

  let pushNewTour = (tourObj) => {
    return $q((resolve,reject) => {
      $http.post(`${KeyGetter.databaseURL}/tours.json`,JSON.stringify(tourObj))
        .then((response) => {
          resolve(response.data.name);
        }, (error) => {
          console.error(error);
          reject(error);
        })
    })
  }

  let retrieveCustomTours = (userId) => {
    return $q((resolve,reject) => {
      $http.get(`${KeyGetter.databaseURL}/tours.json?orderBy="userId"&equalTo="${userId}"`)
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          console.error(error);
          reject(error.data);
        })
    })
  }

  let putNewPlace = (tourId,placeId, placeObj) => {
    return $q((resolve,reject) => {
      $http.put(`${KeyGetter.databaseURL}/tours/${tourId}/places/${placeId}.json`,JSON.stringify(placeObj))
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          console.error(error);
          reject(error.data);
        })
    })
  }

  let updatePlaces = (tourId,tourObj) => {
    return $q((resolve,reject) => {
      $http.put(`${KeyGetter.databaseURL}/tours/${tourId}.json`,JSON.stringify(tourObj))
        .then((response) => {
          resolve(response);
        }, (error) => {
          console.error(error);
          reject(error);
        })
    })
  }

    return {pushNewTour, retrieveCustomTours, putNewPlace, updatePlaces};
});