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
    'text!../../partials/imageOnMap.html',
    //templates
    'text!../../partials/clusterOfImagesOnMap.html'
],function (L, MarkerCluster, HeatCanvas, Mustache, ImageTemplate, ClusterOfImagesTemplate) {
    var Map = function(){
        this.map = null;
        this.maxZoom = 16;
        this.timeoutForImage = 60*1000;
        this.imagesOnMap = {};
    };

    Map.prototype.placeAt = function(domElement){
        this.map = L.map(domElement).setView([40.0, 0.0], 2);
        this.domMap = domElement;

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

        var lastMarker = getNewestMarker(cluster.getAllChildMarkers());
        if(lastMarker.userData == null){
            console.log('there is something wrong.');
            return;
        }

        var lastImageUrl = lastMarker.userData.imageUrl;
        //var lastImageUrl = cluster.getAllChildMarkers()[childCount - 1].options.icon.options.iconUrl;

        var imageInClusterId = lastMarker.userData.imageId + '-in-cluster';
        var loaderId = lastMarker.userData.imageId + '-in-cluster-preloader';

        var userData = {
            imageIn:imageInClusterId,
            imageUrl:lastImageUrl,
            loaderId:loaderId,
            childCount:childCount,
            isLoader:true
        };

        var imageHTML = Mustache.render(ClusterOfImagesTemplate, userData);

        var icon = new L.DivIcon({
            iconAnchor: new L.Point(32, 32),
            iconSize: new L.Point(64, 64),
            className: '',
            //html: '<div"><img style="display: none;" id="' + imageInClusterId + '" src="'+lastImageUrl+'" class="img-polaroid" width="' + 64 + '" height="' + 64 + '"/><span>' + childCount + '</span></div>'
            html: imageHTML
        });

        var time = Date.now();

        var image = new Image();
        image.onload = function(){

            var imageDom = document.getElementById(imageInClusterId);
            var loaderDom = document.getElementById(loaderId);

            if(!!imageDom && !!loaderDom){
                if(Date.now() - time > 100){
                    $(imageDom).fadeIn(function(){
                        if(loaderDom && !!loaderDom.parentNode){
                            loaderDom.parentNode.removeChild(loaderDom);
                        }
                    });
                }else{
                    $(imageDom).show();
                    if(loaderDom && !!loaderDom.parentNode){
                        loaderDom.parentNode.removeChild(loaderDom);
                    }
                }
            }

            userData.isLoader = false;
            icon.options.html = Mustache.render(ClusterOfImagesTemplate, userData);
        }

        image.onerror = function(){
            console.log('onerror');
        }

        image.src = lastImageUrl;
/*
        icon.on('remove', function(){
            console.log('remove!');
        })*/

        return icon;
    }

    function getNewestMarker(markers) {
        var mostNewMarker = null;
        var nistNewPlacedTime = Number.MIN_VALUE;
        for(var index = markers.length - 1; index >= 0; index--){
            var marker = markers[index];
            if(nistNewPlacedTime < marker.userData.placedTime){
                nistNewPlacedTime = marker.userData.placedTime;
                mostNewMarker = marker;
            }
        }

        return mostNewMarker;
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

    Map.prototype.hideImage = function(id){
        var marker = this.imagesOnMap[id];
        if(!marker){
            return;
        }
        removeMarker.call(this, marker);
        delete this.imagesOnMap[id];
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
            loaderIsVisible: true,
            placedTime: Date.now()
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

        this.imagesOnMap[id] = marker;

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
            return;
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
                this.hideImage(marker.userData.imageId);
            }.bind(this), this.timeoutForImage);
        }
    }

    function onLoadErrorImageForMarker(marker){
        removeMarker.call(this, marker);
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