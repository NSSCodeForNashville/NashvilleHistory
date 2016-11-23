'use strict';

app.factory("MarkerCardsFact", ($q, $http, KeyGetter)=>{

  const NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  const GoogleAppToken = KeyGetter.googleMapsKey;

  const getHistoricalMarkersInRadius = (lat, long, radius)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$where=within_circle(mapped_location, ${lat}, ${long}, ${radius})&$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  const getArtInPublicPlacesMarkersInRadius = (lat, long, radius)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/xakp-ess3.json?$where=within_circle(mapped_location, ${lat}, ${long}, ${radius})&$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  const getMetroPublicArtMarkersInRadius = (lat, long, radius)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/pbc9-7sh6.json?$where=within_circle(mapped_location, ${lat}, ${long}, ${radius})&$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        resolve(filterMarkers(data));
      })
      .error((err)=>{
        reject(err);
      })
    });
  }

  const filterMarkers = (markers)=>{
    return markers.map((marker)=>{
      const newMarker = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        civil_war_site: marker.civil_war_site ? true : false,
        description: marker.description ? marker.description : marker.marker_text,
        medium: marker.medium ? marker.medium : "",
        //Add a stock photo for historical markers here if wanted
        image: marker.photo_link ? marker.photo_link : "",
        artistName: marker.first_name ? marker.first_name + " " + marker.last_name : ""
      }
      if (marker.title){
        newMarker.markerType = "historic";
        newMarker.title = titleFormat(marker.title);
      } else if (marker.artwork) {
        newMarker.markerType = "metroArt";
        newMarker.title = titleFormat(marker.artwork);
      } else {
        newMarker.markerType = "publicArt";
        newMarker.title = titleFormat(marker.type);
      }
      return newMarker;
    })
  }

  // Normalizes all marker titles. The beginning of each word will be capitalized
  // Need to work out some edge cases like "YMCA"
  const titleFormat = (string) => {
    let str = string.toLowerCase().split(' ');
    for(var i = 0; i < str.length; i++){
      str[i] = str[i].split('');
      // Checks to see whether the first char of a word is a parentheses or bracket
      if (str[i][0] != "(" && str[i][0] != "[" )
      {
        str[i][0] = str[i][0].toUpperCase();
      } else {
        str[i][1] = str[i][1].toUpperCase();
      }
      str[i] = str[i].join('');
    }
    return str.join(' ');
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

  return {getHistoricalMarkersInRadius, getArtInPublicPlacesMarkersInRadius, getMetroPublicArtMarkersInRadius, calculateDistanceToMarker, filterMarkers};
});
