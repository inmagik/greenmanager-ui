(function(){
"use strict";

angular.module('app.permissions', ['permission', 'satellizer'])


.run(function (Permission, $rootScope, $auth) {

  // Define anonymous role
  /*
  Permission.defineRole('anonymous', function (stateParams) {
    // If the returned value is *truthy* then the user has the role, otherwise they don't
    if (!$rootScope.user) {
      return true; // Is anonymous
    }
    return false;
  });
    */

  Permission.defineRole('logged', function (stateParams) {
    // If the returned value is *truthy* then the user has the role, otherwise they don't
    return $auth.isAuthenticated()
  });

});

})();