"use strict";

angular.module("psApp").directive("admin", function () {
    return {
        templateUrl: "psapp/admin/admin.html",
        link: function (scope, element, attrs) {
            $('.jelect').jelect();
        },
        controller: ["$scope", "psDataServices", function ($scope, psDataServices) {
            $scope.carList = {}; $scope.centreDetails = {}; $scope.showBrandName = true;
            psDataServices.getAllCarColletion().
      success(function (data) {
          $scope.carList.carCollections = data.carList;

      }).error(function () {
      });
            $scope.selectBrand = function (brandName) {
                $scope.showBrandName = false; $scope.showModel = true;
                $scope.centreDetails.brand = brandName;
                    psDataServices.getCarType(brandName).
                     success(function (data) {
                         $scope.carList.carTypes = data;
                     }).error(function () {
                     });
            }
            $scope.selectModel = function (type) {
                $scope.centreDetails.modelList = $scope.centreDetails.modelList || [];

                if(!$scope.centreDetails.modelList.includes(type))
                    $scope.centreDetails.modelList.push(type)


            }
        }]

    };
});