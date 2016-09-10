angular.module("psApp").controller("addCentreDetailsController", [
        "$scope", "$state", "psDataServices", "psOrderDetailsService", "psLoginService", "$rootScope",
        function($scope, $state, psDataServices, psOrderDetailsService, psLoginService, $rootScope) {
            $('.jelect').jelect();

          $scope.carList = {};
          $scope.newCentre = true;
            $scope.hide = false;
         $scope.centreDetails = {};
            $scope.showBrandName = true;
            var centreObject = {};
            var obj = function() {
                this["ModelList"] = [];
                this["MilematePrice"] = 0;
                this["ActualPrice"] = 0;
                this["ServiceCentrePrice"] = 0;

            }
            var serviceObj = function() {

                this["Name"] = "";
                this["Radius"] = "";
                this["Petrol"] = [];
                this["Diesel"] = [];
                this["CNG"] = [];
                this["Electric"] = [];
            }
            psDataServices.geMockData().
                success(function(data) {
                    $scope.centreDetails = data;
                    angular.extend(centreObject, data);
                })
                .error(function() {
                });

            psDataServices.getAllCarColletion().
                success(function(data) {
                    $scope.carList.carCollections = data.carList;

                }).error(function() {
                });
            $scope.selectBrand = function(brandName) {
                $scope.showBrandName = false;
                $('.jelect').jelect();

                $scope.showModel = true;
                $scope.brand = brandName;
                $scope.modelList = $scope.modelList || [];
                psDataServices.getCarType(brandName).
                    success(function(data) {
                        $scope.carList.carTypes = data;
                    }).error(function() {
                    });
            }
            $scope.selectModel = function(type) {
                $scope.modelList = $scope.modelList || [];

                if ($scope.modelList.indexOf(type) < 0)
                    $scope.modelList.push(type);
                else {
                    $scope.modelList.splice($scope.modelList.indexOf(type), 1);
                }

            }
            $scope.addCentreDetails = function() {
                var services = new serviceObj();
                var model = new obj();
                $scope.centreDetails.Services = $scope.selectedServices;
                if ($scope.modelList && $scope.modelList.length > 0) {
                    model.ModelList = $scope.modelList;
                    model.ActualPrice = $scope.centreDetails.ActualPrice;
                    model.MilematePrice = $scope.centreDetails.MilematePrice;
                    model.ServiceCentrePrice = $scope.centreDetails.ServiceCentrePrice;
                    services.Name = $scope.centreDetails.service;
                    services.Radius = $scope.centreDetails.radius;
                    $scope.centreDetails.ServiceDetails = [];
                    switch ($scope.centreDetails.type) {
                    case "Petrol":
                        services.Petrol.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "Diesel":
                        services.Diesel.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "CNG":
                        services.CNG.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "Electric":
                        services.Electric.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    }
                }
                console.log($scope.centreDetails);
                if ($scope.centreDetails.CentreId || $scope.newCentre)
                    psDataServices.saveCentreDetails($scope.centreDetails).
                        success(function(data) {
                            alert(data.message);
                            if (data.status === 0) {
                                // $scope.centreDetails = {};
                                //  angular.extend($scope.centreDetails, centreObject);
                                $scope.centreDetails.CentreId = parseInt(data.id);
                                $scope.newCentre = false;
                                $scope.selectedServices = [];
                            }
                        });
            }
            $scope.editBrand = function() {
                $scope.showBrandName = !$scope.showBrandName;
                $scope.showModel = !$scope.showModel;
            }
            
            $scope.openOverlay = function() {
                $("#centreAddressOverlay").modal("toggle");
            }
            //  $scope.AreaList = ["Pimpri", "Chinchwad", "Kothrud", "Aundh", "Pashan", "Baner", "Koregaon Park", "Shivaji Nagar", "Pune Railway", "Swargate", "Boat club", "Magarpatta", "Daund", "Chikhli", "Kalewadi", "Kasarwadi", "Phugewadi ", "Pimple Saudagar", "Narayan peth", "Talegaon", "Kasba peth", "Shirur", "Bhor", "Mulshi", "Wadgaon", "Welhe", "Ambegaon", "Junnar", "Rajgurunagar", "Baramati", "Indapur", "Purandhar", "Bhawani Peth", "Erandwana", "Ghorpuri Lines", "Kalyani Nagar", "Kondhwa", "Narayan Peth", "Hadapsar", "Akurdi"];
            $scope.addOrRemoveService = function (area) {
                $scope.selectedServices = $scope.selectedServices || [];
                if ($scope.selectedServices.indexOf(area) < 0)
                    $scope.selectedServices.push(area);
                else {
                    $scope.selectedServices.splice($scope.selectedServices.indexOf(area), 1);
                }
            }
            $scope.serviceList = [
                ["Denting & Painting", "Accidental Repair", "Interior Car Spa", "Regular Service", "Wheel Alignment & Balancing", "Pick & Drop", "Battery Services"], ["Exterior Car Spa", "Accidental Insurance", "A/c Repairing", "Spare Parts", "Complete Engine Scanning", "Cards Accepted", "Breakdown"]
            ];
            $scope.toggleNewCentreView = function() {
                $scope.newCentre = !$scope.newCentre;
                $scope.centreDetails.Id = "";
            }
            $scope.toggleServiceList = function () {
                $scope.hideServiceList = !$scope.hideServiceList;
                $scope.selectedServices = [];
            }
        }
    ]
);