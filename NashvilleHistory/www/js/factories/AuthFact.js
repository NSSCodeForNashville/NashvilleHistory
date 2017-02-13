'use strict';

app.factory("AuthFact", ($q, $http, KeyGetter)=>{

  let getUserId = ()=>{
    var user = firebase.auth().currentUser;
    if (user) {
      return user.uid
    } else {
      return null
    }
  };

  return {getUserId};

});
