(function(){
"use strict";

angular.module('app')
.controller('TerritoryCtrl', TerritoryCtrl);

function createLatLongs(arr){
    return _.map(arr, function(u){ return { lat: u[0], lng:u[1]}});
}

function TerritoryCtrl($scope, $stateParams, DataService, leafletData, $timeout){
    
    $scope.paths = {};
    $scope.ui = { side : true, editingTerritory : false, dirty : false };


    var drawnItems = new L.FeatureGroup();
    
    leafletData.getMap().then(function (map) {
        $scope.map = map;
        drawnItems.addTo(map);

        map.on('draw:edited', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {
                $scope.territory.geom = layer.toGeoJSON().geometry;
                $scope.ui.dirty = true;
                $scope.territory.save()

            });
        });

    });
    
    var drawControl = new L.Control.Draw({
        draw : false,
        edit : {
            featureGroup : drawnItems
        }
    });
    
    var addTerritory = function(){
        L.geoJson($scope.territory.geom, {
            style: function(feature) {
                return {
                    color: 'red',
                    fill : false

                };
            },
            onEachFeature: function (feature, layer) {
                drawnItems.addLayer(layer);
            }
        });
    };

    var centerJSON = function() {
        leafletData.getMap().then(function(map) {
            var latlngs = _.map($scope.territory.geom.coordinates[0], function(x){ return [x[1], x[0]]});
            map.fitBounds(latlngs);
        });
    };

    $scope.toggleEdit = function(){

        if($scope.ui.editingTerritory){
            drawControl.removeFrom($scope.map)
        } else {
            drawControl.addTo($scope.map)
        }

        $scope.ui.editingTerritory = !$scope.ui.editingTerritory;

    }

    $scope.toggleSide = function(){
        $scope.ui.side = !$scope.ui.side;
        $scope.ui.fade = true;
        $timeout(function(){
            leafletData.getMap().then(function(map) {
                map.invalidateSize(true);
            });
            $scope.ui.fade = false;
        }, 1000)
    };


    DataService.territory.one($stateParams.territoryId).get()
    .then(function(territory){
        $scope.territory = territory;    
        console.log("got territory...", $scope.territory)
        console.log(1234, _.flatten(territory.geom.coordinates[0]));
        addTerritory();
        centerJSON();
        
    });

};


})();