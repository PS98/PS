"use strict";

angular.module("psApp").controller("orderListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function($scope, psDataServices, $state, psOrderDetailsService, $timeout) {

      $scope.orderDetails = function(id) {
          psOrderDetailsService.setOrderId(id);
          $state.go("admin.editOrder");
      }
        $scope.toggleView = function() {
            $scope.editOrder = false;
        }
        $scope.getOrderList = function (id) {
            psOrderDetailsService.getOrderList(id).then(function (data) {
                $scope.displayOrderList = true;
                $scope.orders = data.result;
                if (!data.result) {
                    $scope.orders = {
                        pendingOrderCount: 0,
                        cancelOrderCount: 0,
                        successorderCount: 0,
                        orderList: 0
                    }
                }

            }, function () {

            });
        }
        var centreid = psOrderDetailsService.getCentreId();
            $scope.centreId = centreid;
            $scope.getOrderList(centreid);
            psOrderDetailsService.setCentreId(undefined);
       
        $scope.changeView = function() {
            $state.go("admin.centreDetails");
        }
    }
]);