"use strict";

angular.module("psApp").config(["$routeProvider", function ($routeProvider) {

    $routeProvider.

  when('/carDetails', {
      template: "<ps-car> </ps-car>"
  }).

  when('/viewStudents', {
      templateUrl: 'viewStudents.htm', controller: 'ViewStudentsController'
  }).

  otherwise({
      redirectTo: ''
  });

}]);