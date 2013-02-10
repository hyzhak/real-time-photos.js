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
                //.when('/', {})
                .when('/tag/:tagName', {
                    controller:SearchController
                })
                .when('/about', {
                    templates: {
                        modalWindowUrl: 'partials/about.html'
                    }
                })
                .when('/start', {
                    templates: {
                        modalWindowUrl: 'partials/start.html'
                    }
                })
                .when('/image/:imageId', ImagePreviewController)
                .otherwise({
                    redirectTo: '/start'
                });
        }]);

    return module;
});