"use strict";

angular.module("app").directive("wwaEmployee",
    ["dataService",
    function (dataService) {
        return {
            templateUrl: "app/widgets/wwaEmployee/wwaEmployeeTemplate.html",
            link: function (scope, el, attrs) {
                scope.selectedEmployee = null;
                scope.isLoaded = false;
                scope.hasError = false;

                scope.loadEmployee = function () {
                    scope.hasError = false;
                        dataService.getEmployee(scope.item.widgetSettings.id)
                    .then(function (data) {
                        scope.selectedEmployee = data;
                        scope.isLoaded = true;
                        scope.hasError = false;
                    }, function () {
                        scope.hasError = true;
                    });
                }

                scope.loadEmployee();
            }
        };
    }]);