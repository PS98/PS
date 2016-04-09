angular.module("psApp").directive("collapsable",function () {

        return {
            replace: true,
            scope: {
                data: "="
            },
            link:function(scope,el,attr) {
                $("body").delegate(".panel .collapse", "hide.bs.collapse", function () {
                    $(this).parent().find('.fa').toggleClass('fa-plus-circle fa-minus-circle');
                });
                $("body").delegate(".panel .collapse", "show.bs.collapse", function () {
                    $(this).parent().find('.fa').toggleClass('fa-plus-circle fa-minus-circle');
                });
            },
            templateUrl: "psApp/headerContent/CollapsableTemplate.html"
        }
    }
);
