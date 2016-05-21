angular.module("psApp").directive('modalDialog', function () {
    return {
        scope: {
            okay:'&',
            informational:'=',
            message:'='
        },
        replace: true, // Replace with the template below
        link: function (scope, element, attrs) {
            scope.okayClick = function () {
                scope.okay()
            }
        },
        templateUrl: "psApp/modalOverlay/modalOverlay.html",
    };
});