'use strict';

app.factory("AllPlacesFact", ($q, $http, KeyGetter, MarkerCardsFact)=>{

  let NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  let GoogleAppToken = KeyGetter.googleMapsKey;

  const getAllHistoricalMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(MarkerCardsFact.filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  const getAllArtInPublicPlacesMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/xakp-ess3.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(MarkerCardsFact.filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  const getAllMetroPublicArtMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/pbc9-7sh6.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(MarkerCardsFact.filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    });
  }


  return {getAllHistoricalMarkers, getAllArtInPublicPlacesMarkers, getAllMetroPublicArtMarkers};
});