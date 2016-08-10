angular.module("psApp").controller("carServiceController", ["$scope", "$state", "$timeout", "$localStorage", "$rootScope", "psDataServices", "psLoginService", "$q", function ($scope, $state, $timeout, $localStorage, $rootScope, psDataServices, psLoginService, $q) {

    $rootScope.$broadcast("stickyHeader", { stickyHeader: true });
    $scope.center = {}; $localStorage.userData = $localStorage.userData || {};
    $scope.searchedText = {}; $scope.state = $state;
    var custRequest = { name: " Describe your problem here", type: [], addText: true };
    var prevMode, preService = [];
    $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.selectedCar = $localStorage.userData.car || {};// $scope.selectedCar = { brandName: '', model: '', year:'',varient:'' };
    $scope.car = {}; $scope.serviceOpts = {}; $scope.selectedJob = [];
    $scope.carList = {};
    $scope.car.service_selected = false;
    $scope.previousSelectedJob = $localStorage.userData.selectedServices || [];
    $scope.selectBrand = function (brandName) {
        $scope.showBrandName = false; $scope.showMakeYears = true; $scope.showModel = false; $scope.showVarient = false;
        if ($scope.selectedCar.brand !== brandName) {
            $scope.selectedCar = {};
            $scope.carList.carTypes = {};
            $scope.carList.carVarientList = {};
            $scope.selectedCar.brand = brandName;
            psDataServices.getCarType(brandName).
             success(function (data) {
                 $scope.carList.carTypes = data;
             }).error(function () {
             });
            psDataServices.setCentreDetails(undefined);
            $scope.displayActiveStep();
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
        $scope.displayActiveStep();
    }
    $scope.selectModel = function (model) {
        if ($scope.selectedCar.model !== model) {
            $scope.showBrandName = false;
            $scope.showMakeYears = false;
            $scope.showModel = false;
            if (model !== "") {
                $scope.selectedCar.model = model;
                $scope.selectedCar.varient = "";
                $scope.carList.carVarientList = ["Petrol", "Diesel"];
                $scope.showVarient = true;
            } else {
                $scope.selectedCar.model = "I Don't Know";
                $scope.selectedCar.varient = "I Don't Know";
                $scope.carList.carVarientList = {};

            }
            $localStorage.userData.car = $scope.selectedCar;
            psDataServices.setCentreDetails(undefined);
        } else {
            $scope.showModel = false;
        }
        $scope.displayActiveStep();
    }
    $scope.selectVarient = function (varient) {
        if ($scope.selectedCar.varient !== varient) {
            $scope.showBrandName = false;
            $scope.showMakeYears = false;
            $scope.showModel = false;
            $scope.showVarient = false;
            if (varient !== "")
                $scope.selectedCar.varient = varient;
            else {
                $scope.selectedCar.varient = "I Don't Know";

            }
            $localStorage.userData.car = $scope.selectedCar;
            $scope.car.showServiceType = true;
            $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
            $scope.commonServices = $scope.services.serviceDetails[0];
            psDataServices.setSelectedCarAndService($scope.selectedCar);
            psDataServices.setCentreDetails(undefined);
        }
        else {
            $scope.showVarient = false;
        }
        $scope.displayActiveStep();
    }
    $scope.editBrand = function () {
        $scope.showBrandName = !$scope.showBrandName; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = false;
        displayIncompleteModule();
        $scope.displayActiveStep();
    }
    $scope.editYear = function () {
        $scope.showBrandName = false; $scope.showMakeYears = !$scope.showMakeYears; $scope.showModel = false; $scope.showVarient = false;
        if (!$scope.showMakeYears) displayIncompleteModule();
        $scope.displayActiveStep();
    }
    $scope.editModel = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = !$scope.showModel; $scope.showVarient = false;
        if (!$scope.showModel) displayIncompleteModule();
        $scope.displayActiveStep();
    }
    $scope.editVarient = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = !$scope.showVarient;
        $scope.displayActiveStep();
    }


    $scope.commonServices = [];
    $scope.changeView = function () {
        if (this.service)
            $scope.serviceOpts.viewMode = this.service;
        else {
            $scope.serviceOpts.viewMode = "consultation";
        }
        $scope.commonServices = $scope.services.serviceDetails[$scope.services.serviceName.indexOf(this.service)];

        if ($scope.serviceOpts.viewMode === "consultation") {
            if ($scope.selectedJob.indexOf(custRequest) < 0)
                $scope.selectedJob.push(custRequest);
        }
    }

    $scope.addSelectedJob = function (selectedJob) {
        if (selectedJob.isSingleSelectJob && !selectedJob.selected) {
            var jobToRemove = $scope.selectedJob.filter(function (job) {
                return job.isSingleSelectJob === true;
            });
            if (jobToRemove.length > 0)
                $scope.deleteSelectedJob(jobToRemove[0]);

        }
        selectedJob.selected = !selectedJob.selected;
        if ($scope.selectedJob.indexOf(selectedJob) < 0) {
            $scope.selectedJob.push(selectedJob);
            psDataServices.setCentreDetails(undefined);
        } else {
            $scope.selectedJob.splice($scope.selectedJob.indexOf(selectedJob), 1);
        }
        var pos = $("#searchBox").offset().top;
        // pos = pos - 90;
        if ($scope.selectedJob.length > 0)
            $scope.scrollContent(pos);
    }
    $scope.deleteSelectedJob = function (deletedJob) {
        if ($scope.selectedJob.indexOf(deletedJob) > -1)
            $scope.selectedJob.splice($scope.selectedJob.indexOf(deletedJob), 1);
        deletedJob.selected = !deletedJob.selected;
        psDataServices.setCentreDetails(undefined);
        if ($scope.serviceOpts.viewMode === "consultation" && $scope.selectedJob.length === 0) {
            $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
            $scope.commonServices = $scope.services.serviceDetails[0];
        }
    }
    $scope.chooseAnswer = function (job, question, option) {
        if (!question.answer)
            question.answer = [];
        if (question.answer.indexOf(option) < 0) {
            if (!question.isMultiple)
                question.answer = [];
            question.answer.push(option);
        }

        else {
            question.answer.splice(question.answer.indexOf(option), 1);
        }
    }
    function displayIncompleteModule() {
        if (!$scope.showBrandName) {
            $scope.showMakeYears = $scope.selectedCar.year == undefined || $scope.selectedCar.year === "" ? true : false;
            if (!$scope.showMakeYears)
                $scope.showModel = $scope.selectedCar.model == undefined || $scope.selectedCar.model === "" ? true : false;
            if (!$scope.showModel)
                $scope.showVarient = $scope.selectedCar.varient == undefined || $scope.selectedCar.varient === "" ? true : false;
        }

    }

    if ($scope.selectedCar.brand) {
        displayIncompleteModule();
        fetchServiceDetails();
    } else {
        fetchCarCollection();
    }
    function fetchCarCollection() {
        psDataServices.getAllCarColletion().
       success(function (data) {
           $scope.carList.carCollections = data.carList;
           $scope.carList.yearsList = data.yearsList;
           if (!$scope.selectedCar.brand)
               fetchServiceDetails();
       }).error(function () {
       });
    }

    function fetchServiceDetails() {
        psDataServices.getAllService().
            success(function (data) {
                if ($scope.selectedCar.brand) {
                    fetchCarCollection();
                }
                $scope.services = data;
                $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
                $scope.commonServices = $scope.services.serviceDetails[0];
                $scope.setPreviousSelection();
                $scope.car.services = [];
                if ($scope.selectedCar.brand) {
                    getCarType($scope.selectedCar.brand).then(function () {
                        $scope.carList.carVarientList = ["Petrol", "Diesel"];
                        if ($scope.selectedCar.varient) {
                            $scope.car.showServiceType = true;
                            $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
                            if($scope.car.activeStep <= 2)
                            psDataServices.setSelectedCarAndService($scope.selectedCar);
                        }
                    });
                }
                else {
                    $scope.showBrandName = true;
                }
                $timeout(function () {
                    $.each($scope.services.serviceDetails, function (i, val) {
                        $.each(val, function (j, value) {
                            if ($scope.services.serviceName[i] === "Common Services" || $scope.services.serviceName[i] === "Scheduled Maintenance")
                                value.isSingleSelectJob = true;
                            $scope.car.services.push(value);
                        });
                    });
                  }, 200);
            }).error(function () {
            });
    }
    $scope.scrollContent = function (position) {

        var scroll = position ? position : 230;
        $("html, body").animate({
            scrollTop: scroll
        }, 'slow');
    }
    $scope.showDetails = function (types) {
        $scope.overlayData = types;
        $("#detailsModal").modal();

    }
    $scope.setUserJob = function () {
        var jobName = [];
        if (validateUserData()) {
            $.each($scope.selectedJob, function (index, value) {
                if (!value.addText)
                    jobName.push(value.name);
            });
            if ($scope.selectedJob.notes)
                $scope.selectedJob[0].notes = $scope.selectedJob.notes;
            psDataServices.setSelectedCarAndService($scope.selectedCar, $scope.selectedJob);
            psDataServices.setSelectedServiceName(jobName);
            $localStorage.userData.selectedServices = $scope.selectedJob;
            if ($scope.selectedJob.notes)
             $localStorage.userData.noteToMach = $scope.selectedJob.notes;
            $scope.changeStep(3);
        }
        else {
            $timeout(function () {
                $("html, body").animate({
                    scrollTop: 50
                }, 'fast');
            }, 100);
        }

    }
    $("body").click(function (event) {
        if (event.target)
            var id = event.target.id;
        if (id === "btnNext") {
            return false;
        }
        $scope.car.error = false;
        $scope.car.jobError = false;
       $scope.$apply();
    });
    $state.go("service.car");
    $scope.state = $state;

    $scope.search = function () {
        if (!prevMode) {
            prevMode = $scope.serviceOpts.viewMode;
            preService = $scope.commonServices;
        }

        if ($scope.searchedText.name && $scope.searchedText.name.length > 0) {
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
        return psDataServices.getCarType(brandName).
           success(function (data) {
               $scope.carList.carTypes = data;
           }).error(function () {
           });
    };
    //function getCarVarient(brand, model) {
    //    //   return psDataServices.getCarVarient(brand, model);

    //}

    $scope.setDefault = function () {
        psDataServices.setUserPreference();
    }

    function validateUserData() {
        $scope.car.error = false;
        $scope.car.jobError = false;
        if (!$scope.selectedCar.brand || $scope.selectedCar.brand === "") {
            $scope.errorMessage = "Please select your car's make.";
            $scope.car.error = true;
            return false;
        }
        if (!$scope.selectedCar.year || $scope.selectedCar.year === "") {
            $scope.errorMessage = "Please select your car's year.";
            $scope.car.error = true;
            return false;
        }
        if (!$scope.selectedCar.model || $scope.selectedCar.model === "") {
            $scope.errorMessage = "Please select your car's model.";
            $scope.car.error = true;
            return false;
        }
        if (!$scope.selectedCar.varient || $scope.selectedCar.varient === "") {
            $scope.errorMessage = "Please select your car's engine type.";
            $scope.car.error = true;
            return false;
        }
        if ($scope.selectedJob.length === 0) {
            $scope.errorMessage = "Please select a service.";
            $scope.car.jobError = true;
            return false;
        }
        if (!checkUnansweredQuestions()) {
            $scope.errorMessage = "Please answer the below question('s)";
            $scope.car.jobError = true;
            return false;
        }
        if ($scope.serviceOpts.addingNotes && (!$scope.selectedJob.notes || $scope.selectedJob.notes.trim() === "")) {
            $scope.errorMessage = "Please enter notes";
            $scope.car.jobError = true;
            return false;
        }
        return true;
    }
    function checkUnansweredQuestions() {
        var count = 0;
        $.each($scope.selectedJob, function (index, job) {
            if (job.questions)
                $.each(job.questions, function (i, que) {
                    if (que.answer && que.answer.length === 0) {
                        count++;
                    }
                });
            if (job.addText && (!job.request || job.request === "")) {
                count++;
            }
        });
        if (count > 0) {
            return false;
        }
        return true;

    }

    $rootScope.$on("userLoginSuccessfull", function () {
        $scope.changeStep(4);
    });

    $scope.setPreviousSelection = function () {
        if ($scope.previousSelectedJob.length > 0) {
            $scope.previousSelectedJob.forEach(function(job, index) {
                var selectedService = $scope.commonServices.find(function(data) {
                    return data.name === job.name;
                });
                if (selectedService) {
                    selectedService.selected = true;
                    $scope.selectedJob.push(selectedService);
                }
                if (job.addText) {
                    $scope.selectedJob.push(job);
                }
            });
            if ($scope.selectedJob.length > 0 && $localStorage.userData.noteToMach) {
                $scope.selectedJob.notes = $localStorage.userData.noteToMach;
                $scope.serviceOpts.addingNotes = true;
            }
            if ($scope.selectedJob.length > 0) {
                $scope.getScrollPosition(3).then(function(data) {
                    $scope.scrollContent(data);
                });
                $scope.setUserJob();
            } else {
                $scope.getScrollPosition(2).then(function(data) {
                    $scope.scrollContent(data);
                });
                $scope.changeStep(2);
            }
        } else if (!$scope.selectedCar.brand || !$scope.selectedCar.year || !$scope.selectedCar.model || !$scope.selectedCar.varient) {
            $scope.changeStep(1);
        } else {
            $scope.changeStep(2);
        }
    }
    $scope.changeSelectedService = function () {
        if($scope.selectedJob.length === 0)
        $scope.changeStep(2);
    }
    $scope.changeStep = function (step,e) {

        $scope.car.choose_a_service = false;
        $scope.car.service_selected = false;
        $scope.car.choose_centre = false;
        $scope.car.centre_selected = false;
        $scope.car.book_appointment = false;
        $scope.car.user_address = false;
        if (step === 1) {
            $scope.car.activeStep = 1;
        }
        else if (step === 2) {
            $scope.car.choose_a_service = true;
            $scope.car.activeStep = 2;
            $scope.getScrollPosition(2).then(function (data) {
             $scope.scrollContent(data);
            });
        }
        else if (step === 3) {
            $scope.car.service_selected = true;
            $scope.car.choose_centre = true;
            $scope.car.activeStep = 3;
            $scope.getScrollPosition(3).then(function (data) {
             $scope.scrollContent(data);
            });
        }
        else if (step === 4) {
                $scope.car.choose_centre = true;
                $scope.car.service_selected = true;
                $scope.car.centre_selected = true;
            if (psLoginService.isAuthenticated()) {
                $scope.car.book_appointment = true;
                $scope.car.appointment_booked = false;
                $scope.car.activeStep = 4;
                $scope.getScrollPosition(4).then(function (data) {
                $scope.scrollContent(data);
                });
            } else {
                $("#loginModal").modal("toggle");
                psDataServices.setNextButtonStatus(true);
            }
        }
        else if (step === 5) {
            $scope.car.service_selected = true;
            $scope.car.centre_selected = true;
            $scope.car.book_appointment = true;
            $scope.car.choose_centre = true;
            $scope.car.appointment_booked = true;
            $scope.car.user_address = true;
            $scope.car.activeStep = 5;
            $scope.getScrollPosition(5).then(function (data) {
             $scope.scrollContent(data);
            });
        }
        $scope.disableOtherStep(step);
    }

    $scope.displayActiveStep = function () {
        $scope.car.book_appointment = false;
        $scope.car.user_address = false;
        $scope.car.appointment_booked = false;
        $scope.car.choose_centre = false;
        if ($scope.showBrandName || $scope.showMakeYears || $scope.showModel || $scope.showVarient) {
            $scope.car.activeStep = 1;
            $scope.car.choose_a_service = false;
            if ($scope.selectedJob.length > 0)
                $scope.car.service_selected = true;
            $scope.scrollContent(1);
        } else {
          $scope.changeStep(2);  
        }
        $scope.disableOtherStep($scope.car.activeStep);
    }
    $scope.disableOtherStep = function (currentStep) {

        $scope.enable_step_2 = false;
        $scope.enable_step_3 = false;
        $scope.enable_step_4 = false;
        $scope.enable_step_5 = false;
        switch (currentStep) {
            case 2:
                $scope.enable_step_2 = true;
                break;
            case 3:
                $scope.enable_step_2 = true;
                $scope.enable_step_3 = true;
                break;
            case 4:
                $scope.enable_step_2 = true;
                $scope.enable_step_3 = true;
                $scope.enable_step_4 = true;
                break;
            case 5:
                $scope.enable_step_2 = true;
                $scope.enable_step_3 = true;
                $scope.enable_step_4 = true;
                $scope.enable_step_5 = true;
                break;
        }
    }
    $scope.isValidUser = function() {
        psLoginService.isUserLoggedIn().
            then(function (data) {
            
        },function() {
                
            })
    }

    $scope.getScrollPosition = function(step) {
        var deferred = $q.defer();
        $timeout(function() {
         var scrollPosition =   getLatesPosition(step);
         deferred.resolve(scrollPosition);
        }, 300);
        return deferred.promise;
    }

    function getLatesPosition(step) {
        var position;
        if (step === 1) {
            return 1;
        }
        if (step === 2) {
            position = $("#serviceContainer").position().top;
            return position ? position : 136;
        }
        if (step === 3) {
            position = $("#centreContainer").position().top;
            return position ? position : 274;
        }
        if (step === 4) {
            position = $("#bookingContainer").position().top;
            return position ? position : 473;
        }
        if (step === 5) {
            position = $("#addressContainer").position().top;
            return position ? position : 626;
        }
    }
$scope.deleteNotes = function() {
    $scope.serviceOpts.addingNotes = !$scope.serviceOpts.addingNotes;
    $scope.selectedJob.notes = "";
}
}]);


