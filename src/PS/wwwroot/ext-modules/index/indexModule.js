"use strict";

angular.module("index", ["ngStorage"]).factory("indexDataService",
    ["$timeout",
        function ($timeout) {

            var highlights = [
                {
                    id: 1000,
                    imageSrc: "assets/media/posts/370x250/1.jpg",
                    title: "Time is Money!!",
                    date: {
                        day: 1,
                        month: "oct"
                    },
                    content: "Book our services, keep an eye on the clock and we are there on time as we promised."
                },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/2.jpg",
                  title: "Cash-less : the way to go",
                  date: {
                      day: 2,
                      month: "oct"
                  },
                  content: "Get over the problem of stacking out the exact change, use our secure online payment option...and it's done!!!!"
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/3.jpg",
                  title: "Pick Up and Dropoff Guys!!",
                  date: {
                      day: 3,
                      month: "oct"
                  },
                  content: "Car needs servicing but have other plans??.. Go for it !! We will pick up your car, GROOM it up and drop it back as if it never went!!!! "
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/4.jpg",
                  title: "Track it up!!",
                  date: {
                      day: 4,
                      month: "oct"
                  },
                  content: "Concerned about where your vehicle is at present? TRACK IT UP through our real time tracking system, lay back and enjoy your time."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/5.jpg",
                  title: "As you say....SIR/MA'AM!!!",
                  date: {
                      day: 5,
                      month: "oct"
                  },
                  content: "You select all you need, we do all it takes to CHECK all the BOXES in your requirement."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/6.jpg",
                  title: "Breakdown PANGA !!",
                  date: {
                      day: 6,
                      month: "oct"
                  },
                  content: "BEMUSED!! why your vehicle brokedown ? Need help at your place of convenience ? We are just a few clicks away. At your doorsteps (24*7) as and when u need !!!!"
              }
            ];

            var terms = "Dummy Text";

            var privacyPolicy = "Dummy Privacy Text";

            var _getHighlights = function () {
                return $timeout(function () {
                    return highlights;
                }, 0);
            };

            var _getPrivacyPolicy = function () {
                return $timeout(function () {
                    return privacyPolicy;
                }, 0);
            };

            var _getTerms = function () {
                return $timeout(function () {
                    return terms;
                }, 0);
            };


            return {
                getHighlights: _getHighlights,
                getPrivacyPolicy: _getPrivacyPolicy,
                getTerms: _getTerms,
            };
        }
    ]);