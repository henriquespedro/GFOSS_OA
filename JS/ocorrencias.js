/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.QuickTips.init();

var saveStrategy = new OpenLayers.Strategy.Save({auto: true});

var problemasambientais = new OpenLayers.Layer.Vector(
        "Registo de Ocorrências");

var window_ocorrencias;
function lineAdded(feature) {

    var thegeom = '';
    Ext.getCmp('nproc1').destroy();
    formocorrencias.add([{xtype: 'textfield', name: 'thegeom', id: 'nproc1', hidden: true}]);
    var thegeom = feature.geometry.toString();

    Ext.getCmp('nproc1').setValue(thegeom);

    Ext.getCmp('nome');
    drawControlOcorrencias.deactivate();
    window_ocorrencias = new Ext.Window({
        id: "form",
        closeAction: 'hide',
        resizable: true,
        closable: true,
        layout: 'fit',
        activeItem: 0,
        width: screen.width * 0.35,
        height: screen.height * 0.52,
        title: 'Registo de Ocorrências Ambientais',
        items: [formocorrencias]
    });

    window_ocorrencias.show();
}
;
var SinglePoint;


var drawControlOcorrencias = new OpenLayers.Control.DrawFeature(
        problemasambientais, OpenLayers.Handler.Point
        , {displayClass: 'olControlPoint', 'featureAdded': lineAdded}

);

map.addControl(drawControlOcorrencias);

var registar_ocorrencias = new GeoExt.Action({
    icon: 'img/ocorrencias/ocorrencias.png',
    iconAlign: 'top',
    scale: 'medium',
    text: 'Registo de<br>Ocorrências',
    tooltip: "Identificar uma Ocorrência Ambiental",
    handler: function() {
        map.addControl(drawControlOcorrencias);
        drawControlOcorrencias.activate();
    }
});

toolbarItems.push(registar_ocorrencias);
toolbarItems.push('-');

var categoria_ocorrencia = [
    ['Conservação da Natureza'],
    ['Recursos Hídricos'],
    ['Resíduos'],
    ['Ordenamento do Território'],
    ['Deslizamentos de Terras e Queda de Blocos'],
    ['Outros']
]

var categoria_store = new Ext.data.SimpleStore({
    fields: ['categoria'],
    data: categoria_ocorrencia});

formocorrencias = new Ext.FormPanel({
    bodyStyle: "padding: 10px;",
    buttonAlign: 'center',
    frame: true,
    method: 'post',
    autoScroll: true,
    url: 'php/ocorrencias/registo.php',
    x: 500,
    y: 90,
    autoWidth: true,
    width: screen.width * 0.35,
    height: screen.height * 0.55,
    fileUpload: true,
    items: [{
            xtype: 'label',
            cls: 'titulo',
            html: '<b style="font-family:tahoma;font-size:21px;font-variant:small-caps;">Ocorrências Ambientais em Portugal<br/></b>'
        }, {
            xtype: 'label',
            cls: 'contactos',
            html: '<b style="font-family:tahoma;font-size:13px;">-Identificação do Requerente<br/>   <br/> </b>'
        }, {
            xtype: 'textfield',
            name: 'thegeom',
            id: 'nproc1',
            hidden: false
        }, {
            xtype: 'textfield',
            fieldLabel: 'Nome Requerente',
            name: 'nome_requerente',
            id: 'nome_requerente',
            allowBlank: false,
            emptyText: 'Campo obrigatório',
            blankText: 'Campo obrigatório',
            anchor: '100%'
        }, {
            xtype: 'textfield',
            fieldLabel: 'E-mail',
            allowBlank: false,
            emptyText: 'Campo obrigatório',
            blankText: 'Campo obrigatório',
            id: 'email_requerente',
            name: 'email_requerente',
            regex: /^([\w\-\'\-]+)(\.[\w-\'\-]+)*@([\w\-]+\.){1,5}([A-Za-z]){2,4}$/,
            regexText: 'erro: o email deverá ser do tipo mail@xpto.pt',
            anchor: '100%'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Contacto',
            id: 'contacto',
            name: 'contacto',
            anchor: '100%'
        }, {
            xtype: 'label',
            html: '<b style="font-family:tahoma;font-size:13px;padding-bottom:7px;"><br/>-Caracterização da Ocorrência Ambiental<br/>   <br/> </b>'
        }, {
            xtype: 'combo',
            store: categoria_store,
            displayField: 'categoria',
            id: 'categoria_ocorrencia',
            name: 'categoria_ocorrencia',
            valueField: 'categoria',
            editable: false,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            fieldLabel: 'Categoria da Ocorrência',
            emptyText: 'Seleccione a Categoria da Ocorrência...',
            selectOnFocus: true,
            anchor: '100%',
        }, {
            xtype: 'textarea',
            fieldLabel: 'Descrição',
            allowBlank: false,
            emptyText: 'Campo obrigatório',
            blankText: 'Campo obrigatório',
            name: 'descricao_ocorrencia',
            id: 'descricao_ocorrencia',
            anchor: '100% 20%'
        }
    ],
    buttons:
            [{text: 'Submeter pedido',
                    handler: function()
                    {
                        formocorrencias.getForm().submit
                                ({
                                    waitMsg: 'A submeter formulário',
                                    success: function(form, action) {
                                        Ext.Msg.show({
                                            title: 'Registo de Ocorrências Ambientais',
                                            shadow: 'hide',
                                            msg: 'Obrigado pela Colaboração! Em breve será contactado pelos serviços técnicos.',
                                            buttons: Ext.Msg.OK,
                                            width: screen.width * 0.2,
                                            height: screen.height * 0.04,
                                            fn: function()
                                            {
                                                window.location.reload();
                                            }
                                        });
                                    },
                                    failure: function(form, action) {
                                        Ext.Msg.show({
                                            //cls: 'aviso',
                                            title: 'Registo de Ocorrências Ambientais',
                                            shadow: 'hide',
                                            msg: 'Erro ao submeter o registo!',
                                            buttons: Ext.Msg.OK,
                                            width: screen.width * 0.2,
                                            height: screen.height * 0.04
                                        });
                                    }
                                })
                    }},
                {text: 'Cancelar',
                    handler: function() {
                        for (var i = 0; i < map.layers.length; i++) {
                            if (map.layers[i].isVector) {
                                map.layers[i].removeAllFeatures();
                                map.layers[i].refresh({force: true});
                                map.layers[i].redraw(true);
                            }
                        }
                        formocorrencias.getForm().reset();
                        window_ocorrencias.hide();

                    }
                }]

});
var screen_height = screen.height;
var screen_width = screen.width;



