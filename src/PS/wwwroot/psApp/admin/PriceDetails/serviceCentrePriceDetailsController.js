"use strict";

angular.module("psApp").controller("serviceCentrePriceDetailsController", ["$scope", "$q", "psOrderDetailsService", "uiGridRowEditService", function ($scope, $q, psOrderDetailsService, uiGridRowEditService) {

    $scope.getPriceList = function (id) {
        psOrderDetailsService.getPriceList(id).then(function (data) {
            var updatedRows = $scope.gridApi.rowEdit.getDirtyRows();
            if (updatedRows.length > 0) {
                var dataRows = updatedRows.map(function(row) {
                    return row.entity;
                });
                $scope.gridApi.rowEdit.setRowsClean(dataRows);
            }
            $scope.$parent.$parent.centreDetails = data.serviceCentre;
            $scope.$parent.centreDetails = data.serviceCentre;
            $scope.gridOptions.data = data.list;
            $scope.data = [];
            $scope.data = data.list;
            $scope.serveData = [];
        }, function () {
            alert("error");
        });
    }
    $scope.gridOptions = {
        enableSorting: true,
        treeRowHeaderAlwaysVisible: false,
        enableFiltering: true,
        rowEditWaitInterval: -1,
        enableCellEditOnFocus: true,
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
            field: "liteServicePrice",
            enableCellEdit: true
        }, {
            name: "Essential",
            field: "essentialServicePrice",
            enableCellEdit: true
        }, {
            name: "Comprehensive",
            field: "comprehensiveServicePrice",
            enableCellEdit: true

        },
        {
            name: "Save",
            field: "",
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" >' +
               '<button value="Edit" ng-if="row.isDirty" ng-click="grid.appScope.saveEdit(row)">Update</button>' +
               '<button value="Edit" ng-if="row.isDirty" ng-click="grid.appScope.cancelEdit(row)">Cancel</button>' +
                '</div>'
        }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                rowEntity.isDirty = true;
                if (newValue !== oldValue) {
                    var existingData = $scope.serveData.find(function (data) {
                        return data.$$hashKey === rowEntity.$$hashKey;
                    });
                    if (existingData) {
                        existingData[colDef.field] = oldValue;
                    }
                    else {
                        var obj = {};
                        obj = $.extend(true, {}, rowEntity);
                        obj[colDef.field] = oldValue;
                        $scope.serveData.push(obj);
                    }
                }
            });
            gridApi.rowEdit.on.saveRow($scope, function (rowEntity) {
                var promise = psOrderDetailsService.updateRow(rowEntity);
                //var promise = $q.defer();
                //$scope.gridApi.rowEdit.setSavePromise($scope.gridApi.grid, rowEntity, promise.promise);
                rowEntity.isDirty = false;
                $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise);
            });
        }
    }

    $scope.saveEdit = function (row) {
        uiGridRowEditService.saveRow(row.grid, row)();
    },

    $scope.cancelEdit = function (row, isCancelAll) {
        if (!row && isCancelAll) {
            var updatedRows = $scope.gridApi.rowEdit.getDirtyRows();
            row = updatedRows[0];
        }

        var existingValue = $scope.serveData.filter(function (rowData) {
            return rowData.$$hashKey === row.entity.$$hashKey;
        });
        var dataRows = [];
        dataRows.push(row.entity);
        $scope.gridApi.rowEdit.setRowsClean(dataRows);
        for (var prop in row.entity) {
            row.entity[prop] = existingValue[0][prop];
        }
        row.isDirty = false;

    }
    $scope.updateAll = function () {
        var updatedRows = $scope.gridApi.rowEdit.getDirtyRows();
        $scope.UpdatedData = updatedRows.map(function(row) {
            return row.entity;
        });
        if ($scope.UpdatedData && $scope.UpdatedData.length > 0) {
            psOrderDetailsService.updateChangedRow($scope.UpdatedData).then(function (data) {
                if (data.status === 0) {
                    $scope.gridOptions.data = data.list;
                    $scope.successMessage = data.message;
                    $scope.gridApi.rowEdit.setRowsClean($scope.UpdatedData);
                } else
                    $scope.errorMessage = data.message;
            }, function() {

            });
        }
        $scope.errorMessage = "No Row is updated";
    }
    $scope.cancelAll = function () {
        var updatedRows = $scope.gridApi.rowEdit.getDirtyRows();
        $.each(updatedRows, function (index, val) {
            $scope.cancelEdit(val, true);
        })
    }
      var centreid = psOrderDetailsService.getCentreId();
      if (centreid) {
          $scope.centreId = centreid;
          $scope.getPriceList(centreid);
           psOrderDetailsService.setCentreId(undefined);
      }
}
]);
