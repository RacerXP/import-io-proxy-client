angular.module('JobListingPanel', [])
    .controller('JobListingController', ['$scope', '$http', function ($scope, $http) {
        'use strict';
        $scope.jobs = [];
        $scope.company = '';

        function parseJobList(data) {
            return _.map(data, function (d) {
                return {
                    city: d.City[0].text,
                    state: d.State[0].text,
                    title: d.Title[0].text,
                    href: d.Title[0].href
                };
            });
        }

        function getJobsList(id) {
            $scope.errorMessage = '';
            var url = 'http://localhost:3000/api';
            if (id) {
                var url = 'http://localhost:3000/api/' + id;
            }
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(res) {
                if (id) {
                    var list = parseJobList(res.data.result.extractorData.data[0].group);
                    displayJobList(list);
                    return;
                }
                displaySiteList(res.data);

                console.log({success: 'success', response: res});
            }, function errorCallback(res) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log({error: 'error', response: res});
                $scope.errorMessage = res.data;
            });
        }

        function displaySiteList(data) {
            $scope.jobs = data;
            $scope.activeForm = 'sites'
        }

        function displayJobList(data) {
            $scope.joblist = data;
            console.log(data);
            $scope.activeForm = 'jobs'
        }

        $scope.showJobList = function (id, description) {
            $scope.company = description;
            getJobsList(id);
        }
        $scope.init = function () {
            getJobsList();
        };
    }]);