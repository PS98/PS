"use strict";

angular.module("index").directive("highlights", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        controller: "indexController",
        templateUrl: "psApp/index/highlightsTemplate.html",
        link: function (scope, el, attrs) {

        }, 
    };
});

