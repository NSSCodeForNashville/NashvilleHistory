'use strict';

app.factory("BookmarkFact", ($q, $http, KeyGetter)=>{

  let getAllBookmarks = ()=>{
    return $q((resolve, reject)=>{
      $http.get("https://nashvillehistory-9a80d.firebaseio.com/bookmarks.json")
    })
    .success((bookmarks)=>{
      resolve(bookmarks);
    })
    .error((err)=>{
      reject(err);
    })
  }

  let addBookmark = (bookmark)=>{
    return $q((resolve, reject)=>{
      $http.post("https://nashvillehistory-9a80d.firebaseio.com/bookmarks.json", angular.toJson(bookmark))
    })
    .success((bookmarks)=>{
      resolve(bookmarks);
    })
    .error((err)=>{
      reject(err);
    })
  }

  return {getAllBookmarks, addBookmark};
});