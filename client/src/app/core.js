define([
    'app/connection',
    'app/map',
    'app/instagram'
],function (Connection, Map, Instagram) {
var self = this;

    var Core = {};
    Core.startFollowByTag = function(tag){
        tag = tag||'sunrise';
        console.log('startFollowByTag', tag);
        Core.tag = tag||'sunrise';
        Core.currentHandler = requestImagesByTag;
        Connection.followTag(tag);
        Core.currentHandler();
    };

    Core.isUseTag = function(tag){
        return Core.tag === tag;
    };

    Core.startFollowPop = function(){
        Core.currentHandler = requestPopImages;
        Core.currentHandler();
    }

    Core.stop = function(){
        console.log('stop');
        Core.currentHandler = doNothing;
    }

    Core.clearAllImages = function(){
        images = {};
        imagesBufferToShow = [];
        map.clearAllImages();
    }

    Core.setVisibleHeatMap = function(value){
        map.setVisibleHeatMap(value);
    }

    Core.setVisibleImages = function(value){
        map.setVisibleImages(value);
    }

    Core.currentHandler = doNothing;

    Core.getImageDataById = function(id, callback, errorHandler){
        var imageData = images[id];
        if(imageData){
            callback(imageData);
        }else{
            Instagram.requestImageById(id, callback, errorHandler);
        }
    }

    var map = new Map();
    map.placeAt('images-map');

    var images = {},
        imagesBufferToShow = [];

    function pushImage(id, imageData){
        if(images[id]){
            return;
        }

        images[id] = imageData;
        imagesBufferToShow.push(imageData);
    }

    setInterval(function(){
        if(imagesBufferToShow.length <= 0){
            Core.currentHandler();
            return;
        }

        var imageData = imagesBufferToShow.pop();

        map.placeImage(
            imageData.location.latitude,
            imageData.location.longitude,
            imageData.images.thumbnail.width,
            imageData.images.thumbnail.height,
            imageData.images.thumbnail.url,
            imageData.link,
            imageData.caption&&imageData.caption.text,
            imageData.id,
            onImageClick);
    }, 1000);

    function onImageClick(id){
        window.location = '#/image/' + id;
    };

    function requestPopImages(){
        Instagram.requestPopImages(function(imagesData){
            for(var index = 0, count = imagesData.length; index < count; index++){
                var imageData = imagesData[index];

                if(imageData.location && !isNaN(imageData.location.longitude)){
                    pushImage(imageData.id, imageData);
                }
            }
        });
    }

    function requestImagesByTag(){
        Instagram.requestImageByTag(Core.tag, function(imagesData){
            for(var index = 0, count = imagesData.length; index < count; index++){
                var imageData = imagesData[index];
                if( imageData.location && !isNaN(imageData.location.longitude)){
                    pushImage(imageData.id, imageData);
                }
            }
        });
    };

    function doNothing(){};

    return Core;
});