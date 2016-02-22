"use strict";

angular.module("psApp").config(function ($provide) {
    $provide.decorator("$exceptionHandler", ["$delegate", function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);
            //TODO: Remove this line in production
            alert(exception.message);
        };
    }]);
});