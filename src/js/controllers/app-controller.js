(function(){
"use strict";

angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $auth, $rootScope, $state){
    
    $scope.logged = $auth.isAuthenticated();
    $scope.$on("loginSuccess", function(){
        $scope.logged = true;
    })
    
    
    $scope.logout = function(){
        $auth.logout()
        $rootScope.$broadcast("logoutSuccess");
        $scope.logged = false;
    };

};


})();