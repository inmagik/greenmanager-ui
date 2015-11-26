(function(){
"use strict";

angular.module("app")
.factory('MapService', MapService);

function MapService(Restangular, $q, $http, leafletData){
    var svc = {};

    var getEditControl = function(layers, name, options){
        var editableItems = new L.FeatureGroup(layers);
        var drawOpts = createDrawOptions(options)
        var ctrl = new L.Control.Draw({
            name : name,
            draw : drawOpts,
            edit : { featureGroup : editableItems}
        });
        return ctrl;
    };

    svc.managedControls = {}

    svc.convertToFeature = function(o, geomProperty){
        var out = {
            id : o.id,
            type : "Feature",
            geometry : o[geomProperty],
            properties : _.omit(o, ['id', geomProperty])
        }
        return out;
    };

    var createDrawOptions = function(o){
        o = o || {};
        var out = {
            marker : false,
            circle : false,
            polygon : false,
            polyline : false,
            rectangle : false
        }
        return angular.extend(out, o);
    }

    svc.addEditControlForOverlay = function(overlayName, drawOptions){
        drawOptions = drawOptions || {};
        return leafletData.getMap()
        .then(function(map){
            leafletData.getLayers()
            .then(function(l){
                var targetOverlay = l.overlays[overlayName];
                var ctrlName = "edit-"+overlayName;
                var ctrl = getEditControl(targetOverlay.getLayers(), ctrlName, drawOptions);
                ctrl.addTo(map);
                svc.managedControls[ctrlName] = ctrl;

            })
        });
    };

    svc.removeEditControlForOverlay = function(overlayName){
        return leafletData.getMap()
        .then(function(map){
            var ctrlName = "edit-"+overlayName;
            svc.managedControls[ctrlName].removeFrom(map);
            delete svc.managedControls[ctrlName]
        });
    };


    svc.hideOverlay = function(name){
        return leafletData.getLayers()
        .then(function(lyrs){
            console.log(1, lyrs)
            var features = lyrs.overlays[name];
            features._map.removeLayer(features)

        })
    }

    svc.showOverlay = function(name){
        return leafletData.getMap()
        .then(function(map){
            return leafletData.getLayers()
            .then(function(lyrs){
                var features = lyrs.overlays[name];
                map.addLayer(features)
            })
        })
    }


    svc.removeLayersFromMap = function(layers){
        return leafletData.getMap()
        .then(function(map){
            console.log(1, layers)
            _.each(layers._layers, function(l){
                map.removeLayer(l);
            })
            
        });

    }

    svc.clearOverlay = function(overlayName, features){
        var deferred = $q.defer();
        
        leafletData.getMap()
        .then(function(map){
            return leafletData.getLayers()
        })
        .then(function(l){
            var targetOverlay = l.overlays[overlayName];
            targetOverlay.clearLayers()
            if(features){
                targetOverlay.addData(features);
            }
            deferred.resolve(true)
        })

        return deferred.promise;
        
    };

    svc.commitEdits = function(sourceOverlayName, targetOverlayName){
        leafletData.getMap()
        .then(function(map){
            return leafletData.getLayers()
       
        .then(function(l){
            var targetOverlay = l.overlays[targetOverlayName];
            var sourceOverlay = l.overlays[sourceOverlayName];

            _.each(sourceOverlay.getLayers(), function(l){
                
                var x = _.findWhere(targetOverlay.getLayers(), function(it){
                    return it.feature.id == l.feature.id;
                })
                if(x){
                    map.removeLayer(x)
                    targetOverlay.addData(l.feature)
                }
            })
            sourceOverlay.clearLayers()
            
          
        })
      })

    }

    return svc;
};


})();