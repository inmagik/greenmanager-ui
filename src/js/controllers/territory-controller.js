(function(){
"use strict";

angular.module('app')
.controller('TerritoryCtrl', TerritoryCtrl);

function createLatLongs(arr){
    return _.map(arr, function(u){ return { lat: u[0], lng:u[1]}});
}

function TerritoryCtrl($scope, $stateParams, DataService, leafletData, $timeout, Restangular, territory, territoryGeo, points, $state){
    $scope.paths = {};
    $scope.$state = $state;
    $scope.ui = { side : true, editingTerritory : false, dirty : false, editingMarker : false };

    $scope.territory = territory;

    console.log(1, points)
    
    $scope.layers = {
        baselayers: {
            osm:{
                name: "OpenStreetMap (XYZ)",
                type: "xyz",
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                layerOptions: {
                    subdomains: ['a', 'b', 'c'],
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    continuousWorld: true
                }
            }
        },
        overlays : {

            territory : {
                name : "Territory",
                type: 'geoJSONShape',
                data : territoryGeo.geojson.data,
                visible: true,
                layerOptions: {
                    style: {
                        "color": "#00D",
                        "fillColor": "#00D",
                        "weight": 1.0,
                        "opacity": 0.6,
                        "fillOpacity": .2
                    }
                },
            },


            points : {
                name : "Points",
                type: 'geoJSONShape',
                data : points.geojson.data,
                visible: true,
                layerOptions: {
                    style: {
                        
                    },
                    onEachFeature: function (feature, layer) {
                       var s = feature.properties.specie;
                       feature.properties.layerName = "points";
                       layer.bindPopup(s);

                       layer.on("click", function (e) {
                            console.log(e)
                            $state.go("app.territory.edit-point", {territoryId:territory.id, pointId:e.target.feature.id})
                        });
                    }
                },
            },

            editing : {
                name : "Editing",
                type: 'geoJSONShape',
                data : [],
                visible: true,
                layerOptions: {
                    style: {
                        
                    }
                    
                },
            }

        }
    }
 

    leafletData.getMap().then(function (map) {
        $scope.map = map;
        centerJSON(); 
        
    });

    var centerJSON = function() {
        
        var latlngs = _.map($scope.territory.geom.coordinates[0], function(x){ return [x[1], x[0]]});
        $scope.map.fitBounds(latlngs);
        
    };

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

    

                    


    return


   


    var drawnItems = new L.FeatureGroup();
    var pointItems = new L.FeatureGroup();

    
    var addPointControl = new L.Control.Draw({
        draw : { marker: { repeatMode : false}, circle: false },
        edit : false
    });
    
    var controls = {
        addPoint : { control : addPointControl, active:false }
    }

    $scope.markers = [];
    

    $scope.toggleControl = function(controlName, value){
        if(!controls[controlName] || controls[controlName].active == value) return;
        value = value || !controls[controlName].active;
        controls[controlName].active = value;
        if(value){
            controls[controlName].control.addTo($scope.map);
        } else {
            controls[controlName].control.removeFrom($scope.map);
        };

    };

    
    
    

    

    
    

    

     
    

    

    
    

};


})();