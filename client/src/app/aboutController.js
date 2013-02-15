define([
    'app/appModule',
    'config'
],function (module, Config) {
    return module.controller('AboutController', ['$scope', function($scope){
        $scope.version = Config.VERSION;
        console.log('$scope.version', $scope.version);
    }]);
});