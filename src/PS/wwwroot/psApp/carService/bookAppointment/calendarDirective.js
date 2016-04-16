"use strict";

angular.module("psApp").directive("calendarDirective", function() {
    return {
        templateUrl: "psApp/carService/bookAppointment/calendar.html",
        replace: true,
        scope: {
            data: "=",
            setDateTime: "&",
        },
        link: function (scope, element, attrs) {
           
        },
        controller:function($scope) {
            $scope.updateTime = function (time, date) {
                debugger;
                $scope.selectedDate = {};
                $scope.selectedDate.time = time;
                $scope.selectedDate.date = date;
                $scope.setDateTime({ selectedTime: $scope.selectedDate });
            }
        }

    }
});