'use strict';

app.factory("BookmarkFact", ($q, $http, KeyGetter, AuthFact)=>{

  let getAllBookmarks = (userId)=>{
    return $q((resolve, reject)=>{
      $http.get(`https://nashvillehistory-9a80d.firebaseio.com/bookmarks.json?orderBy="userId"&equalTo="${userId}"`)
      .success((bookmarks)=>{
        resolve(bookmarks);
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  let addBookmark = (bookmark)=>{
    return $q((resolve, reject)=>{
      $http.post("https://nashvillehistory-9a80d.firebaseio.com/bookmarks.json", angular.toJson(bookmark))
      .success((bookmarks)=>{
        resolve(bookmarks);
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  let deleteBookmark = (bookmarkId)=>{
    return $q((resolve, reject)=>{
      $http.delete(`https://nashvillehistory-9a80d.firebaseio.com/bookmarks/${bookmarkId}.json`)
      .success((data)=>{
        resolve(data);
      })
      .error((err)=>{
        reject(err);
      })
    })
  }

  return {getAllBookmarks, addBookmark, deleteBookmark};
});