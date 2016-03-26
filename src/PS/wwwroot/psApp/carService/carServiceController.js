angular.module("psApp").controller("carServiceController", ["$scope", "psDataServices", function ($scope, psDataServices) {
    

   
    $scope.showBrandName = true; $scope.showMakeYears = false; $scope.showModel = false; $scope.selectedCar = {};// $scope.selectedCar = { brandName: '', model: '', year:'',varient:'' };
    $scope.car = {}; $scope.serviceOpts = {};  $scope.selectedJob = [];
    $scope.carList = {};
    $scope.selectBrand = function (brandName) {
        $scope.showBrandName = false; $scope.showMakeYears = true; $scope.showModel = false; $scope.showVarient = false;
        if ($scope.selectedCar.brand != brandName) {
            $scope.selectedCar = {};
            $scope.carList.carTypes = {};
            $scope.carList.carVarientList = {};
            $scope.selectedCar.brand = brandName;
            psDataServices.getCarType(brandName).
             success(function (data) {
                 $scope.carList.carTypes = data;
             }).error(function () {
             });
        }
    }
    $scope.selectYear = function (year) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = true; $scope.showVarient = false;
        $scope.selectedCar.year = year;
    }
    $scope.selectModel = function (model) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; 
        $scope.selectedCar.model = model; $scope.selectedCar.varient = '';
        psDataServices.getCarVarient($scope.selectedCar.brand, model).
          success(function (data) {
              $scope.carList.carVarientList = data;
              $scope.showVarient = true;
          }).error(function () {
                $scope.selectVarient("");
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


    $scope.commonServices = [{ id: 1, type: "Essential Car Care", details: [{ heading: "Essential Services", Description: "Our Essential car care package combines a f full oil changes and oil filter replacement with a number of vehicle safety checks." }] },
        { id: 2, type: "Interim Service", details: [{ heading: "Interim Service", Description: "We recommend having an Interim Service every 6,000 miles or 6 months (whichever is sooner) and includes checks on essentials such as lights, windsceen wipers and tyres plus a full brake, exhaust and suspension inspection." }] },
        { id: 3, type: "Full Service", details: [{ heading: "Full Service", deescriptions: "Our Full Service is ideal as an annual maintenance proggramme for your car. We recommend your car receives a Full Service every 12,000 miles or 12 months- whichever is sooner. Our Full Service includes all items included in the Interim Service package plus a through inspection of your engine plus wheel alignment, wheel bearing and break fluid condition." }] }];
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
            $scope.carList.carCollections = data.carList;
            $scope.carList.yearsList = data.yearsList;
        }).error(function(){
        });
     
     
}]);

