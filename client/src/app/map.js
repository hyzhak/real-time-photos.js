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
        this.timeoutForImage = 60*1000;
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

        var lastMarker = cluster.getAllChildMarkers()[childCount - 1];
        if(lastMarker.userData == null){
            console.log('there is something wrong.');
        }
        var lastImageUrl = lastMarker.userData.imageUrl;
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
        var containerId = 'image-on-map-container-' + id;
        var imageId = 'image-on-map-' + id;
        var loaderId = 'loader-on-map-' + id;

        var userData = {
            imageUrl: imageUrl,
            containerId: containerId,
            imageId: imageId,
            imageIsVisible: false,
            loaderId: loaderId,
            loaderIsVisible: true
        };

        var image = new window.Image();
        image.src = imageUrl;
        image.onload = function(){
            onLoadImageForMarker.call(this, marker);
        }.bind(this);
        image.onerror = function(){
            onLoadErrorImageForMarker.call(this, marker);
        }.bind(this);

        var imageHTML = Mustache.render(ImageTemplate, userData);

        var imageIcon = L.divIcon({
            iconSize: new L.Point(72, 72),
            iconAnchor: new L.Point(32, 32),
            className: '',
            html: imageHTML
        });

        var marker = L.marker([lat, lng], {
            icon: imageIcon,
            imageId: id
        });

        marker.userData = userData;

        this.imagesGroup.addLayer(marker);

        marker.on('click', function(e){
            clickHandler(id);
        });

        this.heatMap.pushData(lat, lng, 100);
        if(this.heatmapIsVisible){
            //Too slow
            this.heatMap._redraw();
        }

        //var popup = marker.bindPopup('<div><a target="_blank" href="' + pageUrl + '"><img src="'+imageUrl+'" width="' + width + '" height="' + height + '"/></a></div>');
        ///popup.openPopup();
    }

    function onLoadImageForMarker(marker){
        var userData = marker.userData;
        if(userData == null){
            console.log('something wrong!');
        }
        userData.loaderIsVisible = false;
        userData.imageIsVisible = true;

        var imageHTML = Mustache.render(ImageTemplate, userData);

        var $image = $(document.getElementById(userData.imageId));
        $image.fadeIn();
        $(document.getElementById(userData.loaderId)).fadeOut();

        refreshMarker.call(this, marker, imageHTML, marker.userData);

        if(this.timeoutForImage > 0){
            setTimeout(function(){
                removeMarker.call(this, marker);
            }.bind(this), this.timeoutForImage);
        }
    }

    function onLoadErrorImageForMarker(marker){
        removeMarker(marker).bind(this);
    }

    function refreshMarker(marker, html, userData){
        var iconOptions = marker.options.icon.options;
        iconOptions.html = html;
        //TODO: better has command - just refresh!
    }

    function removeMarker(marker){
        var userData = marker.userData;
        var $marker = $('#'+userData.containerId);
        if($marker.length){
            $marker.fadeOut('slow', function(){
                this.imagesGroup.removeLayer(marker);
            }.bind(this));
        }else{
            this.imagesGroup.removeLayer(marker);
        }
    }

    return Map;
});