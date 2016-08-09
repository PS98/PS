"use strict";

angular.module("psApp").directive("bookAppointment", function () {
    return {
        templateUrl: "psApp/carService/bookAppointment/bookAppointment.html",
        controller: ["$scope", "psDataServices", function ($scope, psDataServices) {
            $scope.centre = psDataServices.getSelectedCentre();
            var openingHours = amPmToHours($scope.centre.openingHours);
            var closingHours = amPmToHours($scope.centre.closingHours);
            $scope.dateToDisplay = [];
            $scope.hideCalendar = false;
            $scope.showPickUpCalendar = true;
            $scope.centreWorkingHours = [];
            $scope.availablePickUpTime = [];
                setAvailableTime();
            var today = new Date();
            var currentTime = today.getHours();
            var todayDay = today.getDate();
            var maxDate = new Date();
            maxDate.setDate(todayDay + 14);
            $scope.setFiveDay = function (date, time) {
                var day = date.getDate();
                var nextDate, centreWorkingHours = [];
             
                for (var i = 0; i < 8; i++) {
                    var wh = [];
                    var tempDate = new Date(date);
                    tempDate.setDate(day);
                    nextDate = tempDate;
                    var datepart = nextDate.toDateString();
                    if ($scope.selectedDate.pickUpDate.day === datepart && time) {
                        var time1 = time.split(" ");
                        time1 = time1[1] === "AM" ? time1[0] : time1[0] !== 12 ? 12 + parseInt(time1[0]) : time1[0];
                        var index = $scope.timeToDisplay.indexOf(parseInt(time1) + 6);
                        if (index > -1)
                            $scope.timeToDisplay.splice(0, index);
                        else {
                            $scope.timeToDisplay = [];
                        }
                    } 
                    else {
                        setAvailableTime();
                    }
                    $.each($scope.timeToDisplay, function (i, v) {
                        var obj;
                        if (checkAvailibility(v, nextDate)) {
                            obj = { time: formatTime(v) };
                            wh.push(obj);
                        }
                        //else {
                        //    obj = { time: formatTime(v) };
                        //    wh.push(obj);
                        //}
                    });

                    if (wh.length > 0 && tempDate.getDay() !== $scope.centre.holiday)
                        centreWorkingHours.push({ day: datepart, WorkingHours: wh });
                    day++;
                    // if (i === 0) {

                    //  }
                    if (centreWorkingHours.length === 5 || maxDate.toDateString() === datepart) {
                        break;
                    }
                }
                return centreWorkingHours;
            }
            function enableDisableButton(workingHrsList, isPickUpDone) {
                var nextAvailableDate = new Date($scope.selectedDate.pickUpDate.day);
                if (isPickUpDone) {
                    nextAvailableDate.setDate(parseInt($scope.selectedDate.pickUpDate.day.split(" ")[2]) + 1);
                }
                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);    // check for tomorrow if no date available today
                var dayAfterTomorrow = new Date();
                dayAfterTomorrow.setDate(today.getDate() + 2);   // check for dayAfterTomorrow if tomorrow is holiday of service centre
                if (today.toDateString() === workingHrsList[0].day || tomorrow.toDateString() === workingHrsList[0].day || dayAfterTomorrow.toDateString() === workingHrsList[0].day) {
                    $scope.disablePrevBtn = true;
                }
                else if (isPickUpDone && ($scope.selectedDate.pickUpDate.day === workingHrsList[0].day || nextAvailableDate.toDateString() === workingHrsList[0].day)) {
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
                if (h === 0) {
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
            function amPmToHours(time) {
                console.log(time);
                if (time) {
                    var hours = Number(time.match(/^(\d+)/)[1]);
                    var minutes = Number(time.match(/:(\d+)/)[1]);
                    var ampm = time.match(/\s(.*)$/)[1];
                    ampm = ampm.toLowerCase();
                    if (ampm === "pm" && hours < 12) hours = hours + 12;
                    if (ampm === "am" && hours === 12) hours = hours - 12;
                    hours = minutes !== 0 ? hours + 1 : hours;
                    var sHours = hours.toString();
                    return (sHours);
                }
            }

            function checkAvailibility(time, date) {
                if (date.toDateString() === today.toDateString()) {
                    if (currentTime < time)
                        return true;
                    else
                        return false;
                } else {
                    return true;
                }


            }

                function setAvailableTime() {
                    $scope.timeToDisplay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
                    if (openingHours && $scope.timeToDisplay.indexOf(parseInt(openingHours)) > -1) {
                        $scope.timeToDisplay = $scope.timeToDisplay.slice($scope.timeToDisplay.indexOf(parseInt(openingHours)), $scope.timeToDisplay.length);
                    }
                    if (closingHours && $scope.timeToDisplay.indexOf(parseInt(closingHours)) > -1) {
                        closingHours = closingHours === "12" ? "24" : closingHours;
                        $scope.timeToDisplay.splice($scope.timeToDisplay.indexOf(parseInt(closingHours)), $scope.timeToDisplay.length);
                    }
                }
            $scope.pickAndDrop = function (val) {
                if (val === "y") {
                    $scope.pickUp = !$scope.pickUp; $scope.both = true; $scope.noPickUp = !$scope.pickUp;
                    $scope.onlyDropOff = false; $scope.onlyPickUP = false;
                }
                else if (val === 0) {
                    $scope.noPickUp = !$scope.noPickUp; $scope.pickUp = !$scope.noPickUp; $scope.both = $scope.pickUp;
                    $scope.onlyDropOff = false; $scope.onlyPickUP = false;
                }
                else if (val === 1) {
                    $scope.both = true; $scope.onlyPickUP = false; $scope.onlyDropOff = false;
                }
                else if (val === 2) {
                    $scope.onlyPickUP = !$scope.onlyPickUP;
                    $scope.both = !$scope.onlyPickUP;
                    $scope.onlyDropOff = false;
                } else {
                    $scope.onlyDropOff = !$scope.onlyDropOff; $scope.both = !$scope.onlyDropOff; $scope.onlyPickUP = false;
                }
                setPickUpDetails();
            }

            function setPickUpDetails() {
                var type = $scope.both ? "both" : $scope.onlyPickUP ? "onlyPickUP" : "onlyDropOff";

                var pickUpDetails = { "isPickUp": $scope.pickUp, "Type": type }
                psDataServices.setPickUpDetails(pickUpDetails);
            }
            function disableDates(date, time, selectedDate, selectedTime) {
                date = new Date(date);
                selectedDate = new Date(selectedDate);

                if (date.toDateString() === selectedDate.toDateString()) {
                    var time1 = time.split(" ");
                    var time2 = selectedTime.split(" ");
                    time1 = time1[1] === "AM" ? time1[0] : time1[0] !== 12 ? 12 + time1[0] : time1[0];
                    time2 = time2[1] === "AM" ? time2[0] : time2[0] !== 12 ? 12 + time2[0] : time2[0];
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
                var date = new Date(dateTime.day);
                $scope.availablePickUpTime = $scope.setFiveDay(date, dateTime.time);
                enableDisableButton($scope.availablePickUpTime, true);
                $scope.showPickUpCalendar = false;
                $scope.showDropCalendar = true;
                psDataServices.setSelectedAppointment($scope.selectedDate, $scope.pickUp);
                setPickUpDetails();
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
                var backDayNo = $scope.centre.holiday === 7 ? 5 : 6;
                type === "prev" ? date.setDate(day - backDayNo) : date.setDate(day + 1);
                // $scope.centreWorkingHours = [];
                if ($scope.showPickUpCalendar) {
                    $scope.centreWorkingHours = $scope.setFiveDay(date);
                    enableDisableButton($scope.centreWorkingHours);
                }
                else {
                    $scope.availablePickUpTime = $scope.setFiveDay(date, $scope.selectedDate.pickUpDate.time);
                    enableDisableButton($scope.availablePickUpTime, true);
                }
            }

            $scope.centreWorkingHours = $scope.setFiveDay(today);
            enableDisableButton($scope.centreWorkingHours);
            $scope.editPickUpDate = function () {
                $scope.showPickUpCalendar = !$scope.showPickUpCalendar;
                if ($scope.showPickUpCalendar) {
                    $scope.hideCalendar = false;
                    $scope.showDropCalendar = false;
                    enableDisableButton($scope.centreWorkingHours);
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
                    enableDisableButton($scope.availablePickUpTime, true);
                }
                else {
                    $scope.hideCalendar = true;
                }
            }
        }

        ]

    };
});
