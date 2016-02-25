"use strict";

angular.module("psApp").config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

    var routes = [
         {
             url: "/",
             config: {
                 template: "<ps-index></ps-index>"
             }
         },
        {
            url: "/CarDetails",
            config: {
                template: "<ps-car-details></ps-car-details>"
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
   
}]);