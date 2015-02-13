
angular.module("ngModules", [])
    .directive('ngSlideshow', function ($window, $interval) {

        return {
            restrict: 'EA',
            replace: true,
            template:generateHtml(),
            scope: {
                textAlign: '=',
                titleName: '=',
                locationName: '=',
                height: '=',
                interval: '=',
                data: '='
            },
            link: function (scope, element, attrs) {

                scope.slideShowData = [];
                scope.options = {};
                // Start the slideshow when the app is ready.
                var autoStartSlideTimer;

                var loadData = function () {
                    scope.options = {
                        "textAlign": scope.textAlign ? scope.textAlign : "left",
                        "titleName": scope.titleName ? scope.titleName : "Title",
                        "locationName": scope.locationName ? scope.locationName : "Url",
                        "height": scope.height ? scope.height : 400,
                        "interval": scope.interval ? scope.interval : 6000
                    };
                    if (scope.data.length > 0) {
                        scope.slideShowData = scope.data;
                        initSlideshow();
                    }
                };
                
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
                    $interval.cancel(autoStartSlideTimer);
                    scope.counter = 0;
                    scope.slideshowRunning = false;
                };

                /**
                 * Start the slideshow
                 */
                scope.startSlideshow = function() {
                    // stops any running interval to avoid two intervals running at the same time
                    scope.stopSlideshow();
                    scope.counter = 0;
                    scope.slideshowRunning = true;
                    // store the interval promise
                    autoStartSlideTimer = $interval(callAtInterval, 1);
                };

                /**
                 * Toggle the slideshow. Meaning, if it's on, stop it, else start it.
                 */
                scope.toggleSlideshow = function() {
                    if (scope.slideshowRunning) scope.stopSlideshow();
                    else scope.startSlideshow();
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

        function generateHtml() {
            var strVar="";
            strVar += "    <div class=\"ngSlideshow\" ng-style=\"{height:options.ResponsiveHeight + 'px'}\">";
            strVar += "";
            strVar += "        <div class=\"slide-container\">";
            strVar += "";
            strVar += "            <!-- SLIDER TOP -->";
            strVar += "            <div class=\"slide-top\">";
            strVar += "                <h1 ng-style=\"{'text-align':options.textAlign}\">{{ activeTitle }}<\/h1>";
            strVar += "                <span ng-click=\"toggleSlideshow()\">{{slideshowRunning ? 'Stop' : 'Start'}}<\/span>";
            strVar += "            <\/div>";
            strVar += "            <!-- END SLIDER TOP -->";
            strVar += "";
            strVar += "            <!-- MAIN CONTENT -->";
            strVar += "            <div class=\"slide-main animated fadeIn\" style=\"background-image:url({{ slide[options.locationName] }});\"";
            strVar += "                 ng-show=\"activeIndex === $index\"";
            strVar += "                 ng-style=\"{height:(options.ResponsiveHeight - 100) + 'px'}\"";
            strVar += "                 ng-repeat=\"slide in slideShowData track by $index\">";
            strVar += "";
            strVar += "                <span ng-style=\"{width : ( (counter\/delay * 100) + '%' ) }\"><\/span>";
            strVar += "";
            strVar += "                <div class=\"slide-left\" ng-show=\"activeIndex !== 0\" ng-click=\"goBack($index)\">";
            strVar += "                    <a href=\"javascript:;\"><\/a>";
            strVar += "                <\/div>";
            strVar += "                <div class=\"slide-right\" ng-show=\"activeIndex !== slideShowData.length-1\" ng-click=\"goForward($index)\">";
            strVar += "                    <a href=\"javascript:;\"><\/a>";
            strVar += "                <\/div>";
            strVar += "";
            strVar += "            <\/div>";
            strVar += "            <!-- END MAIN CONTENT -->";
            strVar += "";
            strVar += "        <\/div>";
            strVar += "";
            strVar += "        <!-- BOTTOM NAVIGATION -->";
            strVar += "        <div class=\"slide-nav\">";
            strVar += "            <ul>";
            strVar += "                <li ng-repeat=\"slide in slideShowData track by $index\" ng-click=\"goToSlide($index)\"";
            strVar += "                    ng-class=\"{active:activeIndex === $index}\">{{$index}}";
            strVar += "                <\/li>";
            strVar += "            <\/ul>";
            strVar += "        <\/div>";
            strVar += "        <!-- END BOTTOM NAVIGATION -->";
            strVar += "";
            strVar += "    <\/div>";
            return strVar;
        }

    });