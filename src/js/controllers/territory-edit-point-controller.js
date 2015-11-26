(function(){
"use strict";

angular.module('app')
.controller('TerritoryEditPointCtrl', TerritoryEditPointCtrl);



function TerritoryEditPointCtrl($scope, $state, DataService,leafletData,  MapService, $timeout, Restangular, territory, point){
    $scope.territory = territory;    
    $scope.point = point;
    
    $scope.savePoint = function(){
        $scope.point.save()
        .then(function(savedPoint){
            alert("point saved!")
            $timeout(function(){
                //var geojsonFeature = MapService.convertToFeature(savedPoint.plain(), 'geom');
                //$scope.layers.overlays.points.addData(geojsonFeature)
                //fg.removeLayer(newPoint);
                $state.go("app.territory", {territoryId:territory.id}, {reload:true})
            })  

        })
    };

    var saveEdited = function(e){
        var out = e.layers.toGeoJSON();
        $timeout(function(){
            $scope.point.geom = out.features[0].geometry;
            $scope.savePoint()
        })
        
    };
    
    leafletData.getMap()
    .then(function(map){
        $scope.map = map;
        map.on('draw:edited', saveEdited)
        
    });

    $scope.$on("$destroy", function(){
        $scope.map.off('draw:edited', saveEdited);
    });


    
    return
    var drawCtrl;
    var addDrawControl = function(){
        drawCtrl = new L.Control.Draw({
            draw : { polygon:true, circle:false },
            edit : false
        });
        drawCtrl.addTo($scope.map)
        $scope.map.on('draw:created', function (e) {
            $scope.territory.geom = e.layer.toGeoJSON().geometry;
            $scope.map.addLayer(e.layer)
            drawCtrl.removeFrom($scope.map);
            $scope.map.off('draw:created');
            drawCtrl = null;
        });
        
    };

    

};


})();