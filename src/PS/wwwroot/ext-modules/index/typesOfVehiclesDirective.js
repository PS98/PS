"use strict";

angular.module("index").directive("typesOfVehicles", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/typesOfVehiclesTemplate.html",
        link: function (scope, el, attrs) {
         
        }
    };
});

