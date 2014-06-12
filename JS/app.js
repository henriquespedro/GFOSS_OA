/*global Ext:false */
var opacitySlider;
Ext.onReady(function() {
    Ext.QuickTips.init();


    var treetable = new GeoExt.ux.tree.LayerTreeBuilder({
        id: "tree",
        border: false,
        autoScroll: true,
        enableDD: true,
        rootVisible: false,
        lines: false,
        wmsLegendNodes: false,
        vectorLegendNodes: true
    });

    new Ext.Viewport({
        layout: 'border',
        items: [{
                id: 'NavPanel',
                xtype: 'tabpanel',
                region: 'north',
                hidden: false,
                collapsible: false,
                margins: '0 0 0 0',
                activeTab: 0,
                items: [{
                        title: 'Ferramentas de Navegação do Mapa',
                        bbar: toolbarItems
                    }]
            }, {
                id: 'TabPanel',
                xtype: 'tabpanel',
                region: 'west',
                title: 'Tabela de Conteudos',
                collapsible: true,
                collapsed: false,
                width: "20%",
                activeTab: 0,
                items: [treetable]
            }, {
                collapsible: false,
                region: 'center',
                layout: 'fit',
                closable: false,
                resizable: false,
                id: "mappanel",
                items: [mapPanel]
            }]
    });
});
