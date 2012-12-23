/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
],function () {
    return function($scope, $location){
        $scope.image = {
            title: 'My Cool Image! ' + $scope.imageId
        }

        $scope.close = function(){
            $location.path('/');
        }

        $scope.previewClick = function(e){
            return false;
        }

        $(document).on('click', function(){
            //TODO: ?? doesn't work. Need to refresh
            $scope.close();
            $(document).off('click');
        });
    }
});