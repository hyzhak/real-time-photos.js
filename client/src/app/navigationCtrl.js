define([
    'app/appModule'
],function (appModule) {
    appModule.controller('NavigationCtrl', function($scope) {
        console.log('NavigationCtrl');
        $scope.value = 69;
    });
});