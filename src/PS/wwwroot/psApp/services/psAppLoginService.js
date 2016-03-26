angular.module("psApp").factory("psLoginService", ["$http", "$q", function ($http, $q) {
   
   var _login = function (Email, Password) {
        var deferred = $q.defer();
       $http.post("/api/Auth/Login?Email=" + Email + "&Password=" + Password)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

        return deferred.promise;
   };

   var _register = function (Username, Email, Password) {
       var deferred = $q.defer();
       $http.post("/api/Auth/Register?Username=" + Username + "&Email=" + Email + "&Password=" + Password)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
   };

   var _forgotPassword = function (Email) {
       var deferred = $q.defer();
       $http.post("/api/Auth/ForgotPassword?Email=" + Email)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
   };

   var _socialLogin = function (type) {
       var deferred = $q.defer();
       $http.post("/api/Auth/SocialLogin?Id=" + type)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
   };

   var _socialCallback = function (data) {
      
       var deferred = $q.defer();
       $http.post("/api/Auth/Success?Code=" + data.code)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
   };
   return {
       login: _login,
       register: _register,
       forgotPassword: _forgotPassword,
       socialLogin: _socialLogin,
       socialCallback: _socialCallback,
   };   
}])