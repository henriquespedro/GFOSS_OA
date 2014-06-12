/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Variáveis //
var vectors;
var layerRuler = new OpenLayers.Layer.Vector("Measurements");
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

var styleMap = new OpenLayers.StyleMap({
    strokColor: "#FF0000",
    strokeWidth: 4,
    pointRadius: 20,
    fillOpacity: 0,
    fillColor: "#FF0000"});

vectors = new OpenLayers.Layer.Vector("Desenho", {renderers: renderer});

var googleMercator = new OpenLayers.Projection("EPSG:3857");
var wgs84 = new OpenLayers.Projection("EPSG:4326");
var etrs89 = new OpenLayers.Projection("EPSG:3763");

var mapOptions = {maxExtent: new OpenLayers.LonLat(216.06429, 2913.66811), projection: googleMercator, units: 'm'};

var map = new OpenLayers.Map(mapOptions);

/**
 * 
 * @type GeoExt.MapPanel
 */
var mapPanel = new GeoExt.MapPanel({
    map: map,
    id: 'mapPanel',
    stateId: 'maparea'
});

var LayersStore = [{layer: 'sig:fc_ocorrencias', label: 'Ocorrências Ambientais', visible: true, group: 'Ocorrências Ambientais'},
    {layer: 'sig:zpe', label: 'ZPE', visible: true, group: 'Ocorrências Ambientais'}];

var length = LayersStore.length;
for (var i = 0; i < length; i++) {
    map.addLayer(new OpenLayers.Layer.WMS(LayersStore[i].label, "http://localhost:8080/geoserver/wms", {
        layers: LayersStore[i].layer,
        format: "image/png",
        transparent: true,
        srs: 'EPSG:3857'
    }, {
        isBaseLayer: false,
        visibility: LayersStore[i].visible,
        group: LayersStore[i].group,
        minScale: LayersStore[i].minscale,
        isWMS: true
    }));

}
var OSM = new OpenLayers.Layer.OSM("Simple OSM Map");

var satellitegoogle = new OpenLayers.Layer.Google("Google Satellite",
        {type: google.maps.MapTypeId.SATELLITE, animationEnabled: true}
);

map.addLayers([OSM, satellitegoogle, vectors]);

map.setCenter(new OpenLayers.LonLat(216.06429, 2913.66811), 7);

