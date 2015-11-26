(function(){

"use strict";

angular.module('app.statesconfig', ['ui.router'])

.run(function($rootScope, $state){

    //perform redirects based on login/logout here
    $rootScope.$on("logoutSuccess", function(){
        $state.go("app.login");
    })

    $rootScope.$on("loginSuccess", function(){
        $state.go("app.home");
    })


})

.config(function($stateProvider, $urlRouterProvider){

    /* States config */

    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl : 'templates/base.html',
        //controller : 'RootCtrl'
    })
    .state('app.login', {
        url: '/login',
        views : {
            main : {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',        
            }
        },
        resolve: {
          
        },
        data : {
            permissions : {
                except : ['logged'],
                redirectTo : 'app.home'
            }
        }
    })
    /*
    .state('app.account', {
        url: '/account',
        templateUrl: 'templates/account.html',
        //controller: 'AccountCtrl',
        resolve: {
          
        },
        data: {
            permissions: {
                except: ['anonymous'],
                redirectTo: 'app.login'
            },

        },
    })
    */
    
    .state('app.home', {
        url: '/home',
        views : {
            main : {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',        
            }
        },
        resolve: {},
        data: {
            permissions: {
                only: ['logged'],
                redirectTo : 'app.login'
            }
        },
    })

    .state('app.territory', {
        sticky: true,
        url: '/territory/:territoryId',
        views : {
            main : {
                templateUrl: 'templates/territory.html',
                controller: 'TerritoryCtrl',        
            },
            navbar : {
                templateUrl: 'templates/territory-navbar.html',
                controller: 'TerritoryNavCtrl'
            }
        },
        resolve: {
            
            territory : function(DataService, $stateParams){
                return DataService.territory.one($stateParams.territoryId).get();
            },
            territoryGeo : function(DataService, $stateParams){
                var url = DataService.getApiUrl('territory-geo', $stateParams.territoryId)
                return DataService.getGeoFeatures(url)
            },
            points : function(DataService, territory){
               var url = DataService.getApiUrl('pointvegetation-geo')
                return DataService.getGeoFeatures(url)
            }
            
        },
        data: {
            permissions: {
                only: ['logged'],
                redirectTo : 'app.login'
            }
        },

        
        
    })

    .state('app.territory.edit', {
        url: '/edit',
        views  :{
            "territory-side" : {
                templateUrl: 'templates/territory-edit.html',
                controller: 'TerritoryEditCtrl',                
            }
        },
        onEnter : function(MapService){
            MapService.addEditControlForOverlay('territory')
        },
        onExit : function(MapService){
            MapService.removeEditControlForOverlay('territory')
            
        }
    })

    .state('app.territory.add', {
        url: '/add',
        views  :{
            "territory-side" : {
                templateUrl: 'templates/territory-add.html',
                controller: 'TerritoryAddCtrl',                
            }
        }
    })
    .state('app.territory.edit-point', {
        url: '/edit-point/:pointId',
        views  :{
            "territory-side" : {
                templateUrl: 'templates/territory-edit-point.html',
                controller: 'TerritoryEditPointCtrl',                
            }
        },
        resolve : {
            point : function(DataService, $stateParams){
                return DataService.pointvegetation.one($stateParams.pointId).get()
            }
        },
        onEnter : function(MapService, point){
            MapService.hideOverlay('points')
            var feature = MapService.convertToFeature(point, "geom");
            MapService.clearOverlay('editing', feature)
            .then(function(){
                MapService.addEditControlForOverlay('editing')    
            })
            
        },

        onExit : function(MapService){
            MapService.showOverlay('points')
            MapService.removeEditControlForOverlay('editing')
            MapService.commitEdits('editing', 'points')
            //MapService.clearOverlay('editing')
        }
    })


    
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get('$state');
        $state.go('app.home');
    });

})

})();