/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'config'
],function (Config) {
    //@private
    function requestFromInstagram(params, callback, errorHandler) {
        var url = 'https://api.instagram.com/v1/' + params + 'client_id=' + Config.INSTAGRAM_CLIENT_ID;
        console.log('requestFromInstagram', url);
        $.ajax(url, {
            crossDomain:true,
            dataType:'jsonp'
        }).done(function (response) {
                if (response.meta.code != 200) {
                    console.log('error', response.meta);
                    if(errorHandler){
                        errorHandler(response.meta);
                    }
                    return;
                }
                console.log('ajax', response);
                var dataArray = response.data;
                callback(dataArray);
            });
    }

    return {
        requestImagesAt: function(lat, lng, distance, callback){
            var params = 'media/search?lat=' + lat + '&lng=' + lng + '&distance=' + distance + '&';
            requestFromInstagram(params, callback);
        },

        requestPopImages: function (callback) {
            var params = 'media/popular?';
            requestFromInstagram(params, callback);
        },

        requestImageByTag: function (tag, callback){
            var params = 'tags/' + tag + '/media/recent?';
            requestFromInstagram(params, callback);
        },

        requestImagesOfUser: function (user, callback){
            var params = '';
        }
    };
});