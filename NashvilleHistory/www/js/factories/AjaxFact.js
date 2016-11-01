"use strict";

app.factory('AjaxFact', function(KeyGetter,$q,$http) {

let getHistoricalMarkers = () => {
    return $q((resolve,reject) => {
      $http.get("https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=" + KeyGetter.historicalMarkerAppToken)
        .then((data) => {
            resolve(data);
          }, (error) => {
            console.error(error);
            reject(error);
          }
        );
    });
  };

  return {getHistoricalMarkers};
});
