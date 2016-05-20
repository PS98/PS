"use strict";

angular.module("psApp").directive("bookAppointment", function () {
    return {
        templateUrl: "psApp/carService/bookAppointment/bookAppointment.html",
        link: function (scope, element, attrs) {

        },
        scope: false,
        controller: ["$scope", "psDataServices", function ($scope, psDataServices) {
            $scope.dateToDisplay = []; $scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
            $scope.hideCalendar = false;
            $scope.showPickUpCalendar = true;
            $scope.centreWorkingHours = [];
            $scope.availablePickUpTime = [];
            $scope.userSelectedService = {};
            var today = new Date();
            var currentTime = today.getHours();
            var todayDay = today.getDate();
            var maxDate = new Date();
            maxDate.setDate(todayDay + 14);
            $scope.setFiveDay = function (date, time) {
                var day = date.getDate();
                var nextDate, centreWorkingHours = [];

                for (var i = 0; i < 8; i++) {
                    var WH = [];
                    var tempDate = new Date(date);
                    tempDate.setDate(day);
                    nextDate = tempDate;
                    var datepart = nextDate.toDateString();
                    if ($scope.selectedDate.pickUpDate.day == datepart && time) {
                        var time1 = time.split(" ");
                        time1 = time1[1] === "AM" ? time1[0] : time1[0] !== 12 ? 12 + parseInt(time1[0]) : time1[0];
                        var index = $scope.timeToDisplay.indexOf(parseInt(time1) + 6)
                        if (index > -1)
                            $scope.timeToDisplay.splice(0, index);
                        else {
                            $scope.timeToDisplay = [];
                        }
                    }
                    else {
                        $scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                    }
                    $.each($scope.timeToDisplay, function (i, v) {
                        if (nextDate.toDateString() === today.toDateString() && checkAvailibility(v, nextDate)) {
                            var obj = { time: formatTime(v) };
                            WH.push(obj);
                        }
                        else {
                            var obj = { time: formatTime(v) };
                            WH.push(obj);
                        }
                    });

                    if (WH.length > 0)
                        centreWorkingHours.push({ day: datepart, WorkingHours: WH });
                    day++;
                    // if (i === 0) {

                    //  }
                    if (centreWorkingHours.length == 5 || maxDate.toDateString() == datepart) {
                        break;
                    }
                }
                return centreWorkingHours;
            }
            function enableDisableButton(workingHrsList, isPickUpDone) {
                var nextAvailableDate = new Date();
                if (isPickUpDone) {
                    nextAvailableDate.setDate(parseInt($scope.selectedDate.pickUpDate.day.split(" ")[2]) +1);
                }

                if (today.toDateString() === workingHrsList[0].day) {
                    $scope.disablePrevBtn = true;
                }
                else if (isPickUpDone && ($scope.selectedDate.pickUpDate.day === workingHrsList[0].day ||nextAvailableDate.toDateString() === workingHrsList[0].day)) {
                    $scope.disablePrevBtn = true;
                }
                else {
                    $scope.disablePrevBtn = false;
                }
                if (maxDate.toDateString() === workingHrsList[workingHrsList.length - 1].day) {
                    $scope.disableNextBtn = true;
                } else {
                    $scope.disableNextBtn = false;
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
                    time1 = time1[1] === "AM" ? time1[0] : time1[0] !== 12 ? 12 + time1[0] : time1[0];
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
                $scope.selectedDate.dropOffDate = {};
                $scope.selectedDate.pickUpDate.day = dateTime.day;
                $scope.selectedDate.pickUpDate.time = dateTime.time;
                var date = new Date();
                date.setDate(dateTime.day.split(" ")[2]);
                $scope.availablePickUpTime = $scope.setFiveDay(date, dateTime.time);
                enableDisableButton($scope.availablePickUpTime,true)
                $scope.showPickUpCalendar = false;
                $scope.showDropCalendar = true;
                psDataServices.setSelectedAppointment($scope.selectedDate);
                $scope.userSelectedService = psDataServices.getSelectedService();
                $scope.mapUrl = "http://maps.googleapis.com/maps/api/staticmap?&zoom=15&scale=false&size=500x300&maptype=roadmap&format=png&visual_refresh=true&markers=" + $scope.userSelectedService.userAddress.lat + "," + $scope.userSelectedService.userAddress.lng;
            }
            $scope.selectDropTime = function (dateTime) {
                $scope.selectedDate.dropOffDate.day = dateTime.day;
                $scope.selectedDate.dropOffDate.time = dateTime.time;
                $scope.showDropCalendar = false;
                $scope.hideCalendar = true;
                psDataServices.setSelectedAppointment($scope.selectedDate);
            }

            $scope.nextDates = function (type) {
                var currentFiveDay = $scope.showPickUpCalendar ? $scope.centreWorkingHours : $scope.availablePickUpTime;
                var date = type === "prev" ? currentFiveDay[0].day : currentFiveDay[$scope.centreWorkingHours.length - 1].day;
                date = new Date(date);
                var day = date.getDate();
                type === "prev" ? date.setDate(day - 5) : date.setDate(day + 1);
                // $scope.centreWorkingHours = [];
                if ($scope.showPickUpCalendar) {
                    $scope.centreWorkingHours = $scope.setFiveDay(date);
                    enableDisableButton($scope.centreWorkingHours)
                }
                else {
                    $scope.availablePickUpTime = $scope.setFiveDay(date, $scope.selectedDate.pickUpDate.time);
                    enableDisableButton($scope.availablePickUpTime,true)
                }
            }

            $scope.centreWorkingHours = $scope.setFiveDay(today);
            enableDisableButton($scope.centreWorkingHours)
            $scope.editPickUpDate = function () {
                $scope.showPickUpCalendar = !$scope.showPickUpCalendar;
                if ($scope.showPickUpCalendar) {
                    $scope.hideCalendar = false;
                    $scope.showDropCalendar = false;
                    enableDisableButton($scope.centreWorkingHours)
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
                    enableDisableButton($scope.availablePickUpTime, true)
                }
                else {
                    $scope.hideCalendar = true;
                }
            }
            $scope.centre = psDataServices.getSelectedCentre();
            }

        ]

    };
});
