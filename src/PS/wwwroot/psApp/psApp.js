"use strict";

var indexApp = angular.module("index", ["ngStorage"]);
var app = angular.module("psApp", ["index", "ui.router", "ngStorage", "ngCookies"]);


app.directive('script', function () {
        return {
            restrict: 'E',
            scope: false,
            link: function (scope, elem, attr) {
                if (attr.type == 'text/javascript-lazy') {
                    var code = elem.text();
                    var f = new Function(code);
                    f();
                }
            }
        };
});
app.controller('psController', function ($rootScope) {
    $rootScope.$on("$routeChangeStart",
                 function (event, current, previous, rejection) {
                     var $preloader = $('#page-preloader'),
                        $spinner = $preloader.find('.spinner-loader');
                     $preloader.show();
                    $spinner.fadeOut();
                    $preloader.delay(50).fadeOut('slow');
                    $preloader.hide();
                 });
});

app.service('LoadingInterceptor', ['$q', '$rootScope', '$log',
function ($q, $rootScope, $log) {
    'use strict';

    var xhrCreations = 0;
    var xhrResolutions = 0;

    function isLoading() {
        return xhrResolutions < xhrCreations;
    }

    function updateStatus() {
        $rootScope.loading = isLoading();
    }

    return {
        request: function (config) {
            xhrCreations++;
            updateStatus();
            return config;
        },
        requestError: function (rejection) {
            xhrResolutions++;
            updateStatus();
            $log.error('Request error:', rejection);
            return $q.reject(rejection);
        },
        response: function (response) {
            xhrResolutions++;
            updateStatus();
            return response;
        },
        responseError: function (rejection) {
            xhrResolutions++;
            updateStatus();
            $log.error('Response error:', rejection);
            return $q.reject(rejection);
        }
    };
}]);