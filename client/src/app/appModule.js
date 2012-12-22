/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'libs/angular/angular'
],function (angular) {

    //TODO : нужно параметром передавть tag в
    var SearchController = function($scope){
        $scope.tag = 'love';
    }

    return angular.module('app', [])
        .config(function($routeProvider, $locationProvider){
            //$locationProvider.html5Mode(true);
            $routeProvider
                .when('/', {})
                .when('/byTag', {controller:SearchController});
        })
});