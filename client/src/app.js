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
            'http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js':{
                exports: 'L'
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