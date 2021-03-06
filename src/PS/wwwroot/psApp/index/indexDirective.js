﻿"use strict";

angular.module("index").directive("index",["$location", function ($location) {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/index/indexTemplate.html",
    // controller: "indexController",
        link: function (scope, el, attrs) {
            new WOW().init();
            scope.go = function (path) {
                $location.path(path);
            };
        }
    };
}]);


