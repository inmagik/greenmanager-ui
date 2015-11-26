(function(){
"use strict";

angular.module('app')
.controller('TerritoryNavCtrl', TerritoryNavCtrl);


function TerritoryNavCtrl($scope, $stateParams, $rootScope){
    $scope.territoryId = $stateParams.territoryId;
    
    $scope.edit = function(){
        $rootScope.$broadcast('TerritoryNavCtrl:edit');
    }

};


})();