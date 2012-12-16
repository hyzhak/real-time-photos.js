/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    'http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js' //CDN
],function (L) {
    var Map = function(){
        this.map = null;
        this.maxZoom = 8;
    };

    Map.prototype.placeAt = function(domElement){
        this.map = L.map(domElement).setView([51.505, -0.09], 13);

        this.mapLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: this.maxZoom
        }).addTo(this.map);

        this.map.on('moveend', function(){
            //TODO : store new coordinates
        });
    };

    return Map;
});