/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'angular',
    'app/imagePreviewController'
],function (angular, ImagePreviewController) {

    //TODO : нужно параметром передавть tag в
    var SearchController = function($scope){
        console.log('SearchController');
        $scope.tag = 'love';
        $scope.modalWindowUrl = '';
    }

    var module = angular.module('app', [])
        .config(['$routeProvider', function($routeProvider, $locationProvider){
            //$locationProvider.html5Mode(true);
            $routeProvider
                .when('/', {})
                .when('/byTag', {
                    controller:SearchController
                })
                .when('/about', {
                    templates: {
                        modalWindowUrl: 'partials/about.html'
                    }
                })
                .when('/image/:imageId', ImagePreviewController)
                .otherwise({
                    redirectTo: '/'
                });
        }]);

    module.controller('AboutController', ['$scope', function(){
        $('#modal-window').modal()
            .on('hidden', function(e){
                window.location = '/#/';
            });
    }]);

    return module;
});