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
    var _getuserDetails = function () {
        return userServiceData.userDetails;
    }
    var _setuserDetails = function (user) {
        userServiceData.userDetails = user;
        $localStorage.userDetails = user;
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

  

   

    var _setUserPreference = function () {
        var data = { "carDetails": userServiceData.selectedCar, "CustType": $localStorage.userDetails.customerType, "Email": $localStorage.userDetails.email }
        return $http(
       {
           url: "/api/car/save",
           method: "POST",
           data: data
       });
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
        setuserDetails:_setuserDetails,
        setUserPreference:_setUserPreference
}
          
    
}])