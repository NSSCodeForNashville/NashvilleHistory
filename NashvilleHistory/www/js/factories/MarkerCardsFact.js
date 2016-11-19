'use strict';

app.factory("MarkerCardsFact", ($q, $http, KeyGetter)=>{

  let NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  let GoogleAppToken = KeyGetter.googleMapsKey;

  let getHistoricalMarkersInRadius = (lat, long, radius)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$where=within_circle(mapped_location, ${lat}, ${long}, ${radius})&$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  let getArtInPublicPlacesMarkersInRadius = (lat, long, radius)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/xakp-ess3.json?$where=within_circle(mapped_location, ${lat}, ${long}, ${radius})&$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  let getMetroPublicArtMarkersInRadius = (lat, long, radius)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/pbc9-7sh6.json?$where=within_circle(mapped_location, ${lat}, ${long}, ${radius})&$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  let getDistanceToMarker = (lat, long, markerLat, markerLong)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${markerLat}%2C${markerLong}&key=${GoogleAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  return {getHistoricalMarkersInRadius, getArtInPublicPlacesMarkersInRadius, getMetroPublicArtMarkersInRadius, getDistanceToMarker};
});