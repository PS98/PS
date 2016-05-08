angular.module("psApp").directive('modalDialog', function () {
    return {
        scope: {
            show: '=',
            okay:'&',
            informational:'=',
            message:'='
        },
        replace: true, // Replace with the template below
        link: function (scope, element, attrs) {
           //scope.dialogStyle = {};
            //if (attrs.width)
            //    scope.dialogStyle.width = attrs.width;
            //if (attrs.height)
            //    scope.dialogStyle.height = attrs.height;
            //scope.hideModal = function () {
            //    scope.show = false;
            //};
            if(scope.show)
            {
              //  $("#modalOverlay").modal('toggle');
            }
            scope.okayClick = function () {
                scope.okay()
            }
        },
        templateUrl: "ext-modules/modalOverlay/modalOverlay.html",
    };
});