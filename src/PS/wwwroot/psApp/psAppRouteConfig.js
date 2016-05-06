"use strict";

angular.module("psApp").config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $httpProvider.interceptors.push('LoadingInterceptor');

        var routes = [
             {
                 state: "home",
                 config: {
                     url: "/",
                     controller: "indexController",
                     template: "<ps-index></ps-index>"
                 }
             },
               {
                   state: "Contact",
                   config: {
                       url: "/Contact",
                       template: "<ps-contact-us></ps-contact-us>"
                   }
               },
                {
                    state: "About",
                    config: {
                        url: "/About",
                        template: "<ps-about-us></ps-about-us>"
                    }
                },
                {
                    state: "Pricing",
                    config: {
                        url: "/Pricing",
                        template: "<ps-pricing></ps-pricing>"
                    }
                },
                {
                    state: "Dashboard",
                    config: {
                        url: "/Dashboard",
                        requireLogin:true,
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
                   state: "service",
                   config: {
                       url: "/Service",
                       template: "<car-service></car-service>"
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
                         requireLogin:true,
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
                       template: "<div id='page-preloader'><img class='spinner' src='../assets/img/cool-loading-animated.gif' alt='MileMates'></div>",
                       controller: "loginDetailsController"
                   }
               }
        ];

        routes.forEach(function (route) {
            $stateProvider.state(route.state, route.config);
        });


        $urlRouterProvider.otherwise('/');

        //TODO: don't forget to configure iis settings for html5 mode angular when deploying the code
        $locationProvider.html5Mode(true);
        
    }]).run(["$rootScope", "$state", "psLoginService", function ($rootScope, $state, psLoginService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.requireLogin && !psLoginService.isAuthenticated()) {
            // User isn’t authenticated
            if (toState.name === "service.centre")
                $("#loginModal").modal('toggle');
            else {
                $state.go("home");
            }
            event.preventDefault();
        }
    });
}]);