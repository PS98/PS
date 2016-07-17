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
                scope.okay();
            }
            var id = attrs["overlayId"];
            if (id) {
                angular.element(".modal.fade.in").removeAttr("id").attr("id", id);
            }
        },
        templateUrl: "psApp/modalOverlay/modalOverlay.html",
    };
});