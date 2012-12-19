define([
    'app/appModule',
    'app/core'
],function (appModule, Core) {
    appModule.controller('NavigationCtrl', function($scope) {

        $scope.state = 'stop'

        $scope.tag = 'love';

        $scope.isStopActive = function(){
            return ($scope.state === 'stop')?'active':'';
        }

        $scope.stop = function(){
            Core.stop();
            $scope.state = 'stop';
        }

        $scope.requestPop = function(){
            $scope.state = 'request pop';
        }

        $scope.requestByTag = function(){
            Core.startFollowByTag($scope.tag);
            $scope.state = 'request by tag';
        }
    });
});