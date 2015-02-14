
angular.module("ngModules", [])
    .directive('ngSlideshow', function ($window, $interval) {

        return {
            restrict: 'EA',
            replace: true,
            templateUrl:'slides.html',
            scope: {
                textAlign: '=',
                titleName: '=',
                locationName: '=',
                height: '=',
                interval: '=',
                data: '='
            },
            link: function (scope, element, attrs) {

                // Slideshow data will hold all the slides
                scope.slideShowData = [];
                // Options will store all the options for the slideshow
                scope.options = {};
                // AutoStartSlideTimer is a variable that holds the timer information
                var autoStartSlideTimer;

                /**
                 * Load the data from variables passed through html
                 */
                var loadData = function () {
                    scope.options = {
                        "textAlign": scope.textAlign ? scope.textAlign : "left",
                        "titleName": scope.titleName ? scope.titleName : "Title",
                        "locationName": scope.locationName ? scope.locationName : "Url",
                        "height": scope.height ? scope.height : 400,
                        "interval": scope.interval ? scope.interval : 6000
                    };
                    // Start the slideshow only if the data variables is loaded is not empty
                    // TODO: Change view if no data loaded or not initialized
                    if (scope.data.length > 0) {
                        scope.slideShowData = scope.data;
                        initSlideshow();
                    }
                };

                // Watch all the variables passed through html
                scope.$watch('textAlign', loadData);
                scope.$watch('titleName', loadData);
                scope.$watch('locationName', loadData);
                scope.$watch('height', loadData);
                scope.$watch('interval', loadData);
                scope.$watch('data', loadData);

                /**
                 * Go to the next slide
                 * @param index - Index of the current slide
                 */
                scope.goForward = function(index) {
                    scope.stopSlideshow();
                    changeImage(index+1);
                };

                /**
                 * Go to the previous slide
                 * @param index - Index of the current slide
                 */
                scope.goBack = function(index) {
                    scope.stopSlideshow();
                    changeImage(index-1);
                };

                /**
                 * Go to a certain slide
                 * @param index - Index of the slide to go to
                 */
                scope.goToSlide = function(index) {
                    scope.stopSlideshow();
                    changeImage(index);
                };

                /**
                 * Stop the slideshow
                 */
                scope.stopSlideshow = function() {
                    stopSlides(false);
                };

                /**
                 * Start the slideshow
                 */
                scope.startSlideshow = function() {
                    startSlides(false);
                };

                /**
                 * Pause the slides
                 */
                scope.pauseSlideshow = function() {
                    stopSlides(true);
                };

                /**
                 * Reume the slides
                 */
                scope.resumeSlideshow = function() {
                    startSlides(true);
                };

                /**
                 * Helper function - Start slides
                 * @param onPause - Whether we are starting from puase state or not
                 */
                function startSlides(onPause) {
                    // stops any running interval to avoid two intervals running at the same time
                    $interval.cancel(autoStartSlideTimer);
                    if (!onPause) {
                        scope.counter = 0;
                        scope.isStopped = false;
                    } else {
                        scope.isPaused = false;
                    }
                    scope.slideshowRunning = true;
                    // store the interval promise
                    autoStartSlideTimer = $interval(callAtInterval, 1);
                }

                /**
                 * Helper function - Stop slides
                 * @param onPause - Whether we are pausing or not
                 */
                function stopSlides(onPause) {
                    $interval.cancel(autoStartSlideTimer);
                    if (!onPause) {
                        scope.counter = 0;
                        scope.isStopped = true;
                    } else {
                        scope.isPaused = true;
                    }
                    scope.slideshowRunning = false;
                }

                /**
                 * Toggle the slideshow. Meaning, if it's on, stop it, else start it.
                 */
                scope.toggleSlideshow = function(isPause) {
                    console.log(isPause)
                    if (scope.slideshowRunning){
                        if (isPause){
                            scope.isPaused = true;
                            scope.pauseSlideshow();
                        }  else {
                            scope.isStopped = true;
                            scope.stopSlideshow();
                        }

                    }
                    else {
                        if (isPause){
                            scope.isPaused = false;
                            scope.resumeSlideshow();
                        } else {
                            scope.isStopped = false;
                            scope.startSlideshow();
                        }

                    }
                };

                /**
                 * Initialize the slideshow
                 */
                function initSlideshow() {

                    setResponsiveHeights();
                    scope.activeIndex = 0;
                    setActiveTitle(scope.titleName);
                    autoStartSlideShow();

                }

                /**
                 * Set the responsive height and add a watch around the change in width of the browser
                 * Could be accomplished in CSS but this increases browser compatibility.
                 *
                 */
                function setResponsiveHeights() {
                    scope.options.ResponsiveHeight = scope.options.height;
                    scope.$watch(function(){
                        return $window.innerWidth;
                    }, function(value) {
                        if (value < 480)
                            scope.options.ResponsiveHeight = scope.options.height / 4 > 300 ? scope.options.height / 4 : 300;
                        else if (value < 768)
                            scope.options.ResponsiveHeight = scope.options.height / 3 > 300 ? scope.options.height / 3 : 300;
                        else if (value < 1024)
                            scope.options.ResponsiveHeight = scope.options.height / 2 > 300 ? scope.options.height / 2 : 300;
                        else scope.options.ResponsiveHeight = scope.options.height;
                    });
                }

                /**
                 * Start the slideshow automatically when the application is start, and setup garbage collection
                 */
                function autoStartSlideShow() {
                    // Since the interval we want is in MS but $interval has a set interval of 4s, we normalize it.
                    scope.delay = scope.options.interval / 4;

                    // Set the slideshow defaults
                    scope.slideshowRunning = true;
                    scope.counter = 0;

                    // Start the slideshow
                    scope.startSlideshow();

                    // Make sure to do some cleanup in case a person goes out of view
                    scope.$on('$destroy', function() {
                        scope.stopSlideshow();
                        scope.slideshowRunning = false;
                    });
                }

                /**
                 * When the interval reaches a trigger, if the counter is set to the delay in options,
                 * go to the next slide, else simply icrement the counter. This is useful for our progress bar as
                 * the width is based on the counter
                 */
                function callAtInterval() {
                    if (scope.counter === scope.delay){
                        changeImage(scope.activeIndex+1);
                        scope.counter = 0;
                    } else {
                        scope.counter++;
                    }
                }

                /**
                 * Change the image in view
                 * @param newIndex - The new index to change the image to. This is the index from the data
                 */
                function changeImage(newIndex) {
                    if (newIndex === scope.slideShowData.length)
                        scope.activeIndex = 0;
                    else scope.activeIndex = newIndex;
                    setActiveTitle(scope.options.titleName);
                }

                /**
                 * Sets the active title of the slide.
                 * @param titleName - The title name to set as the slide title.
                 */
                function setActiveTitle(titleName) {
                    scope.activeTitle = scope.slideShowData[scope.activeIndex][titleName];
                }

            }
        };

    });