"use strict";

angular.module("app").factory("dataService",
    ["$timeout",
        function ($timeout) {

            var locations = [
                {
                    id: 1000,
                    name: "Ganga River",
                    temperature: 26,
                    guides: 20,
                    rafts: 18,
                    vests: 200,
                    image: "river1.jpg"
                },
                {
                    id: 1001,
                    name: "Yamuna River",
                    temperature: 30,
                    guides: 12,
                    rafts: 26,
                    vests: 243,
                    image: "river2.jpg"
                },
                {
                    id: 1002,
                    name: "Kaveri River",
                    temperature: 22,
                    guides: 26,
                    rafts: 19,
                    vests: 178,
                    image: "river3.jpg"
                },
                {
                    id: 1003,
                    name: "Godavari River",
                    temperature: 20,
                    guides: 19,
                    rafts: 24,
                    vests: 210,
                    image: ""
                },
                {
                    id: 1004,
                    name: "Narmada River",
                    temperature: 17,
                    guides: 29,
                    rafts: 37,
                    vests: 312,
                    image: "river4.jpg"
                },
            ];

            var employees = [
                {
                    id: 5000,
                    name: "Shobhit",
                    location: "Ganga River",
                    image: "emp1.jpg"
                },
                {
                    id: 5001,
                    name: "Archit",
                    location: "Yamuna River",
                    image: "emp2.jpg"
                },
                {
                    id: 5002,
                    name: "Ayush",
                    location: "Kaveri River",
                    image: "emp3.jpg"
                },
                {
                    id: 5003,
                    name: "Akshat",
                    location: "Godavari River",
                    image: "emp4.jpg"
                }
            ];

            var getLocations = function () {
                return $timeout(function () {
                    return locations;
                }, 500);
            };

            var getLocation = function (id) {
                var timeout = $timeout(function () {
                    //$timeout.cancel(timeout);
                    //return undefined;
                    for (var i = 0; i < locations.length; i++) {
                        if (locations[i].id == id)
                            return locations[i];
                    }
                }, 300);

                return timeout;
            };

            var getEmployees = function () {
                return $timeout(function () {
                    return employees;
                }, 500);
            };

            var getEmployee = function (id) {
                return $timeout(function () {
                    for (var i = 0; i < employees.length; i++) {
                        if (employees[i].id == id)
                            return employees[i];
                    }
                }, 300);
            };
            return {
                getLocations: getLocations,
                getLocation: getLocation,
                getEmployees: getEmployees,
                getEmployee: getEmployee
            };
        }
    ]);