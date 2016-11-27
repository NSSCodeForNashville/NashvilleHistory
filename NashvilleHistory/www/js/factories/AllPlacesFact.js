'use strict';

app.factory("AllPlacesFact", ($q, $http, KeyGetter)=>{

  let NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  let GoogleAppToken = KeyGetter.googleMapsKey;

  // Removes all special characters from a string
  function parseSpecialCharacters(stringWithSpecialChars) {
    return stringWithSpecialChars.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  }

  let getAllHistoricalMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data.map(marker => {
          marker.title = parseSpecialCharacters(marker.title)
          return marker;
        }).filter((marker) => {
          if (marker.longitude) {
            return marker;
          }
        }));
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  let getAllArtInPublicPlacesMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/xakp-ess3.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data.map(marker => {
          if (marker.title) {
            marker.title = parseSpecialCharacters(marker.title);
          } else if (marker.artwork) {
            marker.artwork = parseSpecialCharacters(marker.artwork);
          }
          return marker;
        }).filter((marker) => {
          if (marker.longitude) {
            return marker;
          }
        }));
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  let getAllMetroPublicArtMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/pbc9-7sh6.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(data.map(marker => {
          if (marker.title) {
            marker.title = parseSpecialCharacters(marker.title);
          } else if (marker.artwork) {
            marker.artwork = parseSpecialCharacters(marker.artwork);
          }
          return marker;
        }).filter((marker) => {
          if (marker.longitude) {
            return marker;
          }
        }));
      })
      .error((err)=>{
        reject(err);
      })
    })
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
