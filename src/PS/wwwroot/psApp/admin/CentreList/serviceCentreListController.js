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
        $scope.changeView = function (id) {
            psOrderDetailsService.getOrderList(id).then(function (data) {
                $scope.displayOrderList = true;
                $scope.orders = data;
            }, function () {

            });
        }
        $scope.toggleView = function () {
            $scope.displayOrderList = !$scope.displayOrderList;
        }

    }
]);