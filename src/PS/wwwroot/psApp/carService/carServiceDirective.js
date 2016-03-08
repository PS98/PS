
angular.module("psApp").directive("carService", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/carService/carServiceTemplate.html",
        // controller: "indexController",
        link: function (scope, el, attrs) {

        }
    };
});