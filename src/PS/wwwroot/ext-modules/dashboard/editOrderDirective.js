"use strict"
angular.module("psApp").directive("editOrder", function () {
    return {
        templateUrl: "ext-modules/dashboard/editOrder.html",
        controller: "dashboardController",
        replace: true,
        link: function (scope, el, attrs) {
            scope.dateToDisplay = [];
            scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            scope.hideCalendar = false;
            scope.showPickUpCalendar = true;
            scope.centreWorkingHours = [];
            scope.availableDropTime = [];
            var today = new Date();
            var currentTime = today.getHours();
            scope.setFiveDay = function (date) {
                scope.centreWorkingHours = setDate(date);
            }
            scope.setFiveDay(today);
            function setDate(date, time) {
                var day = date.getDate();
                var nextDate, centreWorkingHours = [];

                for (var i = 0; i < 8; i++) {
                    var WH = [];
                    var tempDate = new Date(date);
                    tempDate.setDate(day);
                    nextDate = tempDate;
                    var datepart = nextDate.toDateString();
                    if (scope.changedDate.pickUpDate.day == datepart && time) {
                        scope.timeToDisplay.splice(0, scope.timeToDisplay.indexOf(parseInt(time.split(" ")[0]) + 6));
                    }
                    else {
                        scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

                    }
                    $.each(scope.timeToDisplay, function (i, v) {
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
                    if (i === 0) {
                        if (today.toDateString() === nextDate.toDateString()) {
                            scope.disablePrevBtn = true;
                        } else {
                            scope.disablePrevBtn = false;
                        }
                    }
                    if (centreWorkingHours.length == 5) {
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
            scope.editPickupDate = function (dateTime) {
                scope.changedDate.dropOffDate = {};
                scope.changedDate.pickUpDate.day = dateTime.day;
                scope.changedDate.pickUpDate.time = dateTime.time;
                scope.showPickUpCalendar = false;
                scope.showDropCalendar = true;
                var date = new Date();
                date.setDate(dateTime.day.split(" ")[2]);
                scope.availablePickUpTime = setDate(date, dateTime.time);;

            }
            scope.togglePickUp = function () {
                scope.showPickUpCalendar = !scope.showPickUpCalendar
            }
            scope.toggleDropOff = function () {
                scope.showDropCalendar = !scope.showDropCalendar;
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
                if (scope.showPickUpCalendar)
                    scope.centreWorkingHours = setDate(date);
                else
                    scope.availablePickUpTime = setDate(date, scope.changedDate.pickUpDate.time);
            }
        }

    }

});