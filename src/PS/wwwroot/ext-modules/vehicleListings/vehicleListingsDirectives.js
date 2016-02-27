"use strict";

angular.module("vehicleListings").directive("vehicleListings", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/vehicleListings/vehicleListingsTemplate.html",
        link: function (scope, el, attrs) {
            //scope.addNewWidget = function (widget) {
            //    var newWidget = angular.copy(widget.settings);
            //    scope.widgets.push(newWidget);
            //}
            /////////////////////////////////////////////////////////////////
            // Animated WOW
            /////////////////////////////////////////////////////////////////
            new WOW().init();
        }
    };
});