/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    //'http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js', //CDN
    'libs/leaflet/leaflet-src', //CDN
    'libs/leaflet.markercluster/leaflet.markercluster-src'
],function (L, MarkerCluster) {
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

        var clusterGroup = new L.MarkerClusterGroup({
            iconCreateFunction:  onCreateCluster,
            animateAddingMarkers: true
        });

        this.imagesGroup = clusterGroup.addTo(this.map);

        this.map.on('moveend', function(){
            //TODO : store new coordinates
        });
    };

    function onCreateCluster(cluster){
        //return new L.DivIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
        var childCount = cluster.getChildCount();

        var imageUrl = cluster.getAllChildMarkers()[0].options.icon.options.iconUrl;

        return new L.DivIcon({ html: '<div"><img src="'+imageUrl+'" width="' + 64 + '" height="' + 64 + '"/><span>' + childCount + '</span></div>'
            , iconSize: new L.Point(64, 64) });
    }

    function onCreateClusterOrg(cluster) {
        var childCount = cluster.getChildCount();
        var c = ' marker-cluster-';
        if (childCount < 10) {
            c += 'small';
        } else if (childCount < 100) {
            c += 'medium';
        } else {
            c += 'large';
        }

        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
    }

    Map.prototype.placeImage = function(lat, lng, width, height, imageUrl, pageUrl, caption){
        var imageIcon = L.icon({
            iconUrl: imageUrl,
            //shadowUrl: 'leaf-shadow.png',

            iconSize:     [64, 64], // size of the icon
            //shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
            //shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [32, 0] // point from which the popup should open relative to the iconAnchor
        });

        var marker = L.marker([lat, lng], {icon: imageIcon});
        this.imagesGroup.addLayer(marker);

        //var popup = marker.bindPopup('<div><a target="_blank" href="' + pageUrl + '"><img src="'+imageUrl+'" width="' + width + '" height="' + height + '"/></a></div>');
        ///popup.openPopup();
    }

    return Map;
});