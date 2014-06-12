/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.QuickTips.init();
var ctrl, toolbarItems = [], action, actions = {};
var infocontrol, popup;
var store;
var initualepsg;
var transform;
//OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
OpenLayers.ProxyHost = "proxy/proxy.php?url=";
map.addControl(new OpenLayers.Control.MousePosition({
    "div": OpenLayers.Util.getElement("ddcoords"),
    displayProjection: new OpenLayers.Projection("EPSG:3763")
}));

/**
 * @type OpenLayers.Control.ZoomToMaxExtent()
 */
action = new GeoExt.Action({
    control: new OpenLayers.Control.ZoomToMaxExtent(),
    map: map,
    cls: 'menus',
    icon: 'img/world.png',
    iconAlign: 'top',
    scale: 'medium',
//    scale: 'small',
    text: 'Extensão<br>Total',
    tooltip: 'Zoom para a Vista Inicial'
});
toolbarItems.push(action);
/**
 * @type OpenLayers.Control.Navigation()
 */
action = new GeoExt.Action({
    control: new OpenLayers.Control.Navigation(),
    map: map,
    tooltip: 'Mover mapa',
    icon: 'img/pan_i.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Arrastar<br>Mapa',
    allowDepress: true,
    toggleGroup: 'draw',
    group: 'nav'});
toolbarItems.push(action);
/**
 * @type OpenLayers.Control.ZoomBox({out: false})
 */
action = new GeoExt.Action({
    control: new OpenLayers.Control.ZoomBox({out: false}),
    map: map,
    tooltip: 'Aproximar mapa',
    icon: 'img/zoom-in.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Aproximar<br>Mapa',
    allowDepress: true,
    toggleGroup: 'draw',
    group: 'nav'});
toolbarItems.push(action);
/**
 * @type OpenLayers.Control.ZoomBox({out: true})
 */
action = new GeoExt.Action({
    control: new OpenLayers.Control.ZoomBox({out: true}),
    map: map,
    tooltip: 'Afastar mapa',
    icon: 'img/zoom-out.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Afastar<br>Mapa',
    allowDepress: true,
    toggleGroup: 'draw',
    group: 'nav'});
toolbarItems.push(action);
// Navigation history - two "button" controls
ctrl = new OpenLayers.Control.NavigationHistory();
map.addControl(ctrl);
/**
 * @type GeoExt.Action.previous
 */
action = new GeoExt.Action({
    control: ctrl.previous,
    disabled: true,
    icon: 'img/anterior.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Vista<br>Anterior',
    tooltip: 'Vista Anterior'
});
toolbarItems.push(action);
/**
 * @type GeoExt.Action.next
 */
action = new GeoExt.Action({
    icon: 'img/seguinte.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Vista<br>Seguinte',
    control: ctrl.next,
    disabled: true,
    tooltip: 'Vista Seguinte'
});
toolbarItems.push(action);
toolbarItems.push("-");
/**
 * @description Obter Coordenadas
 */
var markers = null;
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },
    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
                );
        OpenLayers.Control.prototype.initialize.apply(
                this, arguments
                );
        this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
                );
    },
    trigger: function(e) {
        var lonlat = map.getLonLatFromPixel(e.xy);
        var icon = new OpenLayers.Icon('img/map-marker.png');
        var lonLat = new OpenLayers.LonLat(lonlat.lon, lonlat.lat);
        initualepsg = 'EPSG:3857';
        if (markers == null) {
            markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);
        }
        else {
            getcoordinate.close();
        }

        markers.clearMarkers();
        var marker = new OpenLayers.Marker(lonLat, icon);
        markers.addMarker(marker);



        var GetCoordinatesStore = {
            xtype: 'fieldset',
            defaults: {xtype: 'textfield'}, // the default type of the field
            items: [
                {
                    xtype: 'combo',
                    id: 'tranformcoordinates',
                    fieldLabel: 'Sistema de Coordenadas',
                    store: new Ext.data.SimpleStore({
                        data: [
                            ['4326', 'WGS84'],
                            ['3763', 'ETRS89 / Portugal TM06'],
                            ['27493', 'Datum73 Hayford Gauss IPCC']
                        ],
                        id: 0,
                        fields: ['value', 'projection']
                    }),
                    value: 'ETRS89 / Portugal TM06',
                    valueField: 'value',
                    displayField: 'projection',
                    mode: 'local',
                    triggerAction: 'all',
                    anchor: '100%',
                    listeners: {
                        select: function(combo, record, index) {
                            var valueepsg = 'EPSG:' + combo.getValue();
                            transform = lonLat.transform(
                                    new OpenLayers.Projection(initualepsg), // transform from ETRS89
                                    new OpenLayers.Projection(valueepsg) // to Choose Coordinates
                                    );
                            initualepsg = valueepsg;
                            Ext.getCmp('GetCoordenadaX').setValue(transform.lon);
                            Ext.getCmp('GetCoordenadaY').setValue(transform.lat);
                        }
                    }
                },
                {
                    fieldLabel: 'X',
                    id: 'GetCoordenadaX',
                    value: lonlat.lon,
                    anchor: '100%',
                    readOnly: true
                }, {
                    fieldLabel: 'Y',
                    id: 'GetCoordenadaY',
                    value: lonlat.lat,
                    anchor: '100%',
                    readOnly: true
                }]
        };
        var GetCoordinatesForm = new Ext.FormPanel({
            frame: true,
            items: [],
            renderTo: Ext.getBody()
        });
        GetCoordinatesForm.add(GetCoordinatesStore);
        GetCoordinatesForm.doLayout();
        getcoordinate = new Ext.Window({
            title: 'Obter Coordenadas',
            height: 200,
            width: 350,
            items: [GetCoordinatesForm]}).show();
    }
});
var click = new OpenLayers.Control.Click();


action = new Ext.Button({
    tooltip: 'Obter Coordenadas',
    icon: 'img/location_orange.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Obter<br>Coordenadas',
    map: map,
    allowDepress: true,
    toggleGroup: 'coordenadas',
    handler: function() {
        map.addControl(click);
        click.activate();
    }
});
toolbarItems.push(action);
/**
 * @description Localizar Coordenadas
 */
action = new Ext.Button({
    tooltip: 'Localizar Coordenadas',
    icon: 'img/location_red.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Localizar<br>Coordenadas',
    map: map,
    handler: function() {
        winCoordinates = new Ext.Window({
            title: "Localizar Coordenadas",
            closeAction: 'hide',
            resizable: true,
            closable: true,
            layout: "fit",
            items: [FindCoordinates]
        }).show();
    }
});
toolbarItems.push(action);
toolbarItems.push("-");
/**
 * @description Ferramenta de Localização de Coordenadas
 * @type Ext.FormPanel
 */
var FindCoordinates = new Ext.FormPanel({
    labelWidth: 75,
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    height: 100,
    width: 250,
    itemId: 'seachcoordinates',
    defaultType: 'textfield',
    items: [{
            fieldLabel: 'X',
            id: 'CoordenadaX',
            anchor: '100%'
        }, {
            fieldLabel: 'Y',
            id: 'CoordenadaY',
            anchor: '100%'
        }],
    buttons: [{
            text: 'Localizar',
            handler: function() {
                var icon = new OpenLayers.Icon('img/map-marker.png');
                var lonLat = new OpenLayers.LonLat(Ext.get('CoordenadaX').dom.value, Ext.get('CoordenadaY').dom.value);

                if (markers == null) {
                    markers = new OpenLayers.Layer.Markers("Markers");
                    map.addLayer(markers);
                }

                markers.clearMarkers();
                var marker = new OpenLayers.Marker(lonLat, icon);
                markers.addMarker(marker);

                map.setCenter(lonLat, 10);
                winCoordinates.hide();
            }
        }]
});

map.addControls([
    new OpenLayers.Control.KeyboardDefaults(),
    new OpenLayers.Control.ScaleLine(),
    new OpenLayers.Control.OverviewMap()
]);

action = new GeoExt.Action({
    control: new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.Point),
    map: map,
    tooltip: 'Desenhar Ponto',
    icon: 'img/ponto.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Desenhar<br>Ponto',
    allowDepress: true,
    toggleGroup: 'draw',
    group: 'desenho'});
toolbarItems.push(action);

action = new GeoExt.Action({
    control: new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.Path),
    map: map,
    tooltip: 'Desenhar Linha',
    icon: 'img/linha.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Desenhar<br>Linha',
    allowDepress: true,
    toggleGroup: 'draw',
    group: 'desenho'
});
toolbarItems.push(action);

action = new GeoExt.Action({
    control: new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.Polygon),
    map: map,
    tooltip: 'Desenhar Polígono',
    icon: 'img/poligono.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Desenhar<br>Polígono',
    allowDepress: true,
    toggleGroup: 'draw',
    group: 'desenho'});
toolbarItems.push(action);


//Delete All Redlines
action = new GeoExt.Action({
    icon: 'img/cross.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Apagar<br>Desenhos',
    tooltip: 'Apagar Desenhos',
    map: map,
    handler: function() {
        Ext.Msg.show({
            title: 'Apagar desenhos?',
            msg: 'Tem a certeza que pretende apagar todos os desenhos?',
            buttons: {
                yes: true,
                no: true
            },
            icon: 'milton-icon',
            fn: function(btn) {
                if (btn == 'yes')
                {
                    vectors.removeAllFeatures();
                }
            }
        });
    }
});
toolbarItems.push(action);
toolbarItems.push("-");

/**
 * @description Ferramenta de Medição - Cálculo de Distância
 * @type OpenLayers.Control.Measure
 */

var measureControls = {
    line: new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Path),
    polygon: new OpenLayers.Control.DynamicMeasure(OpenLayers.Handler.Polygon)
};
map.addControls([
    measureControls.line,
    measureControls.polygon,
    new OpenLayers.Control.LayerSwitcher()
]);

var measureLength = new GeoExt.Action({
    control: measureControls.line,
    map: map,
    icon: 'img/c_distancia.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Calcular<br>Distância',
    tooltip: 'Medir Distâncias',
    toggleGroup: "draw",
    pressed: false,
    allowDepress: true,
    handler: function() {
        var control = measureControls.line;
        control.typelabel = "Perimetro";
    }
});
toolbarItems.push(measureLength);

var measureArea = new GeoExt.Action({
    tooltip: "Medir Área",
    icon: 'img/c_area.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Calcular<br>Área',
    toggleGroup: "draw",
    pressed: false,
    allowDepress: true,
    control: measureControls.polygon,
    map: map,
    handler: function() {
        var control = measureControls.polygon;
        control.typelabel = "Perimetro";
        //var element = document.getElementById("output");
        //element.innerHTML = "";
        //layerRuler.removeFeatures(layerRuler.features);
    }
});
toolbarItems.push(measureArea);


action = new GeoExt.Action({
    tooltip: "Ver Vista de Estradas (Google)",
    icon: 'img/ferramentas/street_view.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Vista de<br>Estradas',
    map: map,
    handler: function() {
        map.addControl(clickStreetView);
        clickStreetView.activate();
    }
});
toolbarItems.push(action);
toolbarItems.push("-");

OpenLayers.Control.clickStreetView = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },
    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
                );
        OpenLayers.Control.prototype.initialize.apply(
                this, arguments
                );
        this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
                );
    },
    trigger: function(e) {

        var projto = new OpenLayers.Projection('EPSG:4326');
        var newLonLat = map.getLonLatFromPixel(e.xy).transform(map.getProjectionObject(), projto);
        url = 'php/streetview.php?long=' + newLonLat.lon + '&lat=' + newLonLat.lat;
        window.open(url, '_blank');
        clickStreetView.deactivate();
    }
});
var clickStreetView = new OpenLayers.Control.clickStreetView();

/**
 * @type Ext.form.Label
 */
action = new Ext.form.Label({
    text: 'Escala: '
});
toolbarItems.push(action);
/**
 * @type GeoExt.data.ScaleStore
 */

var scaleStore = new GeoExt.data.ScaleStore({map: map});
var scaleCombo = new Ext.form.ComboBox({
    store: scaleStore,
    emptyText: "Escala",
    width: 100,
    tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
    editable: false,
    triggerAction: 'all',
    mode: 'local'
});
scaleCombo.on('select',
        function(combo, record, index) {
            map.zoomTo(record.data.level);
        },
        this
        );
map.events.register('zoomend', this, function() {
    var scale = scaleStore.queryBy(function(record) {
        return this.map.getZoom() == record.data.level;
    });
    if (scale.length > 0) {
        scale = scale.items[0];
        scaleCombo.setValue("1 : " + parseInt(scale.data.scale));
    } else {
        if (!scaleCombo.rendered)
            return;
        scaleCombo.clearValue();
    }
});
toolbarItems.push(scaleCombo);
toolbarItems.push("-");


var searchOcorrenciasForm = new Ext.Button({
    ID: 'searchProcessosFormID',
    icon: 'img/find.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Pesquisa por<br>Ocorrência',
    tooltip: 'Pesquisa por Ocorrência Ambiental',
    visible: false,
    handler: function() {
        winOA = new Ext.Window({
            title: "Pesquisa por Ocorrência Ambiental",
            layout: "fit",
            closeAction: 'hide',
            resizable: true,
            closable: true,
            items: [SearchOA]
        });
        winOA.show();
    }
});
toolbarItems.push(searchOcorrenciasForm);

var SearchOA = new Ext.FormPanel({
    labelWidth: 75,
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    height: 160,
    width: 400,
    items: {layout: 'form',
        defaults: {width: 230},
        defaultType: 'textfield',
        items: [{
                fieldLabel: 'Nº Ocorrência',
                name: 'processo',
                anchor: '100%',
                allowBlank: false,
                id: 'processo'
            }]
        ,
        buttons: [{
                text: 'Fechar',
                handler: function() {
                    winOA.hide();
                    SearchOA.getForm().reset();
                }
            }, {
                text: 'Pesquisar',
                handler: function() {
                    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                        xmlhttp = new XMLHttpRequest();
                    } else {// code for IE6, IE5
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    var proc = Ext.getCmp('processo');
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                        {
                            parsedJSON = eval("(" + xmlhttp.responseText + ")");
                            if (parsedJSON.length === 0) {
                                alert("Sem Resultados");
                            }
                            else {
                                var bounds = OpenLayers.Bounds.fromString(parsedJSON[0]);
                                map.zoomToExtent(bounds);
                                SearchOA.getForm().reset();
                            }
                        }
                    }
                    xmlhttp.open("GET", "php/pesquisas.php?type=processobbox&desc=" + proc.getValue(), true);
                    xmlhttp.send();
                }
            }]
    }
});
