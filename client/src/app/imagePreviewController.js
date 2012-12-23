/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'app/core'
],function (Core) {
    return function($scope, $location, $routeParams){
        Core.getImageDataById($routeParams.imageId, function(imageDataResult){
            //TODO : after change data need to refresh DOM
            $scope.image = {
                caption: imageDataResult.caption||'Picture',
                url: imageDataResult.images.low_resolution.url,
                width: 306,
                height: 306,
                authorName: imageDataResult.user.full_name||imageDataResult.user.username,
                authorId: imageDataResult.user.id,
                profilePicture: imageDataResult.user.profile_picture,
                locationName: (imageDataResult.location?imageDataResult.location.name:null)||'somewhere',
                locationId: imageDataResult.location?imageDataResult.location.id:null,
                tags : imageDataResult.tags,
                linkOutside : imageDataResult.link
            };
        }, function(err){
            $scope.close();
        });

        $scope.image = {};

        $scope.close = function(){
            //TODO: ?? doesn't work on custom execute. Need to lowlevel
            //$location.path('/');
            window.location = '/#/';
        }

        $('#image-preview').on('mousedown', function(){
            return false;
        });

        $scope.previewClick = function(e){
            return false;
        }

        $(document).on('mousedown', function(){
            $scope.close();
            removeListeners();
        });

        function removeListeners(){
            $(document).off('mousedown');
            $('#image-preview').off('mousedown');
        }
    }
});