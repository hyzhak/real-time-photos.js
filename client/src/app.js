(function(){
    //describe deps
    requirejs.config({
        baseUrl: './src',
        paths: {
            libs : './../libs',
            app : './app'
        },
        shim: {
            'libs/three' : {
                exports: 'THREE'
            },
            'libs/TrackballControls' : {
                deps : ['libs/three'],
                exports : 'TrackballControls'
            },
            'http://code.createjs.com/easeljs-0.5.0.min.js' : {
                exports : 'createjs'
            },
            '/socket.io/socket.io.js' : {
                exports: 'io'
            },
            //CDN:
            'http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js':{
                exports: 'L'
            },
            'libs/leaflet.markercluster/leaflet.markercluster':{
                deps : ['http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js'],
                exports: 'MarkerCluster'
            }
        }
    });

    // Start application
    requirejs([
        //deps
        'app/core'
    ],function(Core){
        Core.start();
    });
})();