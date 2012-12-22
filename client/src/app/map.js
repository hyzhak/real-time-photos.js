/**
 * Project: .
 * Copyright (c) 2012, Eugene-Krevenets
 */
define([
    //'http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js', //CDN
    'leaflet',
    'libs/leaflet.markercluster/leaflet.markercluster-src',
    'libs/leaflet.heatcanvas/heatcanvas-leaflet',

    'mustache',

    //templates
    'text!/../partials/imageOnMap.html'
],function (L, MarkerCluster, HeatCanvas, Mustache, ImageTemplate) {
    var Map = function(){
        this.map = null;
        this.maxZoom = 16;
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

        //switch optional
        this.heatMap = new L.TileLayer.HeatCanvas();
        //this.heatMap.onAdd(this.map);

        this.map.on('moveend', function(){
            //TODO : store new coordinates
        });
    };

    Map.prototype.setVisibleHeatMap = function(value){
        if(this.heatmapIsVisible == value){
            return;
        }

        this.heatmapIsVisible = value;

        if(value){
            this.heatMap.onAdd(this.map);
        }else{
            this.heatMap.onRemove(this.map);
            this._redraw();
        }
    }

    Map.prototype.setVisibleImages = function(value){
        if(value){
            //this.imagesGroup.addTo(this.map);
            this.imagesGroup.setOpacity(1)
        }else{
            this.imagesGroup.onRemove(this.map);
            this.map.removeLayer(this.imagesGroup);
            this.imagesGroup.redraw();
//            this.imagesGroup.removeFrom(this.map);
            //this.imagesGroup.setOpacity(0);
        }
    }

    function onCreateCluster(cluster){
        //return new L.DivIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
        var childCount = cluster.getChildCount();

        var lastImageUrl = cluster.getAllChildMarkers()[childCount - 1].options.icon.imageUrl;
        //var lastImageUrl = cluster.getAllChildMarkers()[childCount - 1].options.icon.options.iconUrl;

        return new L.DivIcon({
            iconAnchor: new L.Point(32, 32),
            iconSize: new L.Point(64, 64),
            className: '',
            html: '<div"><img src="'+lastImageUrl+'" class="img-polaroid" width="' + 64 + '" height="' + 64 + '"/><span>' + childCount + '</span></div>'
        });
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

    Map.prototype.clearAllImages = function(){
        this.imagesGroup.clearLayers();
        this.heatMap.heatmap.clear();
        this.heatMap.data = [];
    }

    Map.prototype.placeImage = function(lat, lng, width, height, imageUrl, pageUrl, caption, id, clickHandler){
        /*
        var imageIcon = L.icon({
            iconUrl: imageUrl,
            //shadowUrl: 'leaf-shadow.png',

            iconSize:     [64, 64], // size of the icon
            //shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
            //shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [32, 0] // point from which the popup should open relative to the iconAnchor
        });
        var imageIcon = L.DivIcon({
            iconSize: new L.Point(64, 64),
            html: '<img width="64" height="64" src="' + imageUrl + '"/>'
        });
        */
        var imageHTML = Mustache.render(ImageTemplate, {
            imageUrl:imageUrl
        });
        var imageIcon = L.divIcon({
            iconSize: new L.Point(72, 72),
            iconAnchor: new L.Point(32, 32),
            className: '',
            //html: '<div><img width="64" height="64" class="img-polaroid" src="' + imageUrl + '"/></div>'
//            html: '<div class="img-polaroid"><div class="imageContainer"><div class="image" style=";background-image:url(' + imageUrl + ')"></div><div class="imgIndicator"><div class="spinner spinnerAnimation">loading</div></div></div></div>'
            html: imageHTML
        });

        imageIcon.imageUrl = imageUrl;

        var marker = L.marker([lat, lng], {
            icon: imageIcon,
            imageId: id
        });
        this.imagesGroup.addLayer(marker);

        marker.on('click', function(e){
            clickHandler(e.layer.options.imageId);
        });

        this.heatMap.pushData(lat, lng, 100);
        if(this.heatmapIsVisible){
            //Too slow
            this.heatMap._redraw();
        }

        //var popup = marker.bindPopup('<div><a target="_blank" href="' + pageUrl + '"><img src="'+imageUrl+'" width="' + width + '" height="' + height + '"/></a></div>');
        ///popup.openPopup();
    }

    return Map;
});