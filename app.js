'use strict';

angular.module('slideShow', [])

    .controller("ExampleCtrl", function ($scope, $window, $interval) {

        // This is the data we assume will come in
        var data = {
            "Images": [
                {
                    "Title": "Drag & Drop a Receipt",
                    "Url": "http://support.usetallie.com/customer/portal/attachments/363862"
                },
                {
                    "Title": "Import CC Transactions",
                    "Url": "http://support.usetallie.com/customer/portal/attachments/136674"
                },
                {
                    "Title": "Email Receipts",
                    "Url": "http://support.usetallie.com/customer/portal/attachments/385960"
                },
                {
                    "Title": "Automatic Expense Reports",
                    "Url": "http://support.usetallie.com/customer/portal/attachments/385993"
                },
                {
                    "Title": "Approve Expense Reports via Email",
                    "Url": "http://support.usetallie.com/customer/portal/attachments/238759"
                },
                {
                    "Title": "Export to Quickbooks Online",
                    "Url": "http://support.usetallie.com/customer/portal/attachments/314630"
                }
            ]
        };

        // These are the options we would pass into the derivative
        $scope.options = {
            "height": 500,
            "titleName": "Title",
            "textAlign": "center",
            interval: 5000
        };
        $scope.slideShowData = data["Images"];

        /***************************************************************************
         *
         * PLUGIN CODE
         *  - This code would essentially move to a derivative so that we
         *  can use multiple slideshows on one page, and reusing this code
         *  would be as simple as
         *      <slideshow data="dateInput" options="options"></slideshow>
         *  - The main reason I decided not to use derivatives for now was
         *  the fact that I hadn't done it in so long (due to graduation and job search)
         *  some of the updates changed the ways some things were done. However reading up
         *  on it, would definitely refresh my memory.
         *  - All $scope functions would be public methods.
         *
         ***************************************************************************/

        /**
         * Go to the next slide
         * @param index - Index of the current slide
         */
        $scope.goForward = function(index) {
            $scope.stopSlideshow();
            changeImage(index+1);
        };

        /**
         * Go to the previous slide
         * @param index - Index of the current slide
         */
        $scope.goBack = function(index) {
            $scope.stopSlideshow();
            changeImage(index-1);
        };

        /**
         * Go to a certain slide
         * @param index - Index of the slide to go to
         */
        $scope.goToSlide = function(index) {
            $scope.stopSlideshow();
            changeImage(index);
        };

        /**
         * Stop the slideshow
         */
        $scope.stopSlideshow = function() {
            $interval.cancel(autoStartSlideTimer);
            $scope.counter = 0;
            $scope.slideshowRunning = false;
        };

        /**
         * Start the slideshow
         */
        $scope.startSlideshow = function() {
            // stops any running interval to avoid two intervals running at the same time
            $scope.stopSlideshow();
            $scope.counter = 0;
            $scope.slideshowRunning = true;
            // store the interval promise
            autoStartSlideTimer = $interval(callAtInterval, 1);
        };

        /**
         * Toggle the slideshow. Meaning, if it's on, stop it, else start it.
         */
        $scope.toggleSlideshow = function() {
            if ($scope.slideshowRunning) $scope.stopSlideshow();
            else $scope.startSlideshow();
        };


        // Start the slideshow when the app is ready.
        var autoStartSlideTimer;
        initSlideshow();

        /**
         * Initialize the slideshow
         */
        function initSlideshow() {

            setResponsiveHeights();
            $scope.activeIndex = 0;
            setActiveTitle($scope.options.titleName);
            autoStartSlideShow();

        }

        /**
         * Set the responsive height and add a watch around the change in width of the browser
         * Could be accomplished in CSS but this increases browser compatibility.
         *
         */
        function setResponsiveHeights() {
            $scope.options.ResponsiveHeight = $scope.options.height;
            $scope.$watch(function(){
                return $window.innerWidth;
            }, function(value) {
                if (value < 480)
                    $scope.options.ResponsiveHeight = $scope.options.height / 4 > 300 ? $scope.options.height / 4 : 300;
                else if (value < 768)
                    $scope.options.ResponsiveHeight = $scope.options.height / 3 > 300 ? $scope.options.height / 3 : 300;
                else if (value < 1024)
                    $scope.options.ResponsiveHeight = $scope.options.height / 2 > 300 ? $scope.options.height / 2 : 300;
                else $scope.options.ResponsiveHeight = $scope.options.height;
            });
        }

        /**
         * Start the slideshow automatically when the application is start, and setup garbage collection
         */
        function autoStartSlideShow() {
            // Since the interval we want is in MS but $interval has a set interval of 4s, we normalize it.
            $scope.delay = $scope.options.interval / 4;

            // Set the slideshow defaults
            $scope.slideshowRunning = true;
            $scope.counter = 0;

            // Start the slideshow
            $scope.startSlideshow();

            // Make sure to do some cleanup in case a person goes out of view
            $scope.$on('$destroy', function() {
                $scope.stopSlideshow();
                $scope.slideshowRunning = false;
            });
        }

        /**
         * When the interval reaches a trigger, if the counter is set to the delay in options,
         * go to the next slide, else simply icrement the counter. This is useful for our progress bar as
         * the width is based on the counter
         */
        function callAtInterval() {
            if ($scope.counter === $scope.delay){
                changeImage($scope.activeIndex+1);
                $scope.counter = 0;
            } else {
                $scope.counter++;
            }
        }

        /**
         * Change the image in view
         * @param newIndex - The new index to change the image to. This is the index from the data
         */
        function changeImage(newIndex) {
            if (newIndex === $scope.slideShowData.length)
                $scope.activeIndex = 0;
            else $scope.activeIndex = newIndex;
            setActiveTitle($scope.options.titleName);
        }

        /**
         * Sets the active title of the slide.
         * @param titleName - The title name to set as the slide title.
         */
        function setActiveTitle(titleName) {
            $scope.activeTitle = $scope.slideShowData[$scope.activeIndex][titleName];
        }



    });
