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
        // If Google API errors out, calculate distance manually
        if (data.error_message) {
          console.log("using manual distance");
          let distance = calculateDistanceToMarker(lat, long, markerLat, markerLong);
          resolve(distance);
        } else {
          resolve(data);
        }
      })
      .error((err)=>{
        console.error(error);
        reject(error);
      })
    });
  }

  function calculateDistanceToMarker(lat1, lon1, lat2, lon2){
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians((lat2-lat1));
    var Δλ = toRadians((lon2-lon1));

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return getMiles(d).toPrecision(2);
  }

  function toRadians(x) {
    return x * Math.PI / 180;
  }

  // Converts meters to miles
  function getMiles(i) {
   return i*0.000621371192;
  }

  return {getHistoricalMarkersInRadius, getArtInPublicPlacesMarkersInRadius, getMetroPublicArtMarkersInRadius, getDistanceToMarker};
});
