define([
    'app/connection',
    'app/map',
    'app/instagram'
],function (Connection, Map, Instagram) {
var self = this;

    var Core = {};

    var showedImages = [];

    Core.running = false;
    Core.pausedHandler = requestPopImages;

    Core.startFollowByTag = function(tag){
        tag = tag||'sunrise';
        console.log('startFollowByTag', tag);
        var tags = [tag];
        filterOldImages(tags);
        Core.tags = tags;
        Core.running = true;
        Connection.followTag(tags);
        runHandler(requestImagesByTags);
    };

    Core.startFollowByTags = function(tags){
        //TODO follow tags
        console.log('start follow by tags', tags);
        if(isUseTags(tags)){
            return;
        }

        filterOldImages(tags);
        Core.tags = tags;
        Core.running = true;
        Connection.followTag(tags);
        runHandler(requestImagesByTags);
    }

    Core.startFollowPop = function(){
        runHandler(requestPopImages);
    }

    Core.stop = function(){
        console.log('stop');

        if(!Core.running){
            return;
        }

        Core.running = false;
        Core.pausedHandler = Core.currentHandler;

        runHandler(doNothing);
    }

    Core.start = function(){
        if(Core.running){
            return;
        }

        Core.running = true;

        runHandler(Core.pausedHandler);
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
        if(imagesBufferToShow.length <= 0 || !Core.running){
            Core.currentHandler();
            return;
        }

        var imageData = imagesBufferToShow.pop();

        showedImages.push(imageData);

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
        Instagram.requestPopImages(onGetImage);
    }

    function requestImagesByTags(){
        var tags = Core.tags;
        for(var index = 0, count = tags.length; index < count; index++){
            Instagram.requestImageByTag(tags[index], onGetImage);
        }
    };

    function onGetImage(imagesData){
        for(var index = 0, count = imagesData.length; index < count; index++){
            var imageData = imagesData[index];
            if( imageData.location && !isNaN(imageData.location.longitude)){
                pushImage(imageData.id, imageData);
            }
        }
    }

    function doNothing(){};


    function runHandler(handler){
        Core.currentHandler = handler;
        Core.currentHandler();
    }

    Core.isUseTag = function(tag){
        if(!Core.tags){
            return false;
        }

        return Core.tags.indexOf(tag)>=0;
    };

    function filterOldImages(tags) {
        for(var index = showedImages.length - 1; index >= 0; index--){
            var image = showedImages[index];

            if(!isValidImage(image, tags)){
                map.hideImage(image.id);
                showedImages.splice(index, 1);
            }
        }
    }

    function isValidImage(image, tags) {
        for(var i = tags.length - 1; i >= 0; i--){
            if(image.tags.indexOf(tags[i])>=0){
                return true;
            }
        }

        return false;
    }

    function isUseTags(tags) {
        if(!Core.tags){
            return false;
        }

        for(var index = 0, count = tags.length; index < count; index++){
            if(Core.tags.indexOf(tags[index])<0){
                return false;
            }
        }

        return true;
    }

    return Core;
});