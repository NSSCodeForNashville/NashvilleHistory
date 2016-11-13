'use strict';

app.factory("AllPlacesFact", ($q, $http, KeyGetter)=>{

  let NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  let GoogleAppToken = KeyGetter.googleMapsKey;

  let getAllHistoricalMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  let getAllArtInPublicPlacesMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/xakp-ess3.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  let getAllMetroPublicArtMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/pbc9-7sh6.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  // let getDistanceToMarker = (lat, long, markerLat, markerLong)=>{
  //   return $q((resolve, reject)=>{
  //     $http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${markerLat}%2C${markerLong}&key=${GoogleAppToken}`)
  //     .success((data)=>{
  //       resolve(data);
  //     })
  //     .error((err)=>{
  //       reject(err);
  //     })
  //   });
  // }

  return {getAllHistoricalMarkers, getAllArtInPublicPlacesMarkers, getAllMetroPublicArtMarkers};
});