angular.module("psApp").factory("psDataServices", ["$http", "$q", "$localStorage", function ($http, $q, $localStorage) {
    var selectedCar, selectedService, serviceNameList;
    var userServiceData= {selectedCar:'',selectedServices:'', selectedCentre:'',selectedAppointment:'',userDetails:''};
    userServiceData.userDetails = $localStorage.userDetails;

    
    var _getSelectedService = function () {
        return userServiceData;
    }
    var _setSelectedCarAndService = function (car, job,centre,appointment,user) {
        selectedCar = car;
        selectedService = job;
        userServiceData.selectedCar = car;
        userServiceData.selectedServices = job;
       // userServiceData.selectedCentre = centre;
      //  userServiceData.selectedAppointment = appointment;
    }
    var _setSelectedServiceName = function(servicesName) {
        serviceNameList = servicesName;
    }
    var _setSelectedAppointment = function (appointment) {
        userServiceData.selectedAppointment = appointment;
    }
    var _setPaymentMode = function (mode) {
        userServiceData.PaymentMode = mode;
    }
    var _getuserDetails = function (user) {
        return $localStorage.userDetails;
    }
    var _setSelectedCentre = function (centre) {
        userServiceData.selectedCentre = centre;
    }
    var _getAllCarCollection = function () {
     return  $http.get("/api/car");
    };
    var _getCarType = function (collectionName) {
        return $http.get("/api/car/"+collectionName);
                 
        };
    var _getCarVarient = function (collectionName, carType) {
        return $http.get("/api/car/" + collectionName + "/" + carType);
    }

    var _getServiceCentreCity = function (city) {
        return $http.get("/api/ServiceCentre/");
    }
    
    var _getServiceCentreArea = function (city) {
        return $http.get("/api/ServiceCentre/" + city);
    }
    var _getServiceCentreList = function (city, area) {
        var serviceList = serviceNameList;
        var data = { 'City': city, 'Area': area, 'Name': serviceList, 'Model': selectedCar.model, 'Varient': selectedCar.varient }
        return $http(
        {
            url: "/api/ServiceCentre/centerlist",
            method: "POST",
            data: data
    });
    }

    var _getAllService = function (city, area) {
        return $http.get("/api/services/all");
    }
    var _submitOrder = function (payment_id, payment_request_id) {
        var service = {};
        service.Name = userServiceData.selectedServices[0].name;
        service.Question = userServiceData.selectedServices[0].questions[0].question;
        service.Answer = userServiceData.selectedServices[0].questions[0].ans[0];
        var data = { "selectedServices": service, "InvoiceNo": "", "PaymentMode": userServiceData.PaymentMode, "PaymentId": payment_id, "PaymentRequestId": payment_request_id, "selectedCentre": userServiceData.selectedCentre, "selectedCar": userServiceData.selectedCar, "selectedAppointment": userServiceData.selectedAppointment, "userDetails": userServiceData.userDetails };
        return $http(
        {
            url: "/api/services/order",
            method: "POST",
            data: data
        });
    }
    var _payment = function () {
        var deferred = $q.defer();
        $http.post("/api/Auth/ProcessPayment?name=" + userServiceData.userDetails.userName + "&purpose=" + "MileMates Service Payment" + "&amount=" + userServiceData.selectedCentre.totalPrice + "&email=" + userServiceData.userDetails.email + "&phone=" + userServiceData.userDetails.phoneNo + "&send_email=" + false + "&send_sms=" + false)
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
        getAllCarColletion: _getAllCarCollection,
        getCarType: _getCarType,
        getCarVarient: _getCarVarient,
        getServiceCentreCity:_getServiceCentreCity,
        getServiceCentreArea: _getServiceCentreArea,
        getServiceCentreList: _getServiceCentreList,
        getAllService: _getAllService,
        setSelectedCarAndService: _setSelectedCarAndService,
        getSelectedService: _getSelectedService,
        setSelectedServiceName: _setSelectedServiceName,
        setSelectedCentre: _setSelectedCentre,
        setSelectedAppointment: _setSelectedAppointment,
        setPaymentMode:_setPaymentMode,
        getuserDetails: _getuserDetails,
        payment: _payment,
        submitOrder: _submitOrder
}
          
    
}])