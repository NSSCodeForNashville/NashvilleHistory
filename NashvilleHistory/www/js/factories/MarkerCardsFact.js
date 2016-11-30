'use strict';

app.factory("MarkerCardsFact", ($q, $http, KeyGetter)=>{

  const NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  const GoogleAppToken = KeyGetter.googleMapsKey;

  let getManualDistanceToMarker = (lat, long, markerLat, markerLong)=>{
    return $q((resolve, reject)=>{
        let distance = calculateDistanceToMarker(lat, long, markerLat, markerLong);
        resolve(distance);
      })
    };


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
  // Haversine formula, source: http://www.movable-type.co.uk/scripts/latlong.html
  // where  φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
  // note that angles need to be in radians to pass to trig functions
  const calculateDistanceToMarker = (lat1, lon1, lat2, lon2)=>{
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

  return {getDistanceToMarker, getManualDistanceToMarker};
});
