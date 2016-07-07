"use strict";

angular.module("psApp").controller("serviceCentrePriceDetailsController", ["$scope", "psOrderDetailsService", function ($scope, psOrderDetailsService) {

        $scope.getPriceList = function(id) {
            psOrderDetailsService.getPriceList(id).then(function(data) {
                alert("success");
                console.log(data.list);
                $scope.data = data.list;
                $scope.gridOptions.data = data.list;
            }, function() {
                alert("error");
            });
        }
            $scope.gridOptions = {
                enableSorting: true,
                treeRowHeaderAlwaysVisible: false,
                enableFiltering: true,
                rowEditWaitInterval: -1,
                columnDefs: [
                {
                    name: "brandname",
                    field: "varientName",
                    enableCellEdit: false
                },
                {
                    name: "EngineType",
                    field: "engineType",
                    enableCellEdit: false
                },
                {
                    name: "Lite",
                    field: "liteServicePrice"
                }, {
                    name: "Essential",
                    field: "essentialServicePrice"
                }, {
                    name: "Comprehensive",
                    field: "comprehensiveServicePrice",
                    enableCellEdit: false
                },
                {
                    name: "Save",
                    field: "",
                    enableFiltering: false,
                    cellTemplate: '<div class="ui-grid-cell-contents" >' +
                       // '<button value="Edit" ng-if="!row.inlineEdit.isEditModeOn" ng-click="row.inlineEdit.enterEditMode($event)">Delete</button>' +
                        //'<button value="Edit" ng-if="!row.inlineEdit.isEditModeOn" ng-click="row.inlineEdit.enterEditMode($event)">Edit</button>' +
                        '<button value="Edit" ng-if="row.inlineEdit.isEditModeOn" ng-click="row.inlineEdit.saveEdit($event)">Update</button>' +
                        '<button value="Edit" ng-if="row.inlineEdit.isEditModeOn" ng-click="row.inlineEdit.cancelEdit($event)">Cancel</button>' +
                        '</div>'
        }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    rowEntity.isDirty = true;
                    $scope.$apply();
                });
            }
        }
    }
]);