"use strict";

angular.module("index").directive("terms", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/index/termsTemplate.html",
        controller: "indexController",
        link: function (scope, el, attrs) {
          
        }
    };
});

