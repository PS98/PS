"use strict";

angular.module("newsGrid").directive("newsGrid", function () {
    return {
        scope:{},
        controller: "newsGridController",
        templateUrl: "ext-modules/newsGrid/newsGridTemplate.html",
        link: function (scope, el, attrs) {
            //scope.addNewWidget = function (widget) {
            //    var newWidget = angular.copy(widget.settings);
            //    scope.widgets.push(newWidget);
            //}
        }
    };
});