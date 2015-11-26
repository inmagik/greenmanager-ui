(function(){
"use strict";

angular.module('app')
.controller('TerritoryEditCtrl', TerritoryEditCtrl);

function createLatLongs(arr){
    return _.map(arr, function(u){ return { lat: u[0], lng:u[1]}});
}

function TerritoryEditCtrl($scope, $state, DataService,leafletData,  MapService, $timeout, Restangular, territory){
    $scope.territory = territory;    

    $scope.saveTerritory = function(){
        var out = $scope.territory.save();
        out.then(function(){
            $state.go("app.territory", { territoryId : territory.id })
        })
        return out;
    };

    function removeDeleted(e){
        
        MapService.removeLayersFromMap(e.layers);
        $scope.territory.geom = null;
        addDrawControl()
    
    }

    function onCreated(e){
        $scope.territory.geom = e.layer.toGeoJSON().geometry;
        $scope.map.addLayer(e.layer)
        drawCtrl.removeFrom($scope.map);
        $scope.map.off('draw:created');
        drawCtrl = null;
    }

    leafletData.getMap()
    .then(function(map){
        $scope.map = map;
        map.on('draw:deleted', removeDeleted);
    });

    var drawCtrl;
    var addDrawControl = function(){
        drawCtrl = new L.Control.Draw({
            draw : { polygon:true, circle:false },
            edit : false
        });
        drawCtrl.addTo($scope.map)
        $scope.map.on('draw:created', onCreated);
        
    };

    $scope.$on("$destroy", function(){
        $scope.map.off('draw:created', onCreated);
        $scope.map.off('draw:deleted', removeDeleted);
        if(drawCtrl){
            drawCtrl.removeFrom($scope.map);
        }
    });


};


})();