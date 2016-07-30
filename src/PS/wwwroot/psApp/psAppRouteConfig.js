/// <reference path="admin/addcentredetails/addcentredetails.html" />
"use strict";

angular.module("psApp").config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.interceptors.push("LoadingInterceptor");
        $httpProvider.defaults.headers.get["X-XSRF-TOKEN"] = window.localStorage.token;
        $httpProvider.defaults.headers.post["X-XSRF-TOKEN"] = window.localStorage.token;
        $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
        $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
        $httpProvider.defaults.headers.get["If-Modified-Since"] = "0";
        $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

        //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        var routes = [
             {
                 state: "home",
                 config: {
                     url: "/",
                     controller: "indexController",
                     templateUrl: "/views/Home/home.html",
                 }
             },
               {
                   state: "Contact",
                   config: {
                       url: "/Contact",
                       templateUrl: "/views/ConnectWithUs/connectWithUs.html"
                   }
               },
                {
                    state: "About",
                    config: {
                        url: "/About",
                        templateUrl: "/views/WhyChooseUs/whyChooseUs.html"
                    }
                },
                {
                    state: "Pricing",
                    config: {
                        url: "/Pricing",
                        templateUrl: "/views/Pricing/pricing.html"
                    }
                },
               {
                   state: "service",
                   config: {
                       url: "/Service",
                       templateUrl: "/views/BookNow/bookNow.html"
                   }
               },
               {
                   state: "service.car",
                   config: {
                       url: "/",
                       template: "<select-car></select-car>"
                   }
               },
                 {
                     state: "service.centre",
                     config: {
                         url: "/",
                         requireLogin: true,
                         template: "<select-centre></select-centre>"
                     }
                 },
                 {
                     state: "service.appointment",
                     config: {
                         url: "/",
                         requireLogin: true,
                         template: "<book-appointment></book-appointment>"
                     }
                 },
               {
                   state: "service.address",
                   config: {
                       url: "/",
                       requireLogin: true,
                       template: "<select-address></select-address>"
                   }
               },
                {
                    state: "Dashboard",
                    config: {
                        url: "/Dashboard",
                        requireLogin: true,
                        template: "<ps-dashboard></ps-dashboard>"
                    }
                },
                {
                    state: "Terms",
                    config: {
                        url: "/Terms",
                        template: "<ps-terms></ps-terms>"
                    }
                },
                {
                    state: "PrivacyPolicy",
                    config: {
                        url: "/PrivacyPolicy",
                        template: "<ps-privacy-policy></ps-privacy-policy>"
                    }
                },
                {
                    state: "/OrderProcessingTerms",
                    config: {
                        url: "/OrderProcessingTerms",
                        template: "<ps-order-processing></ps-order-processing>"
                    }
                },
               {
                   state: "orderSuccess",
                   config: {
                       url: "/Success",
                       controller: "selectAddressController",
                       template: "<order-summary></order-summary>"
                   }
               },

               {
                   state: "socialCallback",
                   config: {
                       url: "/Auth/Success",
                       template: "<div id='page-preloader'><img class='spinner' src='../assets/img/cool-loading-animated.gif' alt='MileMates Loader'></div>",
                       controller: "loginDetailsController"
                   }
               },
                {
                    state: "admin",
                    config: {
                        url: "/Admin",
                        template: "<admin></admin>",
                        controller: "loginDetailsController"
                    }
                },
                {
                    state: "admin.addCentre",
                    config: {
                        url: "/",
                        templateUrl: "psapp/admin/addCentreDetails/addCentreDetails.html",
                        controller: "loginDetailsController"
                    }
                },
                {
                    state: "admin.centreDetails",
                    config: {
                        url: "/details",
                        templateUrl: "psapp/admin/CentreList/serviceCentreList.html",
                        controller: "serviceCentreListController"
                    }
                },
                {
                    state: "admin.editOrder",
                    config: {
                        url: "/details",
                        templateUrl: "psapp/admin/editOrder/editOrderDetails.html",
                        controller: "editOrderController"
                    }
                },
                 {
                     state: "admin.priceDetails",
                     config: {
                         url: "/pricelist",
                         templateUrl: "psapp/admin/PriceDetails/serviceCentrePriceDetails.html",
                         controller: "serviceCentrePriceDetailsController"
                     }
                 }
        ];

        routes.forEach(function (route) {
            $stateProvider.state(route.state, route.config);
        });


        $urlRouterProvider.otherwise("/");

        //TODO: don't forget to configure iis settings for html5 mode angular when deploying the code
        $locationProvider.html5Mode(true);

    }]).run(["$rootScope", "$state", "psLoginService", function ($rootScope, $state, psLoginService) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.requireLogin && !psLoginService.isAuthenticated()) {
                // User isn’t authenticated
                if (toState.name === "service.centre")
                    $("#loginModal").modal("toggle");
                else {
                    $state.go("home");
                }
                event.preventDefault();
            }
        });
        //$rootScope.$on("$viewContentLoaded", function() {
        //    $rootScope.isViewLoaded = true;
        //});
        //    $rootScope.$on('$viewContentLoading', function () {
        //        $rootScope.isViewLoaded = false;
        //    });
    }]);