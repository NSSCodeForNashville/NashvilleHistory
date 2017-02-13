'use strict';

app.controller('BookmarkCtrl', function($scope, $state, BookmarkFact, AuthFact) {

  $scope.Bookmarks = [];

  function getBookmarks () {
    BookmarkFact.getAllBookmarks(AuthFact.getUserId())
    .then((bookmarks)=>{
      $scope.Bookmarks = [];
      Object.keys(bookmarks).forEach((key)=>{
        bookmarks[key].fbKey = key;
        $scope.Bookmarks.push(bookmarks[key])
      });
    })
  }

  if (AuthFact.getUserId()) {
    getBookmarks();
  } else {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        getBookmarks();
      }
    })
  }

  $scope.RemoveBookmark = (bookmark)=>{
    BookmarkFact.deleteBookmark(bookmark.fbKey)
    .then((data)=>{
      //Reloads Bookmarks
      getBookmarks();
    })
  }
})
