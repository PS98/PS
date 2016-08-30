"use strict";

angular.module("psApp").controller("serviceCentreListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function ($scope, psDataServices, $state, psOrderDetailsService, $timeout) {
        $scope.loadData = function (id) {
            psOrderDetailsService.getServiceCentre().then(function (data) {
                if (data.length === 1) {
                    $scope.centreDetails = data[0];
                    $scope.Services = data[0].services;
                    $scope.hide = true;
                }
                $scope.serviceCentreList = data;
            }, function () {

            });
        }
        $scope.loadData();
        $scope.changeView = function (id,viewMode) {
            switch (viewMode) {
            case 0:
                $scope.showCentreDetails(id);
                break;
            case 1:
                $scope.getOrderList(id);
                break;
            default:
                $scope.getPriceList(id);
                break;
            }
        }
        $scope.getOrderList = function(id) {
            psOrderDetailsService.getOrderList(id).then(function (data) {
                $scope.displayOrderList = true;
                $scope.orderDetails = data.result;
                if (!data.result) {
                    $scope.orderDetails = {
                        pendingOrderCount: 0,
                        cancelOrderCount: 0,
                        successorderCount: 0,
                        orderList: 0
                    }
                }

            }, function () {

            });
        }
        $scope.getPriceList = function (id) {
            psOrderDetailsService.setCentreId(id);
            $state.go("admin.priceDetails");
        }
        $scope.showCentreDetails = function (centre) {
            $scope.hide = true;
            $scope.newCentre = true;
            $scope.showCentreData = true;
            $scope.centreDetails = centre;
            $scope.Services = centre.services;
        }
        $scope.toggleView = function () {
            $scope.displayOrderList = !$scope.displayOrderList;
        }
        $scope.toggleCentreData = function() {
            $scope.showCentreData = !$scope.showCentreData;
            $scope.loadData();
        }
    }
]);