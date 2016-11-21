'use strict';

app.controller('BookmarkCtrl', function($scope, $state, BookmarkFact, AuthFact) {

  $scope.Bookmarks = {};

  function getBookmarks () {
    BookmarkFact.getAllBookmarks(AuthFact.getUserId())
    .then((bookmarks)=>{
      console.log("bookmarks", bookmarks);
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
      console.log("successfully deleted");
      /**TODO: remove the DOM node**/
    })
  }
})
