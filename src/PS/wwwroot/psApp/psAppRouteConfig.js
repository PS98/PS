"use strict";

angular.module("psApp").config(["$stateProvider","$urlRouterProvider", "$locationProvider", "authProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider, authProvider, jwtInterceptorProvider, $httpProvider) {

    var routes = [
         {
           state:"home",
             config: {
                 url: "/",
                 controller: "indexController",
                 template: "<ps-index></ps-index>"
             }
         },
        {
            state: "CarDetails",
            config: {
                url: "/CarDetails",
                template: "<ps-car-details></ps-car-details>",
               // requiresLogin: true
            }
        },
        {
            state: "NewsDetails",
            config: {
                url: "/NewsDetails",
                template: "<ps-news-details></ps-news-details>"
            }
        },
         {
             state: "NewsGrid",
             config: {
                 url: "/NewsGrid",
                 template: "<ps-news-grid></ps-news-grid>"
             }
         },
          {
              state: "VehicleListings",
              config: {
                  url: "/VehicleListings",
                  template: "<ps-vehicle-listings></ps-vehicle-listings>"
              }
          },
           {
               state: "service",
               config: {
                   url: "/Service",
                  template: "<car-service></car-service>"
              }
           },
           {
               state: "socialCallback",
               config: {
                   url: "/Auth/Success",
                   template: "",
                   controller: "sho"
               }
           }
    ];

    routes.forEach(function (route) {
        $stateProvider.state(route.state, route.config);
    });
   
          
    $urlRouterProvider.otherwise('/');

    //TODO: don't forget to configure iis settings for html5 mode angular when deploying the code
    $locationProvider.html5Mode(true);

    authProvider.init({
        domain: "ps98.eu.auth0.com",
        clientID: "r8FgGpKk3LJyOqbm2bz7P4WrggALznLh",
        loginUrl: "/"
    });

    //jwtInterceptorProvider.tokenGetter = function ($localStorage) {
    //    debugger;
    //    return $localStorage.token;
    //}
}])
.run(["$localStorage", "$rootScope", "auth", "$location", function ($localStorage, $rootScope, auth, $location) {
    $rootScope.$on("$locationChangeStart", function () {
        if (!auth.isAuthenticated) {
            var token = $localStorage.token;
            if (token) {
               // if (!jwtHelper.isTokenExpired(token)) {
                auth.authenticate($localStorage.profile, $localStorage.token);
            }
            //else {
            //        $location.path("/")
            //    }
           // }
        }
    });
    auth.hookEvents();
}]);