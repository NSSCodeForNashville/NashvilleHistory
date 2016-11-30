'use strict';

app.factory("AllPlacesFact", ($q, $http, KeyGetter, MarkerCardsFact)=>{

  let NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  let GoogleAppToken = KeyGetter.googleMapsKey;

  // Removes all special characters from a string
  function parseSpecialCharacters(stringWithSpecialChars) {
    return stringWithSpecialChars.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  }
  const getAllHistoricalMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(MarkerCardsFact.filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    })
    .then((markers) => {
      return markers.map(marker => {
        marker.title = parseSpecialCharacters(marker.title)
        return marker;
      });
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
    })
    .then((artMarkers) => {
      return artMarkers;
      return artMarkers.map(marker => {
          marker.title = parseSpecialCharacters(marker.title);
        return marker;
      });
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
    })
    .then((metroMarkers) => {
      console.log('Metro markers:', metroMarkers);
      return metroMarkers.map(marker => {
          marker.title = parseSpecialCharacters(marker.title);
        return marker;
      });
    });
  }


  return {getAllHistoricalMarkers, getAllArtInPublicPlacesMarkers, getAllMetroPublicArtMarkers};
});
