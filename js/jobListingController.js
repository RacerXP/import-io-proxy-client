angular.module('JobListingPanel', [])
    .controller('JobListingController', ['$scope', '$http', function ($scope, $http) {
        'use strict';
        $scope.jobs = [];
        $scope.company = '';

        function parseAggregation(data){

        }

        function parseJobList(data) {
            return _.map(data, function (d) {
                const obj =  {
                    city: '',
                    state: '',
                    title: d.Title[0].text,
                    href: d.Title[0].href || d.Url[0].text
                };
                if(Array.isArray(d.City)) obj.city = d.City[0].text;
                if(Array.isArray(d.State)) obj.state = d.State[0].text;

                return obj;
            });
        }

        function getJobsList(id, useDataAggregation) {
            $scope.errorMessage = '';
            var url = 'http://localhost:3000/api';
            if (id) {
                var url = 'http://localhost:3000/api/' + id;
            }

            if (useDataAggregation) {
                var url = 'http://localhost:3000/api/?aggregate=true';
            }

            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(res) {
                if (id || useDataAggregation) {
                    var list = parseJobList(res.data);
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

        $scope.showJobList = function (id, description, useAggregation) {
            $scope.company = description;
            getJobsList(id, useAggregation);
        }
        $scope.init = function () {
            getJobsList();
        };
    }]);