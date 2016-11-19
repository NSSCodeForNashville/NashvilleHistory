'use strict';

app.controller('BookmarkCtrl', function($scope, $state, BookmarkFact) {

  $scope.Bookmarks = {};

  function getBookmarks () {
    BookmarkFact.getAllBookmarks()
    .then((bookmarks)=>{
      console.log("bookmarks", bookmarks);
      $scope.Bookmarks = bookmarks;
    })
  }

  getBookmarks();
})
