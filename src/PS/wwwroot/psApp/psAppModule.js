"use strict";

angular.module("psApp", ["index", "ui.router", "ngStorage"]);


angular.module("psApp").directive('script', function () {
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
angular.module("psApp").controller('psController', function ($rootScope) {
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

