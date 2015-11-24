(function(){
"use strict";

angular.module("app")
.factory('DataService', DataService);

function DataService(Restangular){
    var svc = {};

    svc.territory = Restangular.service("territory");

    return svc;
}


})();