"use strict";

angular.module("psApp").config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        var routes = [
             {
                 state: "home",
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
                    state: "service.car",
                    config: {
                        url: "/Car",
                        template: "<select-car></select-car>"
                    }
                },
                 {
                     state: "service.centre",
                     config: {
                         url: "/Centre",
                         template: "<select-centre></select-centre>"
                     }
                 },
               {
                   state: "socialCallback",
                   config: {
                       url: "/Auth/Success",
                       template: "<div id='page-preloader'><span class='spinner'></span></div>",
                       controller: "loginDetailsController"
                   }
               }
        ];

        routes.forEach(function (route) {
            $stateProvider.state(route.state, route.config);
        });


        $urlRouterProvider.otherwise('/');

        //TODO: don't forget to configure iis settings for html5 mode angular when deploying the code
        $locationProvider.html5Mode(true);

    }]);