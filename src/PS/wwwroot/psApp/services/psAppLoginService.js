angular.module("psApp").factory("psLoginService", ["$http", "$q", function ($http, $q) {
   
   var _login = function (Email, Password) {
        var deferred = $q.defer();
       $http.post("/api/Auth/Login?Email=" + Email + "&Password=" + Password)
        .then(function (result) {
            //Success
            var res = result.data;
            deferred.resolve(res);
        }, function () {
            //Error
            deferred.reject();
        });

        return deferred.promise;
   };

   var _register = function (Username, Email, Password) {
       var deferred = $q.defer();
       $http.post("/api/Auth/Register?Username=" + Username + "&Email=" + Email + "&Password=" + Password)
        .then(function (result) {
            //Success
            var res = result.data;
            deferred.resolve(res);
        }, function () {
            //Error
            deferred.reject();
        });

       return deferred.promise;
   };

   return {
       login: _login,
       register: _register,
   };
          
    
}])