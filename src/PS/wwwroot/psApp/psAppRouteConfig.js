"use strict";

angular.module("psApp").config(["$routeProvider", "$locationProvider", "authProvider", function ($routeProvider, $locationProvider, authProvider, store) {

    var routes = [
         {
             url: "/",
             config: {
                 controller: "indexController",
                 template: "<ps-index></ps-index>"
             }
         },
        {
            url: "/CarDetails",
            config: {
                template: "<ps-car-details></ps-car-details>",
                requiresLogin: true
            }
        },
        {
            url: "/NewsDetails",
            config: {
                template: "<ps-news-details></ps-news-details>"
            }
        },
         {
             url: "/NewsGrid",
             config: {
                 template: "<ps-news-grid></ps-news-grid>"
             }
         },
          {
              url: "/VehicleListings",
              config: {
                  template: "<ps-vehicle-listings></ps-vehicle-listings>"
              }
          }
    ];

    routes.forEach(function (route) {
        $routeProvider.when(route.url, route.config);
    });

    $routeProvider.otherwise({
        redirectTo: "/"
    });

    //TODO: don't forget to configure iis settings for html5 mode angular when deploying the code
    $locationProvider.html5Mode(true);

    authProvider.init({
        domain: "ps98.eu.auth0.com",
        clientID: "r8FgGpKk3LJyOqbm2bz7P4WrggALznLh",
        loginUrl: "/"
    });
}])
.run(["$rootScope", "auth", "$location", "jwtHelper", function ($rootScope, auth, store, jwtHelper, $location) {   
    auth.hookEvents();
}]);