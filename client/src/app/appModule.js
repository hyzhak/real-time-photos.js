/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'libs/angular/angular',
    'app/imagePreviewController'
],function (angular, ImagePreviewController) {

    //TODO : нужно параметром передавть tag в
    var SearchController = function($scope){
        $scope.tag = 'love';
        $scope.modalWindowUrl = '';
    }

    var AboutController = function($scope){
        $scope.modalWindowUrl = 'partials/about.html';
    }

    return angular.module('app', [])
        .config(function($routeProvider, $locationProvider){
            //$locationProvider.html5Mode(true);
            $routeProvider
                .when('/', {})
                .when('/byTag', {
                    controller:SearchController
                })
                .when('/about', {
                    controller: AboutController
                })
                .when('/image/:imageId', ImagePreviewController)
                .otherwise({
                    redirectTo: '/'
                });
        })
});