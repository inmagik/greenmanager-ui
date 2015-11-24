(function(){
"use strict";

angular.module('app')
.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, DataService){

    DataService.territory.getList()
    .then(function(territories){
        $scope.territories = territories;    
        console.log("got territories...", $scope.territories)
    });

};


})();