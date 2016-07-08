angular.module("psApp").factory("psOrderDetailsService", ["$http", "$q", "$localStorage", "psDataServices", function ($http, $q, $localStorage, psDataServices) {
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
        if (payment_id != "") {
            orderDetails = $localStorage.userSelectionData;
        }
        var deferred = $q.defer();
        orderDetails.PaymentId = payment_id;
        orderDetails.PaymentRequestId = payment_request_id;
        orderDetails.PaymentResponse = response;
        var data = orderDetails;// { "selectedServices": service, "InvoiceNo": "", "PaymentMode": orderDetails.PaymentMode, "PaymentId": payment_id, "PaymentRequestId": payment_request_id, "PaymentResponse": response, "selectedCentre": orderDetails.selectedCentre, "selectedCar": orderDetails.selectedCar, "selectedAppointment": orderDetails.selectedAppointment, "userDetails": orderDetails.userDetails };
        $http(
        {
            url: "/api/services/order",
            method: "POST",
            data:data
        }).then(function (result) {
            $localStorage.userSelectionData = "";
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
        $http.post("/api/Auth/ProcessPayment?name=" + orderDetails.userDetails.userName + "&purpose=" + "MileMates Service Payment" + "&amount=" + orderDetails.selectedCentre.totalMMPrice + "&email=" + orderDetails.userDetails.email + "&phone=" + orderDetails.userDetails.phoneNo + "&send_email=" + false + "&send_sms=" + false)
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
                url: "/api/orderdetails/order?email=" + $localStorage.userDetails.email + "&status=" + status, method: "GET", cache: false
            }).then(function (result) {
                //Success
                deferred.resolve(result.data);
            }, function (error) {
                //Error
                deferred.reject(error);
            });

        return deferred.promise;
    }
    var _cancelOrder = function (invoiceNo, email, isOrder) {
        var deferred = $q.defer();
        isOrder = isOrder ? isOrder : false;
        $http(
            {
                url: "/api/OrderDetails/cancelorder?invoiceNo=" + invoiceNo + "&email=" + email + "&listOrder=" + isOrder, method: "GET", cache: false
            }).then(function (result) {
                //Success
                deferred.resolve(result.data);
            }, function (error) {
                //Error
                deferred.reject(error);
            });

        return deferred.promise;
    }
    var _editDateAndTime = function (invoiceNo, changedDate) {

        var date = { dropOffDate: '', pickUpDate: '' };
        date.dropOffDate = changedDate.dropOffDate;
        // var data = { 'InvoiceNo': invoiceNo, 'dropOffDate': changedDate.dropOffDate.day, "dropOffTime": changedDate.dropOffDate.time, "pickUpDate": changedDate.pickUpDate.day, "pickUpTime": changedDate.pickUpDate.time, };

        var deferred = $q.defer();
        $http(
            {
                url: "/api/OrderDetails/editOrder?InvoiceNo=" + invoiceNo + "&dropOffDate=" + changedDate.dropOffDate.day + "&dropOffTime=" + changedDate.dropOffDate.time + "&pickUpDate=" + changedDate.pickUpDate.day + "&pickUpTime=" + changedDate.pickUpDate.time,
                method: "POST",
                // data: data
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
    var _getOrderById = function (invoiceNo) {
        var deferred = $q.defer();
        $http(
            {
                url: "/api/OrderDetails/getorder?id=" + invoiceNo, method: "GET", cache: false
            }).then(function (result) {
                //Success
                deferred.resolve(result.data);
            }, function (error) {
                //Error
                deferred.reject(error);
            });

        return deferred.promise;
    }
    var _updateSelectedOrder  = function(order) {
        var deferred = $q.defer();
        $http(
            {
                url: "/api/OrderDetails/updateorder", method: "POST", cache: false, data: order
            }).then(function (result) {
                //Success
                deferred.resolve(result.data);
            }, function (error) {
                //Error
                deferred.reject(error);
            });

        return deferred.promise;
    }
    var _getPriceList = function(id) {
        var deferred = $q.defer();
        $http(
            {
                url: "/api/ServiceCentre/priceList?id="+id, method: "Get", cache: false
            }).then(function (result) {
                //Success
                deferred.resolve(result.data);
            }, function (error) {
                //Error
                deferred.reject(error);
            });

        return deferred.promise;
    }
    var updateSingleRow = function(updatedRow) {
        var deferred = $q.defer();
        $http(
        {
            url: "/api/ServiceCentre/price/update",
            method: "POST",
            cache: false,
            data: updatedRow
    }).then(function (result) {
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
        getAllPendingOrder: _getAllPendingOrder,
        cancelOrder: _cancelOrder,
        editDateAndTime: _editDateAndTime,
        getOrderById: _getOrderById,
        updateSelectedOrder:_updateSelectedOrder,
        getPriceList:_getPriceList,
        updateRow:updateSingleRow

    }

}]);