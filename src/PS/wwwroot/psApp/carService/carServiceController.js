angular.module("psApp").controller("carServiceController",["$scope","psDataServices", function ($scope,psDataServices) {
  
    $scope.showBrandName = true; $scope.showMakeYears = false; $scope.showModel = false; $scope.selectedCar = {};// $scope.selectedCar = { brandName: '', model: '', year:'',varient:'' };

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
        $scope.selectedCar.varient = varient;
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