(function(){
"use strict";

angular.module('app')
.controller('TerritoryEditPointCtrl', TerritoryEditPointCtrl);



function TerritoryEditPointCtrl($scope, $state, DataService,leafletData,  MapService, $timeout, Restangular, territory, point){
    $scope.territory = territory;    
    $scope.point = point;
    
    $scope.savePoint = function(point){
        DataService.pointvegetation.post(point)
        .then(function(savedPoint){
            alert("point saved!")
            $timeout(function(){
                var geojsonFeature = convertToFeature(savedPoint.plain(), 'geom');
                $scope.layers.overlays.points.addData(geojsonFeature)
                fg.removeLayer(newPoint);
                $state.go("app.territory", {territoryId:territory.id}, {reload:true})
            })  

        })
    }

    var saveEdited = function(){
        var layers =  e.layers.getLayers();
            layers = _.filter(layers, function(x){
                return x.feature.properties.layerName == "points"
            })
            console.log(100, layers);
            if(!layers.length) return;
            _.each(layers, function(l){
                var elm = DataService.pointvegetation.one(l.feature.id).get()
                .then(function(pt){
                    console.error(pt)
                    var gg = l.toGeoJSON()
                    pt.geom = gg.geometry;
                    pt.save();
                })
            })
    }
    
    leafletData.getMap()
    .then(function(map){
        $scope.map = map;
        map.on('draw:edited', saveEdited)
        
    });

    $scope.$on("$destroy", function(){
        $scope.map.off('draw:edited', saveEdited);
        
        
    })


    
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