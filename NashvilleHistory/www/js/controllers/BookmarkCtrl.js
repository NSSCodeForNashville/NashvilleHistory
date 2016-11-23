'use strict';

app.controller('BookmarkCtrl', function($scope, $state, BookmarkFact, AuthFact) {

  $scope.Bookmarks = {};

  function getBookmarks () {
    BookmarkFact.getAllBookmarks(AuthFact.getUserId())
    .then((bookmarks)=>{
      Object.keys(bookmarks).forEach((key)=>{
        bookmarks[key].fbKey = key;
      });
      $scope.Bookmarks = bookmarks;
    })
  }
  getBookmarks();

  $scope.RemoveBookmark = (bookmark)=>{
    BookmarkFact.deleteBookmark(bookmark.fbKey)
    .then((data)=>{
      //Reloads Bookmarks
      getBookmarks();
    })
  }
})
