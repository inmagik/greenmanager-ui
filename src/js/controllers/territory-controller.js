(function(){
"use strict";

angular.module('app')
.controller('TerritoryCtrl', TerritoryCtrl);

function createLatLongs(arr){
    return _.map(arr, function(u){ return { lat: u[0], lng:u[1]}});
}

function TerritoryCtrl($scope, $stateParams, DataService, leafletData, $timeout){
    console.log(DataService.territory)
    $scope.paths = {};
    DataService.territory.one($stateParams.territoryId).get()
    .then(function(territory){
        $scope.territory = territory;    
        console.log("got territory...", $scope.territory)
        $timeout(function(){
            $scope.paths = {
                "territory" : {
                    type : "polygon",
                    latlngs : createLatLongs($scope.territory.geom.coordinates[0]),
                    weight: 1,
                    fill: false
                 }
                
            }
            console.log(100, $scope.paths)
            $scope.centerJSON()
        });
        
    });

    $scope.centerJSON = function() {
        leafletData.getMap().then(function(map) {
            var latlngs = _.flatten($scope.territory.geom.coordinates)

            map.fitBounds(latlngs);
        });
    };

};


})();