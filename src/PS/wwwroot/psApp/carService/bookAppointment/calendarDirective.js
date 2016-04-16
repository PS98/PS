"use strict";

angular.module("psApp").directive("calendarDirective", function() {
    return {
        templateUrl: "psApp/carService/bookAppointment/calendar.html",
        replace: true,
        scope: {
            data: "=",
            update: '&'
        },
        controller:function($scope) {
            $scope.updateTime = function (time, date) {
                debugger;
                $scope.selectedDate = {};
                $scope.selectedDate.time = time;
                $scope.selectedDate.day = date;
                $scope.update({ selectedDateTime: $scope.selectedDate });
            }
        }

    }
});