angular.module("psApp").controller("carServiceController",["$scope","psDataServices", function ($scope,psDataServices) {
  
    $scope.showBrandName = true; $scope.showMakeYears = false; $scope.showModel = false; $scope.selectedCar = {};// $scope.selectedCar = { brandName: '', model: '', year:'',varient:'' };
    $scope.car = {}; $scope.serviceOpts = {};  $scope.selectedJob = [];
    $scope.selectBrand = function (brandName) {
        $scope.showBrandName = false; $scope.showMakeYears = true; $scope.showModel = false; $scope.showVarient = false;
        if ($scope.selectedCar.brand != brandName) {
            $scope.selectedCar = {};
            $scope.selectedCar.brand = brandName;
            psDataServices.getCarType(brandName).
             success(function (data) {
                 $scope.carTypes = data;
             }).error(function () {
             });
        }
    }
    $scope.selectYear = function (year) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = true; $scope.showVarient = false;
        $scope.selectedCar.year = year;
    }
    $scope.selectModel = function (model) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = true;
        $scope.selectedCar.model = model;
        psDataServices.getCarVarient($scope.selectedCar.brand, model).
          success(function (data) {
              $scope.carVarientList = data;
          }).error(function () {
          });
    }
    $scope.selectVarient = function (varient) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = false;
        $scope.selectedCar.varient = varient; $scope.car.choose_a_service = true; $scope.car.chooseNewService = true; $scope.car.showServiceType = true;
        $scope.serviceOpts.viewMode = 'common';
    }
    $scope.editBrand = function () {
        $scope.showBrandName = !$scope.showBrandName; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = false;
        displayIncompleteModule();
    }
    $scope.editYear = function () {
        $scope.showBrandName = false; $scope.showMakeYears = !$scope.showMakeYears; $scope.showModel = false; $scope.showVarient = false;
        if (!$scope.showMakeYears) displayIncompleteModule();

    }
    $scope.editModel = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = !$scope.showModel; $scope.showVarient = false;
        if(!$scope.showModel) displayIncompleteModule();

    }
    $scope.editVarient = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = !$scope.showVarient;
      
    }


    $scope.commonServices = [{ id: 1, type: "Change Oil And Filter", details: true }, { id: 2, type: "Breake Pad Replacement", details: true }]
    $scope.changeView = function () {

        if ($scope.serviceOpts.viewMode == 'direct')
            $scope.commonServices = [{ id: 101, type: "Spare Tire Installation", details: true }, { id: 102, type: "Rotate Tare", details: true }];
        if ($scope.serviceOpts.viewMode == 'common')
            $scope.commonServices = [{ id: 1, type: "Change Oil And Filter", details: true }, { id: 2, type: "Breake Pad Replacement", details: true }]
        if($scope.serviceOpts.viewMode == 'mileage')
            $scope.commonServices = [{ id: 301, type: "10,0000 Milage Mantanance Service", details: true }, { id: 302, type: "15,0000 Milage Mantanance Service", details: true }]
        if ($scope.serviceOpts.viewMode == 'consultation') {
            var des_req = { id: 301, type: " Describe your problem here", details: false, addText: true }
            if (!$scope.selectedJob.includes(des_req))
                $scope.selectedJob.push(des_req);
            $scope.car.chooseNewService = false;
            $scope.serviceOpts.viewMode = 'common';
        }
    }

    $scope.addSelectedJob = function (selectedJob) {

        $scope.car.chooseNewService = false;
        if (!$scope.selectedJob.includes(selectedJob))
        $scope.selectedJob.push(selectedJob);
    }
    $scope.deleteSelectedJob = function (deletedJob) {
        if ($scope.selectedJob.indexOf(deletedJob)> -1)
            $scope.selectedJob.splice($scope.selectedJob.indexOf(deletedJob),1);
    }
    function displayIncompleteModule() {
        if (!$scope.showBrandName) {
            $scope.showMakeYears = $scope.selectedCar.year == undefined ? true : false;
            if (!$scope.showMakeYears)
                $scope.showModel = $scope.selectedCar.model == undefined ? true : false;
            if (!$scope.showModel)
                $scope.showVarient = $scope.selectedCar.varient == undefined ? true : false;
        }

    }
     psDataServices.getAllCarColletion().
        success(function (data) {
            $scope.carCollections = data.carList;
            $scope.yearsList = data.yearsList;
        }).error(function(){
        });
     
     
}]);
angular.module("psApp").controller("serviceTypeController", ["$scope", "psDataServices", function ($scope, psDataServices) {

  
   
    $scope.repairServices = [{ id: 101, type: "Spare Tire Installation", details: true }, { id: 102, type: "Rotate Tare", details: true }]


   
}]);
