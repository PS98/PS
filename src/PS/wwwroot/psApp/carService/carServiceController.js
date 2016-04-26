angular.module("psApp").controller("carServiceController", ["$scope", "$state", "$timeout", "$localStorage", "psDataServices", function ($scope, $state, $timeout, $localStorage, psDataServices) {

    $scope.center = {}; $localStorage.userSelection = $localStorage.userSelection || {};
    $scope.searchedText = {};    $scope.state = $state;
    var custRequest = { name: " Describe your problem here", type: [], addText: true };
    var prevMode, preService = [];
    $scope.showBrandName = true; $scope.showMakeYears = false; $scope.showModel = false; $scope.selectedCar = $localStorage.userSelection;// $scope.selectedCar = { brandName: '', model: '', year:'',varient:'' };
    $scope.car = {}; $scope.serviceOpts = {}; $scope.selectedJob = [];
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
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showVarient = false;
        if (year !== "")
            $scope.selectedCar.year = year;
        else {
            $scope.selectedCar.year = "I Don't Know";
        }
        if (!$scope.selectedCar.model)
             $scope.showModel = true;
        psDataServices.setSelectedCarAndService($scope.selectedCar);
        displayIncompleteModule();
    }
    $scope.selectModel = function (model) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false;
        if (model !== "") {
            $scope.selectedCar.model = model;
            $scope.selectedCar.varient = '';
           getCarVarient($scope.selectedCar.brand, model).
                    success(function (data) {
                        if (data.length > 0) {
                            $scope.carList.carVarientList = data;
                            $scope.showVarient = true;
                        } else {
                            $scope.car.choose_a_service = true; $scope.car.showServiceType = true;
                            $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
                            psDataServices.setSelectedCarAndService($scope.selectedCar);
                        }
                    }).error(function () {
                        $scope.selectVarient("");
                    });

        } else {
            $scope.selectedCar.model = "I Don't Know";
            $scope.selectedCar.varient = "I Don't Know";
              $scope.carList.carVarientList = { };

        }
        $localStorage.userSelection = $scope.selectedCar;

    }
    $scope.selectVarient = function (varient) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = false;
        if (varient !== "")
            $scope.selectedCar.varient = varient;
        else {
            $scope.selectedCar.varient = "I Don't Know";

        }
        $localStorage.userSelection = $scope.selectedCar;
        $scope.car.choose_a_service = true; $scope.car.showServiceType = true;
        $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
         psDataServices.setSelectedCarAndService($scope.selectedCar);
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
        if (!$scope.showModel) displayIncompleteModule();

    }
    $scope.editVarient = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = !$scope.showVarient;

    }


    $scope.commonServices = [];
    $scope.changeView = function (event) {
        if(this.service)
        $scope.serviceOpts.viewMode = this.service;
        else {
            $scope.serviceOpts.viewMode = "consultation";
        }
        $scope.commonServices = $scope.services.serviceDetails[$scope.services.serviceName.indexOf(this.service)];
      
        if ($scope.serviceOpts.viewMode === "consultation") {
            if (!$scope.selectedJob.includes(custRequest))
                $scope.selectedJob.push(custRequest);
         }
    }

    $scope.addSelectedJob = function (selectedJob) {
        if (selectedJob.isSingleSelectJob && !selectedJob.selected) {
            var jobToRemove = $scope.selectedJob.filter(function (job) {
                return job.isSingleSelectJob === true;
            });
          if(jobToRemove.length>0)
            $scope.deleteSelectedJob(jobToRemove[0]);

        }
        selectedJob.selected = !selectedJob.selected;
        if (!$scope.selectedJob.includes(selectedJob))
            $scope.selectedJob.push(selectedJob);
        else {
            $scope.selectedJob.splice($scope.selectedJob.indexOf(selectedJob), 1);
        }
    }
    $scope.deleteSelectedJob = function (deletedJob) {
        if ($scope.selectedJob.indexOf(deletedJob) > -1)
            $scope.selectedJob.splice($scope.selectedJob.indexOf(deletedJob), 1);
        deletedJob.selected = !deletedJob.selected;

        if ($scope.serviceOpts.viewMode === "consultation" && $scope.selectedJob.length === 0) {
            $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
            $scope.commonServices = $scope.services.serviceDetails[0];
        }
    }
    $scope.chooseAnswer = function(job, question, option) {
        if (!question.ans)
            question.ans = [];
        if (!question.ans.includes(option)) {
            if (!question.isMultiple)
                question.ans = [];
                question.ans.push(option);
        }
    
    else {
            question.ans.splice(question.ans.indexOf(option), 1);
        }
    }
    function displayIncompleteModule() {
        if (!$scope.showBrandName) {
            $scope.showMakeYears = $scope.selectedCar.year == undefined || $scope.selectedCar.year ==="" ? true: false;
            if (!$scope.showMakeYears)
                $scope.showModel = $scope.selectedCar.model == undefined || $scope.selectedCar.model === "" ? true : false;
            if (!$scope.showModel)
                $scope.showVarient = $scope.selectedCar.varient == undefined || $scope.selectedCar.varient === "" ? true : false;
        }

    }
    psDataServices.getAllCarColletion().
       success(function (data) {
           $scope.carList.carCollections = data.carList;
           $scope.carList.yearsList = data.yearsList;
           fetchServiceDetails();
           
        }).error(function () {
       });

    function fetchServiceDetails() {
        psDataServices.getAllService().
            success(function(data) {
                $scope.services = data;
                $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
                $scope.commonServices = $scope.services.serviceDetails[0];
                $scope.car.services = [];
                if ($localStorage.userSelection.brand) {
                    $scope.showBrandName = false;
                    getCarType($localStorage.userSelection.brand).then(function () {
                        getCarVarient($localStorage.userSelection.brand, $localStorage.userSelection.model).
                            success(function (data) {
                                $scope.carList.carVarientList = data;
                                $scope.car.choose_a_service = true; $scope.car.showServiceType = true;
                                $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
                                psDataServices.setSelectedCarAndService($scope.selectedCar);
                        }).error(function () {
                            $scope.selectVarient("");
                        });;
                    })
                }
                $timeout(function() {
                    $.each($scope.services.serviceDetails, function(i, val) {
                        $.each(val, function (j, value) {
                            if ($scope.services.serviceName[i] === "Common Services" || $scope.services.serviceName[i] === "Scheduled Maintenance")
                            value.isSingleSelectJob = true;
                           $scope.car.services.push(value);
                        });
                    });
                },200);
            }).error(function() {
            });
    }

    $scope.showDetails = function (types) {
        $scope.overlayData = types;
        $("#detailsModal").modal();

    }
    $scope.setUserJob = function() {
        var jobName = [];
        $.each($scope.selectedJob, function(index,value) {
            jobName.push(value.name);
        });
        psDataServices.setSelectedCarAndService($scope.selectedCar, $scope.selectedJob);
        psDataServices.setSelectedServiceName(jobName);
        if (psDataServices.getuserDetails())
            $state.go("service.centre");
        else {
            $("#loginModal").modal('toggle');
        }
    }

 $state.go("service.car");
    $scope.state = $state;

    $scope.search = function () {
        if (!prevMode) {
            prevMode = $scope.serviceOpts.viewMode;
            preService = $scope.commonServices;
        }

        if ($scope.searchedText.name && $scope.searchedText.name.length > 0 ) {
            $scope.commonServices = $scope.car.services;
            $scope.serviceOpts.viewMode = "search";

        } else {
            $scope.clearSearch();
        }

    }
    $scope.clearSearch = function () {
        $scope.serviceOpts.viewMode = prevMode;
        $scope.commonServices = preService;
        prevMode = undefined;
        $scope.searchedText.name = "";
        prevMode = undefined;
    }

    function getCarType(brandName) {
      return  psDataServices.getCarType(brandName).
         success(function (data) {
             $scope.carList.carTypes = data;
         }).error(function () {
         });
    };
    function getCarVarient(brand, model) {
        return psDataServices.getCarVarient(brand, model);
                   
    }
}]);



