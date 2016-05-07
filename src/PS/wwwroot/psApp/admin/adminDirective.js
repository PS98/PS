"use strict";

angular.module("psApp").directive("admin", function () {
    return {
        templateUrl: "psapp/admin/admin.html",
        link: function (scope, element, attrs) {
            $('.jelect').jelect();
        },
        controller: ["$scope", "psDataServices", function ($scope, psDataServices) {
            $scope.carList = {}; $scope.centreDetails = {}; $scope.showBrandName = true;
            var obj = {
                "ModelList": [],
                "Price": 0
            };

            psDataServices.geMockData().
                        success(function (data) {
                        $scope.centreDetails = data;
                        })
                        .error(function () {
                        });


            psDataServices.getAllCarColletion().
                              success(function (data) {
                                  $scope.carList.carCollections = data.carList;

                              }).error(function () {
                              });
            $scope.selectBrand = function (brandName) {
                $scope.showBrandName = false; $scope.showModel = true;
                $scope.centreDetails.brand = brandName;
                $scope.centreDetails.modelList = [];
                psDataServices.getCarType(brandName).
                 success(function (data) {
                     $scope.carList.carTypes = data;
                 }).error(function () {
                 });
            }
            $scope.selectModel = function (type) {
                $scope.centreDetails.modelList = $scope.centreDetails.modelList || [];

                if (!$scope.centreDetails.modelList.includes(type))
                    $scope.centreDetails.modelList.push(type)
                else {
                    $scope.centreDetails.modelList.splice($scope.centreDetails.modelList.indexOf(type), 1)
                }

            }
            $scope.addCentreDetails = function () {
                obj.ModelList = $scope.centreDetails.modelList;
                obj.Price = $scope.centreDetails.Price;

                switch ($scope.centreDetails.type) {
                    case "Petrol":
                        $scope.centreDetails.Petrol.push(obj);
                        break;
                    case "Diesel":
                        $scope.centreDetails.Diesel.push(obj);
                        break;
                    case "CNG":
                        $scope.centreDetails.CNG.push(obj);
                        break;
                    case "Electric":
                       $scope.centreDetails.Electric.push(obj);
                        break;
                }
                console.log($scope.centreDetails);
                psDataServices.saveCentreDetails($scope.centreDetails);
            }
            $scope.editBrand = function () {
                $scope.showBrandName = !$scope.showBrandName; $scope.showModel = !$scope.showModel;
            }
        }]

    };
});