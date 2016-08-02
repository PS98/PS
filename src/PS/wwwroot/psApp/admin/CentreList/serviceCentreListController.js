"use strict";

angular.module("psApp").controller("serviceCentreListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function ($scope, psDataServices, $state, psOrderDetailsService, $timeout) {
        $scope.loadData = function (id) {
            psOrderDetailsService.getServiceCentre().then(function (data) {
                $scope.serviceCentreList = data;
            }, function () {

            });
        }
        $scope.loadData();
        $scope.changeView = function (id,viewMode) {
            switch (viewMode) {
            case 0:
                $scope.centreDetails(id);
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
        $scope.centreDetails = function(centre) {
            $scope.centre = centre;
        }
        $scope.toggleView = function () {
            $scope.displayOrderList = !$scope.displayOrderList;
        }

    }
]);