'use strict';

app.controller('BookmarkCtrl', function($scope, $state, BookmarkFact) {

  $scope.Bookmarks = [];

  function getBookmarks () {
    BookmarkFact.getAllBookmarks()
    .then((bookmarks)=>{
      $scope.Bookmarks = bookmarks;
    })
  }
})
