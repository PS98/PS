"use strict";

angular.module("psApp").directive("centreDetails", function () {
    return {
        templateUrl: "psApp/carService/centerDetails.html",
        replace:true,
        scope: {
            centre: '=',
            add: '&'
          
        },
        controller: function ($scope) {
            // $scope.isActive = $scope.$parent.selectedCentre.Name == $scope.centre.Name;
            $scope.isDisplaySelected = $scope.centre.activeCentre;
           $scope.selectedCentre = function () {
                $scope.add({ dirCentre: $scope.centre });
            }

        }

    };
});