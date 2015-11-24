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
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        resolve: {
          
        },
        data : {
            permissions : {
                except : ['logged'],
                redirectTo : 'app.home'
            }
        }
    })
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
    
    .state('app.home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        resolve: {},
        data: {
            permissions: {
                only: ['logged'],
                redirectTo : 'app.login'
            }
        },
        
    })

    .state('app.territory', {
        url: '/territory/:territoryId',
        templateUrl: 'templates/territory.html',
        controller: 'TerritoryCtrl',
        resolve: {},
        data: {
            permissions: {
                only: ['logged'],
                redirectTo : 'app.login'
            }
        },
        
    })


    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('app.home');
    });

})

})();