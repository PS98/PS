angular.module("psApp").directive("collapsable",function ($timeout) {

        return {
            replace: true,
            scope: {
                data: "="
            },
            templateUrl: "psApp/headerContent/CollapsableTemplate.html"
        }
    }
);
