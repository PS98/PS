(function () {
    "use strict";
    //Creating a module.
    var module = angular.module("myApp", ["ngRoute", "appDirective"])
    .config(function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "topicsController",
            controllerAs: "vm",
            templateUrl: "/template/topicsView.html"
        });

        $routeProvider.when("/newMessage", {
            controller: "newTopicController",
            controllerAs: "vm",
            templateUrl: "/template/NewTopicView.html"
        });

        $routeProvider.when("/message/:id", {
            controller: "singleTopicController",
            controllerAs: "vm",
            templateUrl: "/template/singleTopicView.html"
        });

        $routeProvider.otherwise({ redirectTo: "/" });
    });


})();