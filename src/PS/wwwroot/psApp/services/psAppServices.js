﻿angular.module("psApp").factory("psDataServices", ["$http", "$q", "$localStorage", function ($http, $q, $localStorage) {
    var selectedCar, selectedService, centreDetails = {},serviceNameList,isNextButtonClicked = false;
    var userServiceData = { selectedCar: {}, selectedServices: {},  selectedAppointment: {}, userDetails: {}, userAddress: {}, selectedCentre : {} };
    angular.extend(userServiceData.userDetails, $localStorage.userDetails);
    
    var _getSelectedService = function () {
        return userServiceData;
    }
    var _setSelectedCarAndService = function (car, job) {
        selectedCar = car;
        selectedService = job;
        userServiceData.selectedCar = car;
        userServiceData.selectedServices = job;
    }
    var _setSelectedServiceName = function(servicesName) {
        serviceNameList = servicesName;
    }
    var _getSelectedServiceName = function () {
       return  serviceNameList;
    }
    var _setSelectedAppointment = function (appointment) {
        userServiceData.selectedAppointment.pickUpDate = appointment.pickUpDate;
        userServiceData.selectedAppointment.dropOffDate = appointment.dropOffDate;
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
    var _getuserAddress = function () {
        return userServiceData.userAddress;
    }
    var _setuserAddress = function (details) {
        userServiceData.userAddress = details;
        angular.extend(userServiceData.userDetails, details);
        //$localStorage.userAddress = details;
        // $localStorage.userAddress.lat = $localStorage.userData.lat;
        //  $localStorage.userAddress.lng = $localStorage.userData.lng;
    }
    var _setCentreDetails = function (centre) {
        centreDetails = centre;
        if(centre)
        userServiceData.selectedCentre = centre.selectedCentre;
    }
    var _getCentreDetails = function () {
        return centreDetails;
    }
    var _getSelectedCentre = function () {
        return userServiceData.selectedCentre;
    }
    var _getPickUpDetails = function () {
        return userServiceData.selectedAppointment.pickUpDetails;
    }
    var _setPickUpDetails = function (pickUpDetails) {
         userServiceData.selectedAppointment.pickUpDetails = pickUpDetails;
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

    var _checkAccess = function () {
        return $http.get("/api/Auth/CheckAdminAccess/");
    }

    var _getServiceCentreList = function (city, area) {
        var serviceList = serviceNameList;
        var data = { 'City': city, 'Area': area, 'Name': serviceList, 'Model': selectedCar.model, 'Type': selectedCar.varient, "Latitude": userServiceData.userAddress.lat, "Longitude": userServiceData.userAddress.lng }
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
    var _getMockData = function () {
        return $http(
      {
          url: "/psApp/data/serviceCentre.json",
          method: "get",
      });

    }

    var _saveCentreDetails = function (centreData) {
      //  var list = [];
       // list.push(centreData);
       // var data = { "Area": centreData.Area, "Centres": list, "nearAreas": centreData.nearAreas }
        return $http(
       {
           url: "/api/ServiceCentre/savecentre",
           method: "POST",
           data: centreData
       });
    }
    var _resetAll = function() {
        userServiceData = { selectedCar: {}, selectedServices: {}, selectedAppointment: {}, userDetails: {}, userAddress: {}, selectedCentre: {} };
        angular.extend(userServiceData.userDetails, $localStorage.userDetails);
    }
    var _setNextButtonStatus = function (status) {
        isNextButtonClicked = status;
    }
    var _getNextButtonStatus = function() {
        return isNextButtonClicked;
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
        getSelectedServiceName: _getSelectedServiceName,
        setCentreDetails: _setCentreDetails,
        getCentreDetails: _getCentreDetails,
        getSelectedCentre: _getSelectedCentre,
        setSelectedAppointment: _setSelectedAppointment,
        setPaymentMode:_setPaymentMode,
        getuserDetails: _getuserDetails,
        setuserDetails: _setuserDetails,
        getuserAddress: _getuserAddress,
        setuserAddress: _setuserAddress,
        setUserPreference:_setUserPreference,
        geMockData: _getMockData,
        saveCentreDetails: _saveCentreDetails,
        setPickUpDetails: _setPickUpDetails,
        getPickUpDetails: _getPickUpDetails,
        resetAll: _resetAll,
        checkAccess: _checkAccess,
        setNextButtonStatus: _setNextButtonStatus,
        getNextButtonStatus: _getNextButtonStatus

}
          
    
}])