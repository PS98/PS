"use strict";

angular.module("index").directive("realFacts", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/realfactsTemplate.html",
        link: function (scope, el, attrs) {
          
        }
    };
});

