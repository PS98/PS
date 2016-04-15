
angular.module("psApp").directive("carServiceCategory", function () {

    return {
        scope: true,
        templateUrl: "psApp/carService/carServiceCategory.html",
        };

});
angular.module("psApp").filter("makeId", function() {

    return function(data) {
        if (data)
            return data.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_");
        else
            return "";
    }

});