"use strict";

angular.module("app").directive("wwaTemprature",
    ["dataService",
    function (dataService) {
        return {
            templateUrl: "app/widgets/wwaTemprature/wwaTempratureTemplate.html",
            link: function (scope, el, attrs) {
                scope.selectedLocation = null;
                scope.isLoaded = false;
                scope.hasError = false;

                scope.loadLocation = function () {
                    scope.hasError = false;
                    dataService.getLocation(scope.item.widgetSettings.id)
                    .then(function (data) {
                        scope.selectedLocation = data;
                        scope.isLoaded = true;
                        scope.hasError = false;
                    }, function () {
                        scope.hasError = false;
                    });
                }

                scope.loadLocation();
            }
        };
}]);