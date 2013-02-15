define([
    'app/connection',
    'app/map',
    'app/instagram'
],function (Connection, Map, Instagram) {
var self = this;

    var Core = {};

    var availableImages = 10;

    var showedImages = [];

    var timeLastEmptyResponse = 0;
    var emptyResponseInterval = 10*1000; //if fail, wait for 1 minute
    var emptyResponseTags = [];

    Core.uselessRequest = 0;

    //we have requested Instagram
    var haveRequested = false;

    Core.running = false;
    Core.pausedHandler = requestPopImages;

    Core.startFollowByTag = function(tag){
        tag = tag||'sunrise';
        var tags = [tag];
        filterOldImages(tags);
        Core.tags = tags;
        Core.running = true;
        Connection.followTag(tags);
        runHandler(requestImagesByTags);
    };

    Core.startFollowByTags = function(tags){
        //TODO follow tags
        if(isUseTags(tags)){
            Core.running = true;
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
            return false;
        }

        images[id] = imageData;
        imagesBufferToShow.push(imageData);

        return true;
    }

    setInterval(function(){
        if(imagesBufferToShow.length <= 0 || !Core.running){
            Core.currentHandler();
            return;
        }
        if(--availableImages<=0){
        //    return;
        };

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
        if(haveRequested){
            return;
        }

        if(Date.now() - timeLastEmptyResponse < emptyResponseInterval && Core.tags == emptyResponseTags){
            return;
        }

        haveRequested = true;

        emptyResponseTags = Core.tags;

        var tags = Core.tags;
        for(var index = 0, count = tags.length; index < count; index++){
            Instagram.requestImageByTag(tags[index], onGetImage);
        }
    };

    function onGetImage(imagesData){
        haveRequested = false;
        var usefulImageCount = 0;
        for(var index = 0, count = imagesData.length; index < count; index++){
            var imageData = imagesData[index];
            if( imageData.location && !isNaN(imageData.location.longitude)){
                usefulImageCount += pushImage(imageData.id, imageData);
            }
        }

        if(usefulImageCount <= 0){
            timeLastEmptyResponse = Date.now();
            _gaq.push(['_trackEvent', 'instagram', 'drain', Core.tags]);
            Core.uselessRequest++;
            if(Core.uselessRequest > 3){
                console.log('Too many useless requests');
            }
        }else{
            Core.uselessRequest = 0;
        }

        _gaq.push(['_trackEvent', 'instagram', 'usefulImageCount', Core.tags, usefulImageCount]);
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