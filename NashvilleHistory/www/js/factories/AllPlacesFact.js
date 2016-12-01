'use strict';

app.factory("AllPlacesFact", ($q, $http, KeyGetter, MarkerCardsFact)=>{

  let NashvilleGovAppToken = KeyGetter.historicMarkersKey;
  let GoogleAppToken = KeyGetter.googleMapsKey;

  let getAllHistoricalMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        let filteredMarkers = filterMarkers(data.filter((marker) => {
          if (marker.longitude) {
            return marker;
          }}))
        resolve(filteredMarkers);
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  const getAllArtInPublicPlacesMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/xakp-ess3.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        let filteredMarkers = filterMarkers(data.filter((marker) => {
          if (marker.longitude) {
            return marker;
          }}))
        resolve(filteredMarkers);
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  const getAllMetroPublicArtMarkers = ()=>{
    return $q((resolve, reject)=>{
      $http.get(`https://data.nashville.gov/resource/pbc9-7sh6.json?$$app_token=${NashvilleGovAppToken}`)
      .success((data)=>{
        let filteredMarkers = filterMarkers(data.filter((marker) => {
          if (marker.longitude) {
            return marker;
          }}))
        resolve(filteredMarkers);
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  function generateUID(element) {
    // Generate a UID property on each marker: Title + Marker Lat + Marker Long, strip periods and minuses
    return element.title.concat(element.latitude).concat(element.longitude).replace(/\-|\./g,"");
  }

  function filterMarkers(markers) {
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
      newMarker.uid = generateUID(newMarker);
      return newMarker;
    })
  }

  // Normalizes all marker titles. The beginning of each word will be capitalized
  // Need to work out some edge cases like "YMCA"
  function titleFormat(string) {
    let filteredString = string.replace(/[`~@#$%^*()_|+\-=;:'",.<>\{\}\[\]\\\/]/gi, '').replace("  "," ");
    let str = filteredString.toLowerCase().split(' ');
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


  return {getAllHistoricalMarkers, getAllArtInPublicPlacesMarkers, getAllMetroPublicArtMarkers};
});
