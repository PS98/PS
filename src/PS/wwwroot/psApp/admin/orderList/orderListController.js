"use strict";

angular.module("psApp").controller("orderListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function($scope, psDataServices, $state, psOrderDetailsService, $timeout) {

      $scope.orderDetails = function(id) {
            psOrderDetailsService.getOrderById(id).then(function (data) {
                if (data.status != 1) {
                    $scope.error = '';
                    $scope.order = [];
                    $scope.order.push(data.order);
                    $scope.editOrder = true;
                }
                else {
                    $scope.error = data.message;
                }
            }, function () {
                console.log(data.message);
            });
        }
        $scope.toggleView = function() {
            $scope.editOrder = false;
        }
      
    }
]);