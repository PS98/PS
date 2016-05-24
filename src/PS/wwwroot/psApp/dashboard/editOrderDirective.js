"use strict"
angular.module("psApp").directive("editOrder", function () {
    return {
        templateUrl: "psApp/dashboard/editOrder.html",
        controller: "dashboardController",
        replace: true,
        link: function (scope, el, attrs) {
            scope.dateToDisplay = [];
            scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
            scope.hideCalendar = false;
            scope.showPickUpCalendar = true;
            scope.centreWorkingHours = [];
            scope.availableDropTime = [];
            var today = new Date();
            var currentTime = today.getHours();
            var todayDay = today.getDate();
            var maxDate = new Date();
            maxDate.setDate(todayDay + 14);
            scope.setFiveDay = function (date) {
                scope.centreWorkingHours = setDate(date);
            }
            scope.setFiveDay(today);
            enableDisableButton(scope.centreWorkingHours);
            function setDate(date, time) {
                var day = date.getDate();
                var nextDate, centreWorkingHours = [];

                for (var i = 0; i < 8; i++) {
                    var wh = [];
                    var tempDate = new Date(date);
                    tempDate.setDate(day);
                    nextDate = tempDate;
                    var datepart = nextDate.toDateString();
                    if (scope.changedDate.pickUpDate.day === datepart && time) {
                        var time1 = time.split(" ");
                        time1 = time1[1] === "AM" ? time1[0] : time1[0] !== 12 ? 12 + parseInt(time1[0]) : time1[0];
                        var index = scope.timeToDisplay.indexOf(parseInt(time1) + 6);
                        if (index > -1)
                            scope.timeToDisplay.splice(0, index);
                        else {
                            scope.timeToDisplay = [];
                        }
                        
                    }
                    else {
                        scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

                    }
                    $.each(scope.timeToDisplay, function (i, v) {
                        if (nextDate.toDateString() === today.toDateString() && checkAvailibility(v, nextDate)) {
                            var obj = { time: formatTime(v) };
                            wh.push(obj);
                        }
                        else {
                            var obj = { time: formatTime(v) };
                            wh.push(obj);
                        }
                    });

                    if (wh.length > 0)
                        centreWorkingHours.push({ day: datepart, WorkingHours: wh });
                    day++;
                    if (centreWorkingHours.length === 5 || maxDate.toDateString() == datepart) {
                        break;
                    }
                }
                return  centreWorkingHours;
            }
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
            scope.editPickupDate = function (dateTime) {
                scope.changedDate.dropOffDate = {};
                scope.changedDate.pickUpDate.day = dateTime.day;
                scope.changedDate.pickUpDate.time = dateTime.time;
                scope.showPickUpCalendar = false;
                scope.showDropCalendar = true;
                var date = new Date();
                date.setDate(dateTime.day.split(" ")[2]);
                scope.availablePickUpTime = setDate(date, dateTime.time);
                enableDisableButton(scope.availablePickUpTime, true);

            }
            scope.togglePickUp = function () {
                scope.showPickUpCalendar = !scope.showPickUpCalendar;
                scope.showDropCalendar = false;
                enableDisableButton(scope.centreWorkingHours);
            }
            scope.toggleDropOff = function () {
                scope.showPickUpCalendar = false;
                scope.showDropCalendar = !scope.showDropCalendar;
                enableDisableButton(scope.availablePickUpTime, true);
            }
            scope.editDropDate = function (dateTime) {
                scope.changedDate.dropOffDate.day = dateTime.day;
                scope.changedDate.dropOffDate.time = dateTime.time;
                scope.showDropCalendar = false;
                scope.hideCalendar = true;

                //   psDataServices.setSelectedAppointment(scope.changedDate);
            }
            scope.openCalender = function (order) {
                $("#editOrder").modal('toggle');
                scope.editOrder = order;
                scope.showPickUpCalendar = true;
                scope.showDropCalendar = false;
            }
            scope.nextDates = function (type) {
                var currentFiveDay = scope.showPickUpCalendar ? scope.centreWorkingHours : scope.availablePickUpTime;
                var date = type === "prev" ? currentFiveDay[0].day : currentFiveDay[scope.centreWorkingHours.length - 1].day;
                date = new Date(date);
                var day = date.getDate();
                type === "prev" ? date.setDate(day - 5) : date.setDate(day + 1);
                if (scope.showPickUpCalendar) {
                    scope.centreWorkingHours = setDate(date);
                    enableDisableButton(scope.centreWorkingHours);
                } else {
                    scope.availablePickUpTime = setDate(date, scope.changedDate.pickUpDate.time);
                    enableDisableButton(scope.availablePickUpTime, true);
                }
            }
            function enableDisableButton(workingHrsList, isPickUpDone) {
                var nextAvailableDate = new Date();
                if (isPickUpDone) {
                    nextAvailableDate.setDate(parseInt(scope.changedDate.pickUpDate.day.split(" ")[2]) + 1);
                }

                if (today.toDateString() === workingHrsList[0].day) {
                    scope.disablePrevBtn = true;
                }
                else if (isPickUpDone && (scope.changedDate.pickUpDate.day === workingHrsList[0].day || nextAvailableDate.toDateString() === workingHrsList[0].day)) {
                    scope.disablePrevBtn = true;
                }
                else {
                    scope.disablePrevBtn = false;
                }
                if (maxDate.toDateString() === workingHrsList[workingHrsList.length - 1].day) {
                    scope.disableNextBtn = true;
                } else {
                    scope.disableNextBtn = false;
                }
            }
        }

    }

});