(function () {
    "use strict";

    //Using a module.
    var module = angular.module('myApp');
    module.factory("dataService", function ($http, $q) {
        var _topics = [];
        var _isInit = false;
        var _isReady = function () {
            return _isInit;
        };

        var _getTopics = function () {
            var deferred = $q.defer();
            $http.get("/api/topics?includeReplies=true")
            .then(function (result) {
                //Success
                angular.copy(result.data, _topics);
                _isInit = true;
                deferred.resolve();

            }, function () {
                //Error
                deferred.reject();
            });
            return deferred.promise;
        };

        var _addTopic = function (newTopic) {
            var deferred = $q.defer();

            $http.post("/api/topics", newTopic)
            .then(function (result) {
                //Success
                var newlyCreatedTopic = result.data;
                _topics.splice(0, 0, newlyCreatedTopic);
                deferred.resolve(newlyCreatedTopic);
            }, function () {
                //Error
                deferred.reject();
            });

            return deferred.promise;
        };

        function _findTopic(id) {
            var found = null;

            $.each(_topics, function (i, item) {
                if (item.id == id) {
                    found = item;
                    return false;
                }
            });

            return found;
        }

        var _getTopicById = function (id) {
            var deferred = $q.defer();

            if (_isReady()) {
                var topic = _findTopic(id);
                if (topic) {
                    deferred.resolve(topic);
                } else {
                    deferred.reject();
                }
            } else {
                _getTopics()
                .then(function () {
                    var topic = _findTopic(id);
                    if (topic) {
                        deferred.resolve(topic);
                    } else {
                        deferred.reject();
                    }
                }, function () {
                    deferred.reject();
                });
            }

            return deferred.promise;
        };

        var _saveReply = function (topic, newReply) {
            var deferred = $q.defer();

            $http.post("/api/topics/" + topic.id + "/replies", newReply)
           .then(function (result) {
               //Success
               if (topic.replies == null) {
                   topic.replies = [];
               }
               topic.replies.push(result.data);
               deferred.resolve(result.data);
           }, function () {
               //Error
               deferred.reject();
           });

            return deferred.promise;
        };

        return {
            topics: _topics,
            getTopics: _getTopics,
            addTopic: _addTopic,
            isReady: _isReady,
            getTopicById: _getTopicById,
            saveReply: _saveReply
        };

    });

})();