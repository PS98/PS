"use strict";

angular.module("psApp").directive("centreDetails", function () {
    return {
        templateUrl: "psApp/carService/centerDetails.html",
        replace:true,
        scope: {
            centre: '=',
            add: '&',
            serviceList: '=',
            openInfo:'&'
          
        },
        controller: function ($scope) {
            // $scope.isActive = $scope.$parent.selectedCentre.Name == $scope.centre.Name;
            $scope.isDisplaySelected = $scope.centre.activeCentre;
           $scope.selectedCentre = function () {
                $scope.add({ dirCentre: $scope.centre });
            }
           $scope.getRatings = function (number) {
               var ratings = [];
               for (var i = 0; i < number; i++) {
                   ratings.push(i);
               }
               return ratings;
           }
           $scope.showInfo = function (event) {
               $scope.openInfo({ eventInfo: event });
            }

           
        }

    };
});