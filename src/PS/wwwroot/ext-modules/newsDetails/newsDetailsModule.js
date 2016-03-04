"use strict";

angular.module("newsDetails", []).factory("newsDetailsService", ["$timeout", function ($timeout) {
        var newsDetails = 
            {
                id: 100,
                imgSrc: "assets/media/posts/770x430/1.jpg",
                By: "Alex Leeman",
                Comments: "15",
                date: {
                    day: "23",
                    month: "Sep"
                },

                entryContentData : {
                    entryTitleContent: "SED RT ENIM AD MINIM VENIAM QUIS NOSTRUD EXERCITATION",
                    entryContentP1 : "Wliquam sit amet urna sed vel nullam semper aiber vestiblum fringilla orem ipsum dolor sit amet consectetur adipisc ing elit sed don eiusmod tempor incididunt ut labore et dolore magna aliquaa enimd ads minim veniam quis nostrud Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet consec tetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    entryContentP2 : "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                    entryInnerTitle: "Lorem ipsum dolor sit amet consectetur",
                    decor1Content: "Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
                    blockQuote : "Lorem ipsum dolor sit amet consectetur adipisicing elit sedo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.",
                    entryContentP3: "Aiber vestiblum fringilla orem ipsum dolor sit amet consectetur adipisc ing elit sed don eiusmod tempor incididunt ut labore et dolore magna aliquaa enimd ads minim veniam quis nostrud Lorem ipsum dolor sit amet consectetur adipis cing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet consectetur adipisicing.",
                    entryContentP4: "Elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostru dare exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
                },

                aboutAuthor : {
                    aboutAuthorName: "william henry",
                    aboutAuthorCategory: "author",
                    aboutAuthorDescription: "Integer tor bibendum estnu faucibus gravida aliquam nu lectus lacina lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod.",
                },

                postNav : {
                    postNavData1: {
                        postNavTitle: "Tempor incididunt labore dolore magna aliqua",
                        postImgSrc: "assets/media/75x75/1.jpg",
                        prevPostTag: "previous POST"
                    },
                    postNavData2: {
                        postNavTitle: "Dolor sit media ei nullam sed ipsum dui",
                        postImgSrc: "assets/media/75x75/2.jpg",
                        nextPostTag: "NEXT POST"
                    }
                },

                
                commentsData: {
                    uiTitleInnerComment: "comments :: 2",   
                    commentsAuthor1 : {
                        commentAuthorName: "ANDREW",
                        commentAuthorImgSrc : "assets/media/avatar_comments/1.jpg",
                        commentDateTime: "23 SEP 2015 :: 6:10 PM",
                        commentBody: "Wliquam sit amet urna sed vel nullam semper aiber vestiblum fringilla orem ipsum dolor sit amet consectetur adipisc ing elit sed don eiusmod.",
                    },

                    commentsAuthor2 : {
                        commentAuthorName: "MARK",
                        commentAuthorImgSrc : "assets/media/avatar_comments/2.jpg",
                        commentDateTime: "13 SEP 2015 :: 6:10 PM",
                        commentBody: "Wliquam sit amet urna sed vel nullam semper aiber vestiblum fringilla orem ipsum doloa.",
                    }
                },



                categories: {
                    categoryAll: "All",
                    categoryLatestVehicles: "Latest Vehicles",
                    categoryOffers: "Offers $ Discounts",
                    categorySportsCar: "Sports Car",
                    categoryVehiclesGuide: "Vehicles Buying Guide",
                    categoryCarsBrands: "Cars Brands"
                },

                latestPost: {
                    post1: {
                        imgSrc : "assets/media/widget-post/3.jpg",
                        content: "Lorem ipsum dolor sit amet adipisicing sed ipsum",
                        comments: 15
                    },
                    post2: {
                        imgSrc: "assets/media/widget-post/1.jpg",
                        content: "Tempor incididunt ut labore et dolore magna aliqua",
                        comments: 15
                    },
                    post3: {
                        imgSrc: "assets/media/widget-post/2.jpg",
                        content: "Enim ad minim veniam quis nostrud exercitation",
                        comments: 15
                    },
                },


                recentVideos: {
                    video1 : {                         
                        videoUrl : "https://www.youtube.com/watch?v=DIGfO2Dgc9Y",
                        videoImgSrc : "assets/media/banners/1.jpg",                        
                    },
                    video2 : {                         
                        videoUrl : "https://www.youtube.com/watch?v=DIGfO2Dgc9Y",
                        videoImgSrc : "assets/media/banners/1.jpg",                        
                    },
                    video3: {
                        videoUrl: "https://www.youtube.com/watch?v=DIGfO2Dgc9Y",
                        videoImgSrc: "assets/media/banners/1.jpg",
                    },
                    video4: {
                        videoUrl: "https://www.youtube.com/watch?v=DIGfO2Dgc9Y",
                        videoImgSrc: "assets/media/banners/1.jpg",
                    }
                },

                twitterPosts : {
                    tweet1 :{
                        tweetText: "AutoZen</a> Lorem ipsum dolor sit amet consec tetur adipisicing elit sed",
                        tweetUrl: "http://t.co/JHAhas"
                    },
                    tweet2 : {
                        tweetText: "AutoZen</a> Lorem ipsum dolor sit amet consec tetur adipisicing elit sed",
                        tweetUrl: "http://t.co/JHAhas"
                    }
                },

                tagsCloud :{
                    tagBMW: "BMW",
                    tagSportsCar: "Sports Car",
                    tagSpeed: "speed",
                    tagBuyCars: "buy cars",
                    tagSellingGuide: "selling guide",
                    tagOffers: "offers",
                    tagSellCars: "Sell cars",
                    tagLatestModel : "latest models"
                },

            }
        

        var _getNewsDetails = function () {
            return $timeout(function () {
                return newsDetails;
            }, 0);
        };


        return {
            getNewsDetails: _getNewsDetails,
        };

    }
    
    ]);