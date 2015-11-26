(function(){
"use strict";

angular.module("app")
.factory('DataService', DataService);

function DataService(Restangular, $q, $http){
    var svc = {};

    svc.territory = Restangular.service("territory");
    svc.pointvegetation = Restangular.service("pointvegetation");

    svc.getApiUrl = function(u){
        // #TODO: CREATE CONSTANT
        var x = _.rest(arguments)
        var out =  'http://localhost:8000/api/' + u + "/";
        if(x.length){
            out += x.join("/") + "/";
        }
        return out;
        
    }


    svc.getGeoFeatures = function(url){
        var deferred = $q.defer();
        $http.get(url)
        .then(function(data, status) {
            var out = {
                geojson: {
                    data: data.data,
                    style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    }
                }
            };
            deferred.resolve(out);
        });

        return deferred.promise;
    };


    return svc;
};


})();