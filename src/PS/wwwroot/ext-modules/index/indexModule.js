"use strict";

angular.module("index", ["ngStorage"]).factory("indexDataService",
    ["$timeout",
        function ($timeout) {

            var highlights = [
                {
                    id: 1000,
                    imageSrc: "assets/media/posts/370x250/1.jpg",
                    title: "MM hassle-free",
                    date: {
                        day: 1,
                        month: "oct"
                    },
                    content: "Book our services from your home/office/place of convenience and leave the rest to us. Your car our responsibility."
                },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/2.jpg",
                  title: "MM 24*7 on-road assistance",
                  date: {
                      day: 2,
                      month: "oct"
                  },
                  content: "MM provides road side assistance anytime, anywhere in areas under our reach."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/3.jpg",
                  title: "Estimation of the services availed",
                  date: {
                      day: 3,
                      month: "oct"
                  },
                  content: "We will provide you an estimate of how much you will be charged for the services that you avail, so that you can decide which ones to avail based on your budget."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/4.jpg",
                  title: "Customer Satisfaction",
                  date: {
                      day: 4,
                      month: "oct"
                  },
                  content: "We rate our work as good only when our customer’s are satisfied with their car servicing. Based on customer ratings only we list our service providers."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/5.jpg",
                  title: "Serving you based on your priorities",
                  date: {
                      day: 5,
                      month: "oct"
                  },
                  content: "We provide you options to sort the listed service centres based on your priorities (Cost, Ratings, Near By and Popularity)."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/6.jpg",
                  title: "MM Warranty",
                  date: {
                      day: 6,
                      month: "oct"
                  },
                  content: "We provide a warranty of 15 days or 300 KM on all repair services availed by you."
              }
            ];

            var _getHighlights = function () {
                return $timeout(function () {
                    return highlights;
                }, 0);
            };


            return {
                getHighlights: _getHighlights,
            };
        }
    ]);