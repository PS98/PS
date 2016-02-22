"use strict";

angular.module("psApp").config(["$routeProvider", function ($routeProvider) {

    var routes = [
        {
            //url: "/dashboard",
            //config: {
            //    template: "<wwa-dashboard></wwa-dashboard>"
            //}
        },
         {
             //url: "/locations",
             //config: {
             //    template: "<wwa-locations></wwa-locations>"
             //}
         },
          {
              //url: "/guides",
              //config: {
              //    template: "<wwa-guides></wwa-guides>"
              //}
          }
    ];

    routes.forEach(function (route) {
        $routeProvider.when(route.url, route.config);
    });

    $routeProvider.otherwise({
        //redirectTo: "/dashboard"
    });

}]);