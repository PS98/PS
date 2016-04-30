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

   var _register = function (Firstname, Lastname, Email, Mobile, Password) {
       var deferred = $q.defer();
       $http.post("/api/Auth/Register?FirstName=" + Firstname + "&LastName=" + Lastname + "&Email=" + Email + "&Mobile=" + Mobile + "&Password=" + Password)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
   };

   var _subscribe = function (Name, Email) {
       var deferred = $q.defer();
       $http.post("/api/Auth/Subscribe?Name=" + Name + "&Email=" + Email)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
   };

 var _mobileVerification = function (Mobile) {
       var deferred = $q.defer();
     $http.post("/api/Auth/MobileOTP?MobileNumber=" + Mobile)
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

   var _updateProfile = function (data) {
       var deferred = $q.defer();
       $http.post("/api/Auth/UpdateProfile?firstName=" + data.firstName + "&lastName=" + data.lastName + "&mobile=" + data.mobile + "&email=" + data.email)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;

   };

   var _updatePassword = function (data) {
       var deferred = $q.defer();
       $http.post("/api/Auth/ChangePassword?email=" + data.email + "&oldPassword=" + data.oldPassword + "&newPassword=" + data.newPassword)
        .then(function (result) {
            //Success
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

       return deferred.promise;
       
   }
   return {
       login: _login,
       register: _register,
       forgotPassword: _forgotPassword,
       socialLogin: _socialLogin,
       socialCallback: _socialCallback,
       mobileVerification: _mobileVerification,
       subscribe: _subscribe,
       updatePassword: _updatePassword,
       updateProfile: _updateProfile
   };   
}])