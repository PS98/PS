"use strict";

angular.module("psApp").directive("admin", function () {
    return {
        templateUrl: "psapp/admin/admin.html",
        link: function (scope, element, attrs) {
            $('.jelect').jelect();
        },
        controller: ["$scope", "psDataServices", function ($scope, psDataServices) {
            $scope.carList = {}; $scope.centreDetails = {}; $scope.showBrandName = true; var centreObject = {};
            var obj = function(){
                this["ModelList"] = [];
                this["Price"] = 0;
            }
            var serviceObj = function () {

                this["Name"] = "";
                this["Petrol"] = [];
                this["Diesel"] = [];
                this["CNG"] = [];
                this["Electric"] = [];
            }
            psDataServices.geMockData().
                        success(function (data) {
                            $scope.centreDetails = data;
                            angular.extend(centreObject, data);
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
                $scope.brand = brandName;
                $scope.modelList = [];
                psDataServices.getCarType(brandName).
                 success(function (data) {
                     $scope.carList.carTypes = data;
                 }).error(function () {
                 });
            }
            $scope.selectModel = function (type) {
                $scope.modelList = $scope.modelList || [];

                if (!$scope.modelList.includes(type))
                    $scope.modelList.push(type)
                else {
                    $scope.modelList.splice($scope.modelList.indexOf(type), 1)
                }

            }
            $scope.addCentreDetails = function () {
                $scope.centreDetails.ServiceDetails = [];
                var services = new serviceObj();
                var model = new obj();
                model.ModelList = $scope.modelList;
                model.Price = $scope.centreDetails.Price;
                services.Name = $scope.centreDetails.ServiceDetails.Name;
                //  $scope.centreDetails.ServiceDetails.Name = $scope.centreDetails.Service;
                switch ($scope.centreDetails.type) {
                    case "Petrol":
                        services.Petrol.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "Diesel":
                        services.Diesel.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "CNG":
                        services.CNG.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "Electric":
                        services.Electric.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                }
                console.log($scope.centreDetails);
                psDataServices.saveCentreDetails($scope.centreDetails).
                            success(function (data) {
                                alert(data.message);
                                if (data.status === 0) {
                                    $scope.centreDetails = {};
                                    angular.extend($scope.centreDetails, centreObject);
                                    $scope.centreDetails.Id = data.id;
                                }
                            });
            }
            $scope.editBrand = function () {
                $scope.showBrandName = !$scope.showBrandName; $scope.showModel = !$scope.showModel;
            }
        }]

    };
});