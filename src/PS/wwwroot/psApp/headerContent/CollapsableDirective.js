angular.module("psApp").directive("collapsable",function ($timeout) {

        return {
            replace: true,
            scope: {
                data: "="
            },
            link: function (scope, el, attr) {

              templateUrl: "psApp/headerContent/CollapsableTemplate.html"
        }
    }
);
