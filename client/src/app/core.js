define([
    'app/connection',
    'app/map'
],function (Connection, Map) {
    var Core = {};
    Core.start = function(){
        console.log('start');
        Connection.followTag('love');
    }

    return Core;
});