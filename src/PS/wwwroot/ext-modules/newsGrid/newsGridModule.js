"use strict";

angular.module("newsGrid", []).factory("dataService",
    ["$timeout",
        function ($timeout) {

            var newsGrid = [
                {
                    id: 1000,
                    imageSrc: "assets/media/posts/370x250/1.jpg",
                    title: "sed rt enim ad minim veniam quis",
                    by: " ALEX LEEMAN",
                    commentCount: 15,
                    date: {
                        day: 1,
                        month: "oct"
                    },
                    content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
                },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/2.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 2,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/3.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 3,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/4.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 4,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/5.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 5,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/6.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 6,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/7.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 7,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/8.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 8,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              },
              {
                  id: 1000,
                  imageSrc: "assets/media/posts/370x250/9.jpg",
                  title: "sed rt enim ad minim veniam quis",
                  by: " ALEX LEEMAN",
                  commentCount: 15,
                  date: {
                      day: 9,
                      month: "oct"
                  },
                  content: "Wliquam sit amet urna sed vel nullam semper aib vestiblum fringilla orem ipsum dolor sit amet con tetur adipiscing elit sed eiusmod."
              }
            ];

            var _getNewsGrid = function () {
                return $timeout(function () {
                    return newsGrid;
                }, 0);
            };


            return {
                getNewsGrid: _getNewsGrid,
            };
        }
    ]);