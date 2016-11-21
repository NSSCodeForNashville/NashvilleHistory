'use strict';

app.factory("AuthFact", ($q, $http, KeyGetter)=>{

  let getUserId = ()=>{
    return firebase.auth().currentUser.uid;
  };

  return {getUserId};

});
