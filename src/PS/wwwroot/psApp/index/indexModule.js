"use strict";

var indexApp = angular.module("index");

indexApp.factory("indexDataService",
    ["$timeout", "$http", "$q",
        function ($timeout, $http, $q) {

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

            var terms = [
                {
                    "heading": "License for Personal Use",
                    "desc": [
                        {
                            "text": "By using this Website, whether as a “Visitor” (meaning you simply browse the Website) or as a “User” (meaning you have registered with and/or submitted content to the Website either as an individual or as a company), implies that you agree to be bound by this Agreement and the Privacy Policy located at https://www.milemates.com/PrivacyPolicy. The terms “You”, “Your” or “User” shall mean any natural or legal person who has agreed to become a User on the Website by providing registration data while registering on the Website as a User using the computer systems and the terms  “We”, “ours will refer to milemates.com."
                        },
                        {
                            "text": "The Terms of use mentioned, include your rights, obligations and restrictions regarding the use of the Website by you, please read it carefully. If you do not agree to the Terms, you should leave the Website and discontinue use of the Services immediately. If you wish to become a User, and generally avail our Services, you must read these Terms of Use and indicate your acceptance during the content submission process."
                        },
                        {
                            "text": "We urge you to read the terms of use before using or registering on our website."
                        },
                        {
                            "text": "We may modify these Terms from time to time and each modification will be effective when it is posted on the Website without any prior notice. You agree to be bound to all of the terms and we urge you to please visit our terms page for any updates related to the terms as you won’t be notified of any modifications."
                        }
                    ]
                },
                {
                    "heading": "SERVICES",
                    "desc": [
                        {
                            "text": "All services  provided by the Service Provider, through Software, to the Customer by means of the Customer’s use of the booking channel (Website/Application/call center etc.), for booking purposes, are hereinafter referred to as the “Service”. Furthermore, the term Services shall include any service for which any consideration is paid /not paid to the Service Provider by the Customer and will be covered by these Terms and Conditions."
                        },
                        {
                            "text": "This Website is a platform which facilitates the online transaction of products and services offered by MILEMATES various affiliates/ registered merchants/ service providers/ service providers. The Services are offered to the Users through various modes which shall include but not be limited to, the sale of Vouchers that can be redeemed for various products and services, the sale of products etc. The Service Providers are the sellers of products and services on the Website and will be solely responsible to you for the products sold or services availed and purchased by you through the Website."
                        },
                        {
                            "text": "The Services may be requested through phone via Website, calling on the number provided on the website, an application supplied by the Service Provider and downloaded and installed by You on an internet-enabled mobile device (the “Application”) or through any other channel made available by the Service Provider for booking purpose."
                        },
                        {
                            "text": "Some of the Services offered by the Service Provider are sourced from third parties who have a contractual relationship with the Service Provider. MILEMATES is only responsible for the services which are directly provided by us. The Service Provider offers information and a method to obtain such third party services from third party service providers, but does not, and does not intend to, provide third party services or act in any way as a third party service provider, and has no responsibility or liability for any third party services provided to (or failed to be provided) nor for the actions or inactions of any third party service providers."
                        },
                         {
                             "text": "The services provided by third party service providers is termed as “TP Services or External Services” and include servicing of Customer’s vehicle for scheduled/unscheduled, maintenance/accidental or for any other kind of repair and maintenance work of vehicle (“Customer Vehicle ”)."
                         },
                          {
                              "text": "The Website/Application also provides Customer with the option of hiring of Ambassadors with facility to track Vehicle movement, that tracks the Customer Vehicle from Customer’s residence/office or any other location as specified by the Customer to the registered Service Network Partner of the third party service provider and from the registered Service Network Partner to a location as specified by Customer. Movement of vehicle facility provides Customer the ability to track the movement of Customer Vehicle during pickup and delivery service."
                          },
                           {
                               "text": "We(“MILEMATES”) do not guarantee or warranty and make no representations regarding, the reliability, quality or suitability of such third party service providers. The Service Provider shall reasonably provide sufficient training, quality control procedures and processes to ensure commercially reasonable services by third party service providers. However, under no circumstance does the Service Provider accept liability in connection with and/or arising from the services or any acts, action, behavior, conduct, and/or negligence on the part of the third-party service provider whether online or offline. Any complaints about the services provided by the third party service provider should be directly submitted to the concerned third party service provider. By using the Services, You agree to hold the Company free from any responsibility, liability or damages that may arise out of or in relation to booking Service through the call center, Website, Application or the Services. The Company and its affiliates and licensors shall not be liable for any claim, injury or damages arising out of or in connection with your use of the Service or the TP Services."
                           },
                            {
                                "text": "You may only access the Service using authorized means. It is Your responsibility to check and ensure You have accessed or downloaded the correct Website/Application for Your device. The Company is not liable if You do not have a compatible handset."
                            },
                    ]
                },
                 {
                     "heading": "Liability and Warranty Disclaimers",
                     "desc": [
                         {
                             "text": "ALL MATERIALS, INFORMATION, SOFTWARE, PRODUCTS AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE MILEMATES AUTOMOTIVE NETWORK ARE PROVIDED 'AS AVAILABLE' AND 'AS IS' FOR YOUR USE. THE MILEMATES AUTOMOTIVE NETWORK AND ALL MATERIALS, INFORMATION, SOFTWARE, PRODUCTS AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE MILEMATES AUTOMOTIVE NETWORK ARE PROVIDED WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NONINFRINGEMENT. WE AND THE OTHER ENTITIES FROM WHOM WE OBTAIN CONTENT DO NOT WARRANT THAT THE MATERIALS, INFORMATION (INCLUDING PRICES), SOFTWARE, PRODUCTS OR SERVICES INCLUDED IN OR AVAILABLE THROUGH THE MILEMATES AUTOMOTIVE NETWORK ARE ACCURATE, RELIABLE OR CORRECT; THAT THE MILEMATES AUTOMOTIVE NETWORK WILL BE AVAILABLE AT ANY PARTICULAR TIME OR LOCATION; THAT ANY DEFECTS OR ERRORS WILL BE CORRECTED; OR THAT THE MILEMATES AUTOMOTIVE NETWORK IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. YOUR USE OF THE MILEMATES  AUTOMOTIVE NETWORK IS SOLELY AT YOUR RISK. BECAUSE SOME JURISDICTIONS DO NOT PERMIT THE EXCLUSION OF CERTAIN WARRANTIES, THESE EXCLUSIONS MAY NOT APPLY TO YOU."
                         },
                         {
                             "text": "All prices, incentives (like offers) and rebate information, and other information displayed on the MILEMATES Automotive Network are gathered from sources and based on algorithms that are believed by us to be reliable (other than Visitor-Submitted Content, as to which we make no such representation), but we do not verify this information and no assurance can be given that this information is accurate, complete or current. Furthermore, the  prices displayed on the MileMates Automotive Network for vehicles advertised by dealers are sometimes calculated by us based on data MILEMATES rules supplied to us by the dealers or by intermediaries who transmit data from the dealers to us; neither we nor the dealers are responsible for any errors in such data or rules, or for any errors that may occur in the manner in which we apply such data and rules to determine the vehicle prices displayed. Before purchasing any vehicle or other goods or services you read about on the MILEMATES Automotive Network, you should confirm with the dealer or vendor any information (including the price and available incentives or rebates) that is important to your decision."
                         },
                         {
                             "text": "In addition, we can give no assurance that any advice, recommendation or guidance that we provide on the MILEMATES website , in press releases, in communications between our staff and third parties, or in any other medium, or that are provided by our visitors through the MILEMATES website, is accurate, complete or current. We do not warrant the accuracy of or assume (and you agree that MileMates does not bear any) responsibility for any errors or omissions in the information, advice, recommendations or guidance provided by either our staff or our visitors."
                         },
                         {
                             "text": "The MILEMATES website displays both third-party advertising and links to many other Web sites not operated by us, including sites where you can obtain products and services such as new and used vehicles and vehicle financing and insurance. While we encourage you to consult such sites, MILEMATES does not control, endorse or guarantee any of the content found on such sites, or the content of any advertising we display; we are not responsible for the claims made by third parties or for the products or services those third parties provide; and we do not guarantee or warrant the prices, terms, quality, reliability or performance of the products or services provided by those third parties. You agree that MILEMATES is not responsible for any advertising that we display on our website, or for any content, associated links, resources or services on or provided through sites not operated by us, and that MILEMATES shall not be liable for any loss or damage of any kind arising from or incurred in connection with your use of third-party content, services or products. We do not co-sponsor, operate, endorse or guarantee any sweepstakes or contest offer that may be promoted from time to time by third parties or that may be accessible through links from the MILEMATES."
                         },
                          {
                              "text": "On the website we collect personally identifiable information from individuals who authorize us to submit such information to one or more automobile dealers. As provided in our Privacy Statement, in some instances such information is also provided to other third parties. Those dealers and other third parties are not affiliated with MILEMATES Private Limited. These services are provided on an 'as is' basis; neither we nor such third parties make any representation or warranty concerning, or are responsible for, any of the products or services those dealers provide, the manner in which those products or services are provided, or for any use made by those dealers of your personally identifiable information."
                          }
                     ]
                 },
                 {
                     "heading": "Electronic Communications",
                     "desc": [
                         {
                             "text": "When you visit the MILEMATES website or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically via emails and more. We may communicate with you by e-mail or by posting notices on the MILEMATES website. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically or that you provide to us electronically satisfy any legal requirement that such communications be in writing."
                         }
                     ]
                 },
                  {
                      "heading": "ELIGIBILITY",
                      "desc": [
                          {
                              "text": "We provide access to our services to only those individuals or companies who can form legally binding contracts under Indian law. Therefore, Customer(s) must be at least eighteen (18) years of age to be eligible to use Our Services."
                          },
                          {
                              "text": "We (“MILEMATES”) advises our Customers that while using the Website/Application, You must follow/abide by all applicable laws. We are not responsible for any possible consequences caused by your behaviour during use of the Website."
                          }
                      ]
                  },
                  {
                      "heading": "APPLICABILITY",
                      "desc": [
                          {
                              "text": "These Terms and Conditions apply to Customers who access the Website/Application for any purpose. It also applies to any legal entity which may be represented by the Customer under actual or apparent authority. These Terms and Conditions apply to all Services offered on the Website/Application, collectively with any additional terms and condition that may be applicable to the specific Service used/accessed by the Customer."
                          },
                          {
                              "text": "In the event of a conflict or inconsistency between any provision of the terms and conditions mentioned herein with those of the particular service, the provisions of the terms and conditions applicable to such specific Services shall prevail."
                          }
                      ]
                  },
                  {
                      "heading": "SUBSEQUENT AMENDMENTS, MODIFICATIONS AND RESTATEMENTS",
                      "desc": [
                          {
                              "text": "The Service Provider may change, modify, amend, or update these Terms of use and Conditions from time to time without any prior notification to the Customer and the amended terms and conditions of use shall be effective immediately as soon as posted on the Website/Application. If the Customer does not adhere to the changes in any of these terms and conditions, the Service Provider shall terminate these Terms and Conditions with respect to such Customer and deny access to Services in Service Provider’s sole discretion. The continued use of the Services by the Customer will signify the unambiguous acceptance of the changed terms."
                          }
                      ]
                  },
                  {
                      "heading": "COMMUNICATION",
                      "desc": [
                          {
                              "text": "In order to  improve the Service that we provide to you, You may need to communicate with Us through emails or any other mode of communication. When You use the Website/Application or send emails or other data and information, you agree and understand that You are communicating with Us through electronic records and You hereby provide Your express consent to receive communications via electronic records from Us periodically and as and when required. We may communicate with you by email, SMS or such other mode of communication, electronic or otherwise. It is important you understand that any such mode of communication, inter alia, helps us provide you with information that we think you require from time to time such as confirmation of a Service booked on the Website/Application or knowing the status of delivery of your vehicle."
                          }
                      ]
                  },
                  {
                      "heading": "Termination of Services",
                      "desc": [
                          {
                              "text": "We may suspend or cancel your registration and/ or terminate your access to MILEMATES if you breach any of these  Terms of Use or have made improper use of The Services. You may cancel your registration at any time by informing us in writing. If you do so you must stop using The Services."
                          },
                          {
                              "text": "The suspension, cancellation or termination of your registration and your right to use The Services shall not affect either party’s statutory right or liabilities."
                          }
                      ]
                  },
                  {
                      "heading": "Compliance with Laws",
                      "desc": [
                          {
                              "text": "All dealing entities on MILEMATES website are informed to comply with the applicable laws including Foreign Exchange Management Act, 1999 but not limited to the rules made and notifications issued under and the Exchange Control Manual as may be issued by Reserve Bank of India from time to time, Customs Act, Information and Technology Act, 2000 as amended by the Information Technology (Amendment) Act 2008, Prevention of Money Laundering Act, 2002 and the rules made under, Foreign Contribution Regulation Act, 1976 and the rules made under, Income Tax Act, 1961 and the rules made under, Export Import Policy of government of India) applicable to them respectively and relevant amendment from time to time."
                          }
                      ]
                  },
                  {
                      "heading": "Applicable Law",
                      "desc": [
                          {
                              "text": "These Terms and Conditions will be subject to the laws of New Delhi, India and the courts shall have jurisdiction to resolve any disputes between us."
                          }
                      ]
                  },
                   {
                       "heading": "Cancellation of requested services",
                       "desc": [
                           {
                               "list": [
                                   {
                                       "text": "How? : Customer can initiate a cancellation by either writing to care@milemates.com, or by calling +91-8380911266."
                                   },
                                    {
                                        "text": "Free cancellation (When?): If the cancellation is initiated before the car has been picked up, the customer will not have to pay any ‘cancellation charges’."
                                    },
                                    {
                                        "text": "Additional Charges (When?)Once the vehicle has been picked up, customer can’t avail of free cancellation. In case the customer initiates a cancellation after the car has been picked up, customer will have to pay a ‘cancellation charge’ of Rs.200."
                                    },
                                    {
                                        "text": "Customer will have to pay a cancellation charge of Rs. 500 or 10% of the total estimated labour charges whichever is high if the job is not entrusted to “MILEMATES and its affiliates” after obtaining the estimates."
                                    },
                                    {
                                        "text": "In case the customer initiates a cancellation after work has commenced on the car, the customer shall be liable to pay charges for spares and labour already used on the car."
                                    }
                               ]
                           }
                       ]
                   },
                   {
                       "heading": "REFUND related to service availed on our website",
                       "desc": [
                           {
                               "list": [
                                   {
                                       "text": "In the case of cancellation of service by the customer, the customer will be refunded the amount paid by the customer after deducting the necessary cancellation charges."
                                   },
                                    {
                                        "text": "All refunds shall be made through NEFT / RTGS within a period of 7 days."
                                    }
                               ]
                           },
                           {
                               "text": "These Terms of Use were last updated on 25th May 2016."
                           }
                       ]
                   },
            ];

            var orderProcessingTC = [
                {
                    "heading": "Order Processing Terms & Conditions",
                    "desc": [
                        {
                            "list": [
                                {
                                    "text": "It is mandatory to cross check the order Id and other details related to appointment filled by service provider on the job card with the message received from MileMates containing the apponitment details to avail the MileMates services. If job card contains invalid order Id then user should not hand over his/her vehicle to MileMates service advisor and contact MileMates customer care helpline as soon as possible which in turn, help MileMates to detect fraud activities."
                                },
                                 {
                                     "text": "It is mandatory to sign the job card provided by MileMates pick-up service advisor before handing over your vehicle to MileMates. If job card is not signed by customer then MileMates, under any circumstances will not have any responsibility or liability to user."
                                 },
                                 {
                                     "text": "Please ensure the vehicle reaches the service provider at the selected time slot to avoid inconvenience or cancellations if user choose to drop-off his/her vehicle by its own."
                                 },
                                 {
                                     "text": "Payment for the service availed to be paid directly to the service provider in cash in case of Cash on Delivery."
                                 },
                                 {
                                     "text": "Service price is inclusive of all applicable taxes. Charges may vary in case of quotation for any part replacement if applicable."
                                 },
                                 {
                                     "text": "Additional services availed (if any) or parts used other than those included in the offer will be charged as per the service provider's rate card. Applicable taxes will be applied in this case."
                                 },
                                  {
                                      "text": "Cancellations will be considered only if the request is made at least 2 hours before the scheduled time of service or pick-up."
                                  },
                                   {
                                       "text": "A cancellation is to be deemed accepted by MileMates only if the user receives a confirmation e-mail/sms on the contact details provided at the time of booking by the user."
                                   },
                                    {
                                        "text": "Refund will be processed automatically on acceptance of the service order cancellation."
                                    },
                                     {
                                         "text": "If cancellation is done with a notice of minimum 24 hours prior to the scheduled time of appointment, money will be refunded post deduction of 5% of the service fees."
                                     },
                                      {
                                          "text": "Disputes if any shall be resolved between user and Service Provider. MileMates, under any circumstances will not have any responsibility or liability to user."
                                      },
                                      {
                                          "text": "Customer will be penalized INR 300 if service booked by the customer is cancelled after the service station provides the quotation on necessary changes."
                                      },
                                 {
                                     "text": "All other terms of use and privacy policy of milemates.com are also applicable in case of Order processing and Cancellation / Refund."
                                 },
                            ]
                        },
                        {
                            "text": "These Terms of Use were last updated on 25th May 2016."
                        }
                    ]
                }
            ];

            var privacyPolicy = [
                {
                    "heading": "PRIVACY & SAFEGUARD NOTICE",
                    "desc": [
                        {
                            "text": "This privacy policy has been collated to signify the use and protection of customer information, which you have disclosed (for various services availed on our site) during the use of our site."
                        },
                        {
                            "text": "We, at the “MILEMATES” are committed to ensuring that customer’s privacy is maintained and protected."
                        },
                        {
                            "text": "While availing facilities on MILEMATES, you will be required to provide some personal data by which you can be identified, be rest assured that your data will only be used based on this privacy policy."
                        },
                        {
                            "text": "This policy might be updated anytime in future without any prior notice, so please keep yourself updated about MILEMATES privacy policy by visiting this privacy policy page."
                        },
                        {
                            "text": "This Privacy Policy was last updated on 1st April 2016."
                        }
                    ]
                },
                 {
                     "heading": "WHAT WE COMPLY/OBEY TO",
                     "desc": [
                         {
                             "text": "At MILEMATES, we will not expose (sell, share or rent) your personal information to any third party. Also, your email address/mobile number will not be used for any unsolicited emails and/or SMS. Any emails and/or SMS received from MILEMATES will only be accordance with the provision of agreed services, products and will obey this Policy."
                         },
                         {
                             "text": "Some periodic statistics may be disclosed from our end related to number of visitors, a number of services availed and track of goods purchased etc."
                         },
                         {
                             "text": "We are in our rights to communicate your personal information to any third party under one or more of the following circumstances-",
                             "list": [
                                 {
                                     "text": "Only when you have agreed and provide your consent to do so;"
                                 },
                                  {
                                      "text": "Only when we are compelled by law (including court orders) to do so."
                                  }
                             ]
                         }
                     ]
                 },
                 {
                     "heading": "DATA Collection : WHAT?",
                     "desc": [
                         {
                             "text": "No personal identification information is required to visit this site. MILEMATES automatically collects data (your preferences on our site)based on your selection and service availed by you from our site. Your personal details will be fetched only when you share it while availing our services which require you to provide personal data."
                         },
                         {
                             "text": "The Information we collect based on your submission may include the following:",
                             "list": [
                                 {
                                     "text": "Your Name."
                                 },
                                  {
                                      "text": "Your contact details like mobile no. , email ID, an address where you stay."
                                  },
                                  {
                                      "text": "Vehicle Details like Vehicle Make and Model, Issue reported by you related to the vehicle."
                                  },
                                  {
                                      "text": "Your preferences (track of past usage)on our sites for better User Experience and fast processing."
                                  },
                                  {
                                      "text": "Customer Survey Information."
                                  }
                             ]
                         }
                     ]
                 },
                 {
                     "heading": "Information Gathering : Why?",
                     "desc": [
                         {
                             "text": "We need to gather this information to understand your needs and to serve you with better service, and in particular for the following reasons:",
                             "list": [
                                 {
                                     "text": "For Internal record maintenance."
                                 },
                                  {
                                      "text": "Inform you about offers, products, services, updates, customise your experience, detect & protect us against error, fraud and other criminal activity, enforce our terms and conditions, and as otherwise described to you at the time of collection etc."
                                  },
                                  {
                                      "text": "We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests."
                                  }
                             ]
                         }
                     ]
                 },
                 {
                     "heading": "Opting out of Mailing List:",
                     "desc": [
                         {
                             "list": [
                                 {
                                     "text": "By providing your email address to MILEMATES, either during a transaction or any other relevant form, you agree to be included in our mailing list. You can unsubscribe by using the relevant link in the email. Your e-mail address will not be provided to any third party."
                                 }
                             ]
                         }
                     ]
                 },
                 {
                     "heading": "INFORMATION SECURITY",
                     "desc": [
                         {
                             "text": "Information security is the most important part of any website management. We have taken several measures at MILEMATES to provide apt security to customer personal  information."
                         }
                     ]
                 },
                 {
                     "heading": "Use of Cookies:",
                     "desc": [
                         {
                             "text": "A 'cookie' is a small piece of information stored by a web server on a web browser so it can be later read back from that browser. We use cookies and tracking technology depending on the features offered. No personal information will be collected via cookies and other tracking technology; however, if you previously provided personally identifiable information, cookies may be tied to such information."
                         }
                     ]
                 },
                 {
                     "heading": "LINKS TO OTHER WEBSITES",
                     "desc": [
                         {
                             "text": "Our website may contain links to another website, once navigated to any other site, we are not responsible for the privacy policy and the content available on that site."
                         }
                     ]
                 },
                 {
                     "heading": "CONTROLLING YOUR PERSONAL INFORMATION: ",
                     "desc": [
                         {
                             "text": "You may choose to restrict the collection or use of your personal information in the following ways:",
                             "list": [
                                 {
                                     "text": "Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes."
                                 },
                                  {
                                      "text": "If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at care@milemates.com"
                                  },
                                  {
                                      "text": "You may request details of personal information which we hold about you under the Data Protection Act 1998."
                                  }
                             ]
                         },
                         {
                             "text": "For any issue related to any of our privacy policy or personal information related queries, please write to or email us at care@milemates.com."
                         }
                     ]
                 },
            ];

            var aboutUs = [
                {
                    "heading": "TRUSTED NAME IN AUTO-WORLD",
                    "desc": [
                        {
                            "text": "We personally faced these problems related to servicing of vehicles and felt this is ‘the need’ of the hour. Issues like, hectic work hours, difficulty in locating nearby service centres, sudden breakdown in traffic are faced by many people and we are here to provide you with solutions for your basic vehicle problem."
                        },
                        {
                            "text": "We, at milemates.in are determined to make your vehicle maintenance easy through an online platform. We bring all service centres (authorized) under a roof, enabling customers to pick from the best service centres available in the market. The idea is to reduce the waiting time in the service centres and provide a hassle free service booking, management and maintenance of vehicles for people."
                        }
                    ]
                }
            ];

            var mainFeature = [
               {
                   "heading": "MAIN FEATURES",
                   "desc": [
                       {
                           "text": "We provide an online platform where users can register and apply for servicing at any of the available authorized vehicle service. We want to make sure, your vehicle is always in the perfect condition and available as your long drives."
                       },
                       {
                           "text": "We provide booking for quick servicing, interim servicing, full servicing and many more."
                       },
                       {
                           "text": "We provide services like, home pickup and drop off of your vehicle(based on service centre agreement), guide you to the nearest service centre when your vehicle breaks down, check, SMS and email tracking of your service order and many more.",
                           "list": [
                                 {
                                     "text": "Full Servicing : includes Oil, Air filter change, washing, coating and all parts checkup."
                                 },
                                  {
                                      "text": "Interim Servicing : includes washing, full checkup and greasing."
                                  },
                                  {
                                      "text": "Quick Servicing : includes touch up, greasing, washing and check up."
                                  },
                                  {
                                      "text": "Hasle free Pickup and Drop facility."
                                  }
                           ]
                       }
                   ]
               }
            ];

            var _getHighlights = function () {
                return $timeout(function () {
                    return highlights;
                }, 0);
            };

            var _orderProcessingTC = function () {
                return $timeout(function () {
                    return orderProcessingTC;
                }, 0);
            };

            var _getAboutUs = function () {
                return $timeout(function () {
                    return aboutUs;
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

            var _getMainFeatures = function () {
                return $timeout(function () {
                    return mainFeature;
                }, 0);
            };

            var _feedback = function (f, l, p, s, m) {
                var deferred = $q.defer();
                $http.post("/api/Auth/Feedback?FirstName=" + f + "&LastName=" + l + "&Mobile=" + p + "&Subject=" + s + "&Message=" + m)
                 .then(function (result) {
                     //Success
                     deferred.resolve(result.data);
                 }, function (error) {
                     //Error
                     deferred.reject(error);
                 });

                return deferred.promise;
            };

            return {
                getHighlights: _getHighlights,
                orderProcessingTC: _orderProcessingTC,
                getPrivacyPolicy: _getPrivacyPolicy,
                getTerms: _getTerms,
                getAboutUs: _getAboutUs,
                getMainFeatures: _getMainFeatures,
                feedback: _feedback
            };
        }
    ]);