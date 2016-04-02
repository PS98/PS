"use strict";

angular.module("psApp").directive("selectCar", function () {
    return {
        templateUrl: "psApp/carService/selectCar.html",
        link: function (scope, element, attrs) {

        }

    };
});


angular.module("psApp").directive("centreDetails", function () {
    return {
        templateUrl: "psApp/carService/centerDetails.html",
        link: function (scope, element, attrs) {
            //scope.center.Name = "Kwik Fit - Broxburn";
            //scope.center.addressline1 = "East Main Street";
            //scope.center.addressline2 = "Broxburn, EH52 5AS";
            //scope.center.phoneNo = "01506 856586";
           // scope.activeCenter = false;
        },
        replace:true,
        scope: {
            centre: '=',
            add: '&'
          
        },
        controller: function ($scope) {
            // $scope.isActive = $scope.$parent.selectedCentre.Name == $scope.centre.Name;
            $scope.isDisplaySelected = $scope.centre.activeCentre;
            $scope.displaySelectedCentre = function (centre) {
                $scope.add({ dirCentre: $scope.centre });
               
            }
            $scope.displaySelectedCentre = function(centre) {
                $scope.add({ dirCentre: $scope.centre });
            }
            

        }

    };
});