(function(){
"use strict";

angular.module('app')
.controller('TerritoryAddCtrl', TerritoryAddCtrl);


function TerritoryAddCtrl($scope, $state, DataService,leafletData,  MapService, $timeout, Restangular, territory){
    $scope.territory = territory;    
    $scope.point = {
        territory : territory.id
    }
    
    $scope.savePoint = function(point){
        DataService.pointvegetation.post(point)
        .then(function(savedPoint){
            alert("point saved!")
            $timeout(function(){
                var geojsonFeature = MapService.convertToFeature(savedPoint.plain(), 'geom');
                $scope.layers.overlays.points.addData(geojsonFeature)
                fg.removeLayer(newPoint);
                $state.go("app.territory", {territoryId:territory.id}, {reload:true})
            })  

        })
    }

    var mapControl;
    var newPoint = null;
    var fg = new L.FeatureGroup();


    var recreateControl = function(add, x){
        if(mapControl){
            $scope.map.removeControl(mapControl)
        }
         console.log(1, x)

        var draw = false;
        var edit = false;
        if(add){
            draw = { marker : true, polygon:false, polyline:false, rectangle:false, circle:false};
        }
        

        mapControl = new L.Control.Draw({
            draw : draw,
            edit : x ? { featureGroup : fg } : false
        });
        console.log(21, mapControl)
        $scope.map.addControl(mapControl)

    }

    function addPoint(e){
        newPoint = e.layer;
        fg.addLayer(newPoint);
        $scope.point.geom = e.layer.toGeoJSON().geometry;
        recreateControl(false, true);  
    }

    function deletePoint(e) {
        recreateControl(true, false);  
    }

    
    $scope.layers = {}
    
    leafletData.getMap()
    .then(function(map){
        $scope.map = map;
        $scope.map.addLayer(fg)
        
        leafletData.getLayers()
        .then(function(l){
            $scope.layers = l;
            recreateControl(true, false);
        })

        $scope.map.on('draw:created', addPoint);

        $scope.map.on('draw:deleted', deletePoint);
        
    });

    $scope.$on("$destroy", function(){
        $scope.map.off('draw:created', addPoint);
        $scope.map.off('draw:deleted', deletePoint);
        if(mapControl){
            mapControl.removeFrom($scope.map);
        }
        
    })


    
    return
    var drawCtrl;
    var addDrawControl = function(){
        drawCtrl = new L.Control.Draw({
            draw : { polygon:true, circle:false },
            edit : false
        });
        drawCtrl.addTo($scope.map)
        var doCreated = function (e) {
            $scope.territory.geom = e.layer.toGeoJSON().geometry;
            $scope.map.addLayer(e.layer)
            drawCtrl.removeFrom($scope.map);
            $scope.map.off('draw:created', doCreated);
            drawCtrl = null;
        }
        $scope.map.on('draw:created', doCreated);
    };

};


})();