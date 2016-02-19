(function () {

    "use strict";

    //Creating a module.
    angular.module("appDirective", [])
        .directive("waitCursor", waitCursor);

    function waitCursor() {
        return {
            scope: {
                show: "=displayWhen"
            },
            restrict: "E",
            templateUrl: "/template/waitCursor.html"
        };
    }

})();