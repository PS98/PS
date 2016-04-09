
angular.module("psApp").directive("carServiceCategory", function () {

    return {
        scope: true,
        templateUrl: "psApp/carService/carServiceCategory.html",
        };

});
angular.module("psApp").filter("makeId", function() {

    return function(data) {
        if (data)
            return data.replace(/ /g, "_").replace(/\(|\)|&|$|\@ |! |-|\+|,/g, "");
        else
            return "";
    }

});