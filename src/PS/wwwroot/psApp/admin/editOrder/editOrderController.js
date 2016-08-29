"use strict";

angular.module("psApp").controller("editOrderController", [
        "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function ($scope, psDataServices, $state, psOrderDetailsService, $timeout) {
            $scope.$parent.$parent.CentredDetails = "";
            $scope.getOrderById = function (id) {
                if (id)
                    psOrderDetailsService.getOrderById(id).then(function (data) {
                        if (data.status != 1) {
                            $scope.error = '';
                            $scope.activeOrder = [];
                            $scope.order = data.order;
                            if (!$scope.order.quotationRevision) {
                                $scope.order.quotationRevision = {};
                            }
                            $scope.order.quotationRevision.status = "Select";
                            $scope.activeOrder.push(data.order);
                        }
                        else {
                            $scope.error = data.message;
                        }
                    }, function () {
                        console.log(data.message);
                    });
            }
            $scope.changeState = function (state) {
                $state.go(state);
            }
            $scope.updateOrder = function () {

                console.log($scope.activeOrder[0]);
                psOrderDetailsService.updateSelectedOrder($scope.activeOrder[0]).then(function (data) {
                    alert("your order details updated successfully");
                    $scope.isEdit = false;
                    $scope.order = data.order;
                }, function () {
                    alert("error");
                });

            }
            $scope.changeSelectedService = function (service) {
                $scope.order.selectedServices[0].name = service;
            }
            $scope.editAppointment = function (order) {
                var today = new Date();
                    $scope.setFiveDay(today,order);
                $("#editAppointment").modal('toggle');
                $scope.editOrder = order;
                $scope.showPickUpCalendar = true;
                $scope.showDropCalendar = false;
            }
            $scope.confirmAlert = function (order) {
                $scope.modalShown = true;
                $scope.showInformation = false;
                $scope.overlayMessage = undefined;
                $scope.cancelledOrder = order;
                $("#modalOverlay").modal('toggle');
            }
            $scope.cancel = function () {
                $scope.modalShown = false;
                psOrderDetailsService.cancelOrder($scope.cancelledOrder.invoiceNo, $scope.cancelledOrder.userDetails.email,true).then(function (data) {
                    $scope.overlayMessage = data.message;
                    $scope.showInformation = true;
                    $scope.isEdit = false;
                    $timeout(function () {
                        $("#modalOverlay").modal('toggle');
                    }, 500);
                }, function () {
                    alert("error");
                });
            }
            $scope.changeAppointment = function (editOrder) {


                psOrderDetailsService.editDateAndTime(editOrder.invoiceNo, $scope.changedDate).
                    then(function (data) {
                        $scope.overlayMessage = data.result;
                        $scope.showInformation = true;
                        $timeout(function () {
                            $("#modalOverlay").modal('toggle');
                        }, 400);
                    }, function () {
                        alert("error");
                    }).finally(function () {
                        $scope.centreWorkingHours = [];
                        $scope.availableDropTime = [];
                        $scope.changedDate = { "pickUpDate": {}, "dropOffDate": {} };
                        $scope.isEdit = false;
                    });

            }

        }
]
);