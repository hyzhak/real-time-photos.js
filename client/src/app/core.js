define([
    'app/connection',
    'app/map',
    'app/instagram'
],function (Connection, Map, Instagram) {
var self = this;

    var Core = {};
    Core.start = function(){
        console.log('start');
        Connection.followTag('love');
    };

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
            requestImages();
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
            imageData.caption&&imageData.caption.text
            );
    }, 1000);

    function requestImages(){
        /*
        Instagram.requestPopImages(function(imagesData){
            for(var index = 0, count = imagesData.length; index < count; index++){
                var imageData = imagesData[index];

                if(imageData.location && !isNaN(imageData.location.longitude)){
                    pushImage(imageData.id, imageData);
                }
            }
        });
        */

        Instagram.requestImageByTag('sunrise', function(imagesData){
            for(var index = 0, count = imagesData.length; index < count; index++){
                var imageData = imagesData[index];
                if( imageData.location && !isNaN(imageData.location.longitude)){
                    pushImage(imageData.id, imageData);
                }
            }
        });
    };

    requestImages();

    return Core;
});