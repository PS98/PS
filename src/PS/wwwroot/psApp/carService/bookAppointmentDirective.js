"use strict";

angular.module("psApp").directive("bookAppointment", function() {
    return {
        templateUrl: "psApp/carService/bookAppointment.html",
        link: function(scope, element, attrs) {

        },
        controller: function ($scope) {
            $scope.dateToDisplay = []; $scope.timeToDisplay = [8,9,10,11,12,13,14,15,16,17,18,19,20];
            $scope.centreWorkingHours = [];
            var today = new Date();
            var currentTime = today.getHours();

            $scope.setFiveDay = function (date,type) {
                var day = date.getDate();
               var nextDate = new Date();
                for (var i = 0; i < 4; i++) {
                    var WH = [];
                    if (type === "prev")
                        nextDate.setDate(day - 4 + i);
                    else if(type ==="next")
                        nextDate.setDate(day +1+ i);
                    else
                    nextDate.setDate(day + i);
                    var datepart = nextDate.toDateString();
                    // dateToDisplay.push(datepart);
                    for (var j = 0; j < $scope.timeToDisplay.length; j++) {

                        var time = formatTime($scope.timeToDisplay[j]);
                        var isAvailable = checkAvailibility($scope.timeToDisplay[j], nextDate);
                        var obj = { time: time, isAvailable: isAvailable };

                        WH.push(obj);
                    }
                    $scope.centreWorkingHours.push({ day: datepart, WorkingHours: WH });
                }
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

                return h +"" + dd;
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

            $scope.selectTime = function(time) {
                $scope.isSelected = true;
            }

            $scope.nextDates = function (type) {
                var date = type === "prev" ? $scope.centreWorkingHours[0].day : $scope.centreWorkingHours[$scope.centreWorkingHours.length - 1].day;
                date = new Date(date);
                var day = date.getDate();

             //   date = type === "prev" ? today.setDate(day + 1) : today.setDate(day - 4);
                $scope.centreWorkingHours = [];
                $scope.setFiveDay(date,type);


            }
            $scope.setFiveDay(today);
        }
    }
});