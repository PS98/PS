angular.module("psApp").factory("psOrderDetailsService", ["$http", "$q", "$localStorage", "psDataServices", function ($http, $q, $localStorage,psDataServices) {
    var orderDetails, submittedOrder;

    var _validateOrder = function (payment_id, payment_request_id) {
        var data = { 'PaymentId': payment_id, 'PaymentRequestId': payment_request_id }
        return $http(
        {
            url: "/api/services/validateOrder",
            method: "POST",
            data: data
        });
    }
    var _submitOrder = function (payment_id, payment_request_id, response) {
        orderDetails = psDataServices.getSelectedService();
        var deferred = $q.defer();
        orderDetails.PaymentId = payment_id;
        orderDetails.PaymentRequestId = payment_request_id;
        orderDetails.PaymentResponse = response;
        var data = orderDetails;// { "selectedServices": service, "InvoiceNo": "", "PaymentMode": orderDetails.PaymentMode, "PaymentId": payment_id, "PaymentRequestId": payment_request_id, "PaymentResponse": response, "selectedCentre": orderDetails.selectedCentre, "selectedCar": orderDetails.selectedCar, "selectedAppointment": orderDetails.selectedAppointment, "userDetails": orderDetails.userDetails };
        $http(
        {
            url: "/api/services/order",
            method: "POST",
            data: data
        }).then(function (result) {
            submittedOrder = result.data.result;
            deferred.resolve(result.data);
        }, function (error) {
            //Error
            deferred.reject(error);
        });
        return deferred.promise;
    }
    var _payment = function () {
        orderDetails = psDataServices.getSelectedService();

        var deferred = $q.defer();
        $http.post("/api/Auth/ProcessPayment?name=" + orderDetails.userDetails.userName + "&purpose=" + "MileMates Service Payment" + "&amount=" + orderDetails.selectedCentre.totalPrice + "&email=" + orderDetails.userDetails.email + "&phone=" + orderDetails.userDetails.phoneNo + "&send_email=" + false + "&send_sms=" + false)
         .then(function (result) {
             //Success
             deferred.resolve(result.data);
         }, function (error) {
             //Error
             deferred.reject(error);
         });

        return deferred.promise;
    }

    var _getSubmittedOrder = function () {
        return submittedOrder;
    }
    var _getAllPendingOrder = function (status) {
        var deferred = $q.defer();
        $http(
            {
                url: "/api/OrderDetails/order?email="+ $localStorage.userDetails.email+"&status="+ status , method: "GET"
            }).then(function (result) {
            //Success
            deferred.resolve(result.data.result);
        }, function (error) {
            //Error
            deferred.reject(error);
        });

        return deferred.promise;
    }
    var _cancelOrder = function (invoiceNo,email) {
        var deferred = $q.defer();
        $http(
            {
                url: "/api/OrderDetails/cancelorder?invoiceNo=" + invoiceNo + "&email=" + email, method: "GET"
            }).then(function (result) {
                //Success
                deferred.resolve(result.data.result);
            }, function (error) {
                //Error
                deferred.reject(error);
            });

        return deferred.promise;
    }
    var _editDateAndTime = function (invoiceNo, changedDate) {
        var deferred = $q.defer();
        $http(
            {
                url: "/api/OrderDetails/editOrder?invoiceNo=" + invoiceNo + "&appointment=" + changedDate, method: "POST"
            })
       // var data;
       // if (isdroffOff)
       //     data = { 'invoiceNo': invoiceNo, 'changeDate': changedDate.dropOffDate.day, "changeTime": changedDate.dropOffDate.time, "isdroffOff": isdroffOff };
       // else {
       //     data = { 'invoiceNo': invoiceNo, 'changeDate': changedDate.pickUpDate.day, "changeTime": changedDate.pickUpDate.time, "isdroffOff": isdroffOff };
       // }
       // $http(
       //{
       //    url: "/api/OrderDetails/editOrder",
       //    method: "POST",
       //    data: data
    //})
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
        payment: _payment,
        validateOrder: _validateOrder,
        submitOrder: _submitOrder,
        getsubmittedOrder: _getSubmittedOrder,
        getAllPendingOrder:_getAllPendingOrder,
        cancelOrder: _cancelOrder,
        editDateAndTime: _editDateAndTime
    }

}]);