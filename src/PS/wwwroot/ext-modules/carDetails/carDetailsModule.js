"use strict";

angular.module("carDetails", []).factory("carDetailsService", ["$timeout", function ($timeout) {
            var carDetails = {
                carName: 'Chevrolet Impala',
                carImages: {
                    largeImages: [{ url: 'assets/media/slider_product/large/1.jpg' },
                    { url: 'assets/media/slider_product/large/1.jpg' },
                    { url: 'assets/media/slider_product/large/1.jpg' },
                    { url: 'assets/media/slider_product/large/1.jpg' },
                    { url: 'assets/media/slider_product/large/1.jpg' },
                    { url: 'assets/media/slider_product/large/1.jpg' },
                    ],
                    smallImages: [{ url: 'assets/media/slider_product/small/1.jpg' },
                    { url: 'assets/media/slider_product/small/2.jpg' },
                    { url: 'assets/media/slider_product/small/3.jpg' },
                    { url: 'assets/media/slider_product/small/4.jpg' },
                    { url: 'assets/media/slider_product/small/5.jpg' },
                    { url: 'assets/media/slider_product/small/6.jpg' }
                    ],


                },
                navPanel: [{
                    title: "Lorem ipsum dolor sit amet consectetur",
                    details: " <p>Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>" +
                              "<p>Wliquam sit amet urna sed vel nullam semper aiber vestiblum fringilla orem ipsum dolor sit amet consectetur adipisc ing elit sed don eiusmod tempor incididunt ut labore et dolore magna aliquaa enimd ads minim veniam quis nostrud Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet consec tetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>" +
                                                "<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>" +
                                                "<p>Aiber vestiblum fringilla orem ipsum dolor sit amet consectetur adipisc ing elit sed don eiusmod tempor incididunt ut labore et dolore magna aliquaa enimd ads minim veniam quis nostrud Lorem ipsum dolor sit amet consectetur adipis cing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet consectetur adipisicing.</p>" +
                                                "<p>Elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostru dare exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irue dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>"
                },
            {
                title: "Lorem ipsum dolor sit amet consectetur",
                details: " <p>Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>"
            },

            {
                title: "sit amet consectetur",
                details: "<p>Aiber vestiblum fringilla orem ipsum dolor sit amet consectetur adipisc ing elit sed don eiusmod tempor incididunt ut labore et dolore magna aliquaa enimd ads minim veniam quis nostrud Lorem ipsum dolor sit amet consectetur adipis cing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet consectetur adipisicing.</p>" +
                                                    "<p>Elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostru dare exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irue dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>"
            }],
                specifications: [{ heading: '>MAke / model', value: 'Chevrolet Impala' },
                    { heading: 'MAke year', value: 'January 2016' },
                    { heading: 'vehicle type', value: 'Front-engine, front-wheel-drive, 5-passenger, 4-door sedan' },
                    { heading: 'ENGINE TYPE', value: 'DOHC 16-valve inline-4, aluminum block and head, direct fuel injection' },
                    { heading: 'DIMENSIONS', value: ' Wheelbase: 111.7 in<br>Length: 201.3 in<br> Width: 73.0 in Height: 58.9 in<br>Curb weight: 3700 lb' },
                    { heading: 'TRANSMISSION', value: '6-speed automatic with manual shifting mode' },
                    { heading: 'fuel economy', value: 'EPA city/highway: 21/31 mpg' },
                    { heading: 'Passenger Capacity', value: '5 Seats' }
                ],
                vedios: [{ link: 'http://www.youtube.com/watch?v=neS5h_VSvb8', imageUrl: 'assets/media/banners/1.jpg' },
                    { link: 'http://www.youtube.com/watch?v=neS5h_VSvb8', imageUrl: 'assets/media/banners/1.jpg' },
                    { link: 'http://www.youtube.com/watch?v=neS5h_VSvb8', imageUrl: 'assets/media/banners/1.jpg' },
                    { link: 'http://www.youtube.com/watch?v=neS5h_VSvb8', imageUrl: 'assets/media/banners/1.jpg' }
                ],
                relatedCars: [{ Name: 'Toyota Avalon', Price: '40,685', Desc: 'Cullam semper aibe vestibulum', imgUrl: 'assets/media/widget-post/2.jpg' }, { Name: 'Toyota Avalon', Price: '33,120', Desc: 'Cullam semper aibe vestibulum', imgUrl: 'assets/media/widget-post/1.jpg' }]

            }


            var _getCarDetails = function () {
                return $timeout(function () {
                    return carDetails;
                }, 0);
            };


            return {
                getCarDetails: _getCarDetails,
            };
       }
    ]);
		




    