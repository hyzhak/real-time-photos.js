//describe deps
requirejs.config({
    baseUrl: './src',
    paths: {
        libs : './../libs',
        app : './app',

        //CDN
        //'jquery' : '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery',
        'jquery' : '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',

        //CDN
        'leaflet' : 'http://cdn.leafletjs.com/leaflet-0.5.1/leaflet',
        //'leaflet' : '../libs/leaflet/leaflet-src',

        'markercluster' : '../libs/leaflet.markercluster/leaflet.markercluster-src',

        'heatcanvas' : '../libs/leaflet.heatcanvas/heatcanvas-leaflet',

        //CDN
        'angular' : 'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.4/angular.min',
        //'angular' : 'http://code.angularjs.org/angular-1.0.0rc7.min',
        //'angular' : '../libs/angular/angular',

        //CDN
        'mustache' : 'http://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.0/mustache.min',
        //'Mustache' : 'libs/mustache',

        //plugins
        'text' : '../libs/requirejs/text'
    },
    shim: {
        /*
        '/socket.io/socket.io.js' : {
            exports: 'io'
        },
        */
        //CDN:
        //'http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js':{
        'leaflet':{
            exports: 'L'
        },
        'markercluster':{
            //CDN
            //deps : ['http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js'],
            deps : ['leaflet'],
            exports: 'MarkerCluster'
        },
        'libs/leaflet.heatcanvas/heatcanvas':{
            exports: 'HeatCanvas'
        },
        'heatcanvas':{
            //CDN
            //deps : ['http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js'],
            deps : [
                'leaflet',
                'libs/leaflet.heatcanvas/heatcanvas'
            ]
        },
        'angular':{
            exports: 'angular',
            deps: [
                'jquery'
            ]
        },
        '../libs/bootstrap/js/bootstrap':{
            deps: [
                'jquery'
            ]
        },

        'libs/bootstrap/js/bootstrap': ['jquery']
    }
});

// Start application
requirejs([
    //deps
    'app/route',
    'app/core',
    'angular',
    'jquery',
    '../libs/bootstrap/js/bootstrap',
    'app/navigationCtrl'
],function(Route, Core, angular, jquery){
    angular.bootstrap(document, ['app']);
});