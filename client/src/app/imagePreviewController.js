/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'app/core'
],function (Core) {
    return {
        templateUrl : 'partials/imagePreview.html',
        resolve     : {
            image : function($q, $route){
                var deferred = $q.defer();
                Core.getImageDataById($route.current.params.imageId, function(imageDataResult){
                    //TODO : after change data need to refresh DOM
                    var caption = (imageDataResult.caption?imageDataResult.caption.text:null)||'Picture';
                    if(caption.length > 80){
                        var index = caption.lastIndexOf(' ', 80)
                        caption = caption.substr(0, index) + '...';
                    }

                    deferred.resolve({
                        caption: caption,
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
                    });
                }, function(err){
                    deferred.reject("Error " + err);
                });

                return deferred.promise;
            }
        },
        controller  : function($scope, $location, $routeParams, image){
            $scope.image = image;

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

            $scope.checkActive = function(tag){
                return Core.isUseTag(tag)?'active':'';
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
    };
});