define([
    'app/connection',
    'app/map'
],function (Connection, Map) {
    var Core = {};
    Core.start = function(){
        console.log('start');
        Connection.followTag('love');
    }

    var map = new Map();
    map.placeAt('images-map');

    return Core;
});