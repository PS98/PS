"use strict";

angular.module("psApp").controller("editOrderController", [
        "$scope", "psDataServices", "$state", "psOrderDetailsService", function ($scope, psDataServices, $state, psOrderDetailsService) {
            $scope.getOrderById = function (id) {
                if (id)
                    psOrderDetailsService.getOrderById(id).then(function (data) {
                        $scope.activeOrder = [];
                        $scope.order = data.order;
                        $scope.activeOrder.push(data.order);
                    }, function () {
                        console.log(data.message);
                    });
            }
            $scope.changeState = function (state) {
                $state.go(state);
            }
            $scope.updateOrder = function () {
               
                console.log($scope.order);
                psOrderDetailsService.updateSelectedOrder($scope.order).then(function(data) {
                    alert("your order details updated successfully");
                    $scope.isEdit = false;
                    $scope.order = data.order;
                }, function() {
                    alert("error");
                });

            }
            $scope.changeSelectedService = function(service) {
               $scope.order.selectedServices[0].name = service;
            }

         

        }
    ]
);