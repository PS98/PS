(function () {
    "use strict";

    //Using a module.
    var module = angular.module('myApp');
    module.$inject = ["dataService"];
    module.controller('topicsController', topicsController);
    module.controller('newTopicController', newTopicController);
    module.controller('singleTopicController', singleTopicController);

    function topicsController($scope, $http, dataService) {
        $scope.data = dataService;
        $scope.isBusy = true;

        if (dataService.isReady() == false) {
            $scope.isBusy = true;
            dataService.getTopics()
             .then(function (result) {
                 //Success
             }, function () {
                 //Error
                 alert("Could not load topics.");
             }).finally(function () {
                 $scope.isBusy = true;
             });
        }
    }

    function newTopicController($scope, $http, $window, dataService) {
        $scope.newTopic = {};
        $scope.save = function () {
        dataService.addTopic($scope.newTopic)
            .then(function (result) {
                //Success
                $window.location = "#/";
            }, function () {
                //Error
                alert("Could not load topics.");
            }).finally(function () {
                $scope.isBusy = false;
        });
            
        }
    }

    function singleTopicController($scope, $routeParams, $window, dataService) {
        $scope.topic = null;
        $scope.newReply = {};
        dataService.getTopicById($routeParams.id)
            .then(function (topic) {
                //Success
                $scope.topic = topic;
            }, function () {
                //Error
                $window.location = "#/";
            });
        $scope.addReply = function () {
            dataService.saveReply($scope.topic, $scope.newReply)
             .then(function (topic) {
                 //Success
                 $scope.newReply.body = "";
             }, function () {
                 //Error
                 alert("Could not save the new reply.");
             });
        }
    }

})();