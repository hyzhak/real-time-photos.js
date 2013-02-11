/**
 * Project: .
 * Copyright (c) 2013, Eugene-Krevenets
 */
define([
    'app/appModule' ,
    'app/imagePreviewController',
    'app/tagController'
],function (module, ImagePreviewController, TagController) {
    module.config(['$routeProvider', function($routeProvider, $locationProvider){
        //$locationProvider.html5Mode(true);
        $routeProvider
            //.when('/', {})
            .when('/tag/:tags', {
                templateUrl: 'partials/follow.html',
                controller: TagController
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

    return {};
});