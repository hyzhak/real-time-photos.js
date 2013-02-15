define([
    'config'
],function (Config) {
    var calls = 1;

    var timeLastFail = 0;
    var failInterval = 1*60*1000; //if fail, wait for 1 minute

    //@private
    function requestFromInstagram(params, callback, errorHandler) {
        console.log('requestFromInstagram', params);
        console.log(Date.now() - timeLastFail);
        if(Date.now() - timeLastFail < failInterval){
            return;
        }

        if(params.indexOf('?')<0){
            params += '?';
        }

        var url = 'https://api.instagram.com/v1/' + params + 'client_id=' + Config.INSTAGRAM_CLIENT_ID;
        //var url = 'http://google.com';
        _gaq.push(['_trackEvent', 'instagram', 'request', params]);
        $.ajax(url, {
            crossDomain:true,
            dataType:'jsonp',
            error : function(xhr, testStatus, error){
                console.log('error', arguments);
            }
        }).done(function (response) {
            console.log('done', response);
            _gaq.push(['_trackEvent', 'instagram', 'request-done', params]);
            switch (response.meta.code) {
                case 200:
                    console.log('error', response.meta);
                    if(errorHandler){
                        errorHandler(response.meta);
                    }
                    return;
                case 420:
                    console.log('error', response);
                    return;
                default:
                    var dataArray = response.data;
                    callback(dataArray);
                    break;
            }
        });

        // figure out what the callback fn is
        var $script = $(document.getElementsByTagName('head')[0].firstChild);
        $script[0].onerror = function(){
            console.log('requestFromInstagram error');
            _gaq.push(['_trackEvent', 'instagram', 'request-error', params]);
            timeLastFail = Date.now();
            if(errorHandler){
                errorHandler();
            }
        }
    }

    function failRequest(jqXHR, textStatus, errorThrown){
        console.log('failRequest');
    }

    return {
        requestImagesAt: function(lat, lng, distance, callback, errorHandler){
            var params = 'media/search?lat=' + lat + '&lng=' + lng + '&distance=' + distance + '&';
            requestFromInstagram(params, callback, errorHandler);
        },

        requestPopImages: function (callback, errorHandler) {
            var params = 'media/popular?';
            requestFromInstagram(params, callback, errorHandler);
        },

        requestImageByTag: function (tag, callback, errorHandler){
            var params = 'tags/' + tag + '/media/recent?';
            requestFromInstagram(params, callback, errorHandler);
        },

        requestImageById: function(id, callback, errorHandler){
            var params = 'media/' + id;
            requestFromInstagram(params, callback, errorHandler);
        },

        requestImagesOfUser: function (user, callback){
            var params = '';
        }
    };
});