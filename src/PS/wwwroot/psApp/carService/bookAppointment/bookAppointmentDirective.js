"use strict";

angular.module("psApp").directive("bookAppointment", function () {
    return {
        templateUrl: "psApp/carService/bookAppointment/bookAppointment.html",
        link: function (scope, element, attrs) {

        },
        scope: false,
        controller: ["$scope", "psDataServices", function ($scope,psDataServices) {
            $scope.dateToDisplay = [];
            $scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            $scope.hideCalendar = false;
            $scope.showPickUpCalendar = true;
            $scope.centreWorkingHours = [];
            $scope.availablePickUpTime = [];
                $scope.userSelectedService = {};
            var today = new Date();
            var currentTime = today.getHours();

            $scope.setFiveDay = function (date, type) {
                var day = date.getDate();
                var nextDate;
                for (var i = 0; i < 5; i++) {
                    var WH = [];
                    var tempDate = new Date(date);
                    tempDate.setDate(day);
                    nextDate = tempDate;
                    var datepart = nextDate.toDateString();
                    for (var j = 0; j < $scope.timeToDisplay.length; j++) {

                        var time = formatTime($scope.timeToDisplay[j]);
                        var isAvailable = checkAvailibility($scope.timeToDisplay[j], nextDate);
                        var obj = { time: time, isAvailable: isAvailable };

                        WH.push(obj);
                    }
                    $scope.centreWorkingHours.push({ day: datepart, WorkingHours: WH });
                    day++;
                    if (i === 0) {
                        if (today.toDateString() === nextDate.toDateString()) {
                            $scope.disablePrevBtn = true;
                        } else {
                            $scope.disablePrevBtn = false;
                        }
                    }

                }
            }
            $scope.selectedDate = { pickUpDate: {}, dropOffDate: {} };

            function formatTime(time) {
                //   var d = new Date(date);
                var hh = time;
                var dd = "AM";
                var h = hh;
                if (h >= 12) {
                    h = hh - 12;
                    dd = "PM";
                }
                if (h == 0) {
                    h = 12;
                }

                return h + " " + dd;
                /* if you want 2 digit hours:
                h = h<10?"0"+h:h; */

                //var pattern = new RegExp("0?" + hh);

                //var replacement = h;
                ///* if you want to add seconds
                //replacement += ":"+s;  */
                //replacement += " " + dd;

                //return time.replace(pattern, replacement);
            }

            function checkAvailibility(time, date) {
                if (date.toDateString() === today.toDateString()) {
                    if (currentTime < time)
                        return true;
                    else
                        return false;
                } else {
                    return true;;
                }


            }
            function disableDates(date, time, selectedDate, selectedTime) {
                date = new Date(date);
                selectedDate = new Date(selectedDate);

                if (date.toDateString() === selectedDate.toDateString()) {
                    var time1 = time.split(" ");
                    var time2 = selectedTime.split(" ");
                    time1 = time1[1] === "AM" ? time1[0] : time1[0] !== 12 ? 12 + time1[0] :time1[0];
                    time2 = time2[1] === "AM" ? time2[0] : time2[0] !== 12 ? 12 + time2[0] : time2u[0];
                    if (parseInt(time1) <= parseInt(time2))
                        return true;
                    else
                        return false;
                } else if (date >= selectedDate) {
                    return false;;
                }
                else {
                    return true;;
                }
            }
            $scope.selectpickUpTime = function (dateTime) {
                $.extend(true,$scope.availablePickUpTime, $scope.centreWorkingHours);

                $.each($scope.availablePickUpTime, function (index, val) {
                    $.each(val.WorkingHours, function (i, value) {
                        value.isDisabled = disableDates(val.day, value.time, dateTime.day, dateTime.time);
                    })
                });
                $scope.selectedDate.dropOffDate = {};
                $scope.selectedDate.pickUpDate.day = dateTime.day;
                $scope.selectedDate.pickUpDate.time = dateTime.time;
                $scope.showPickUpCalendar = false;
                $scope.showDropCalendar = true;
                psDataServices.setSelectedAppointment($scope.selectedDate);
                 $scope.userSelectedService = psDataServices.getSelectedService();
            }
            $scope.selectDropTime = function (dateTime) {
                $scope.selectedDate.dropOffDate.day = dateTime.day;
                $scope.selectedDate.dropOffDate.time = dateTime.time;
                $scope.showDropCalendar = false;
                $scope.hideCalendar = true;
                psDataServices.setSelectedAppointment($scope.selectedDate);
                $scope.userSelectedService = psDataServices.getSelectedService();
            }

            $scope.nextDates = function (type) {
                var date = type === "prev" ? $scope.centreWorkingHours[0].day : $scope.centreWorkingHours[$scope.centreWorkingHours.length - 1].day;
                date = new Date(date);
                var day = date.getDate();
                type === "prev" ? date.setDate(day - 5) : date.setDate(day + 1);
                $scope.centreWorkingHours = [];
                $scope.setFiveDay(date, type);
            }
            $scope.setFiveDay(today);
            $scope.editPickUpDate = function () {
                $scope.showPickUpCalendar = !$scope.showPickUpCalendar;
                if ($scope.showPickUpCalendar) {
                    $scope.hideCalendar = false;
                    $scope.showDropCalendar = false;
                } else {
                    $scope.hideCalendar = true;
                }
                //  $scope.hideDropCalendar = true;
            }
            $scope.editDropDate = function () {
                $scope.showDropCalendar = !$scope.showDropCalendar;
                if ($scope.showDropCalendar) {
                    $scope.hideCalendar = false;
                    $scope.showPickUpCalendar = false;
                }
                else {
                    $scope.hideCalendar = true;
                }
            }
        }

        ]

    };
});
