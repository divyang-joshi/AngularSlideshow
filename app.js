'use strict';

angular.module('slideShow', ['ngModules'])

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





    });
