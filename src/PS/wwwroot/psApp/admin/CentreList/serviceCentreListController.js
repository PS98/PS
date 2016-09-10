"use strict";

angular.module("psApp").controller("serviceCentreListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function ($scope, psDataServices, $state, psOrderDetailsService, $timeout) {
        $scope.loadData = function (id) {
            psOrderDetailsService.getServiceCentre().then(function (data) {
                if (data.length === 1) {
                    $scope.centreDetails = data[0];
                    $scope.selectedServices = data[0].services;
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
        $scope.getOrderList = function (id) {
            psOrderDetailsService.setCentreId(id);
            $state.go("admin.orderList");
        }
        $scope.getPriceList = function (id) {
            psOrderDetailsService.setCentreId(id);
            $state.go("admin.priceDetails");
        }
        $scope.showCentreDetails = function (centre) {
            $scope.hideServiceList = true;
            $scope.newCentre = true;
            $scope.showCentreData = true;
            $scope.centreDetails = centre;
            $scope.selectedServices = centre.services;
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