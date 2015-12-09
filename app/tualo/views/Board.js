Ext.define('Tualo.views.Board', {
  extend: 'Ext.panel.Panel',
  xtype: 'board',
  requires: [
    'Tualo.views.OpenFiles',
    'Tualo.models.Board',
    'Tualo.controller.Board'
  ],
  layout: 'card',
  listeners: {
    boxReady: 'onBoxReady'
  },
  controller: 'board',

  viewModel: {
      type: 'board'
  },

  title: 'OCR Maschine',
  items: [
    {
      xtype: 'panel',
      //width: 500,
      //height: 600,
      layout: 'border',
      items: [

        {
          xtype: 'form',
          split: true,
          items:[
            {
              xtype: 'checkbox',
              fieldLabel: 'Kamera',
              name: 'grab-service',
              bind: '{camera}',
              listeners: {
                change: 'onChangeService'
              }
            },
            {
              xtype: 'checkbox',
              fieldLabel: 'OCR-Service',
              name: 'ocrservice-bcocr',
              bind: '{ocrservicebcocr}',
              listeners: {
                change: 'onChangeService'
              }
            },
            {
              xtype: 'checkbox',
              fieldLabel: 'UI-Service',
              name: 'ocrservice-io',
              bind: '{ocrserviceio}',
              listeners: {
                change: 'onChangeService'
              }
            },
            {
              xtype: 'checkbox',
              fieldLabel: 'ERP-Dispatcher',
              name: 'erp-dispatcher',
              bind: '{erpdispatcher}',
              listeners: {
                change: 'onChangeService'
              }
            }
          ],
          platformConfig: {
              desktop: {
              region: 'west',
              bodyPadding: 25
            },
            '!desktop':{
              region: 'center',
              bodyPadding: 35
            }
          }
        },

        {
          xtype: 'openfiles',
          platformConfig: {
            desktop: {
              region: 'center'
            },
            '!desktop': {
              region: 'south',
              split: true,
              height: 250
            }
          }
        }

      ]
    },
    {
      xtype: 'panel',
      html: '<div style="height: 100%; background-color: #fccccc; text-align: center; vertical-align:middle; font-size: 1.5em;"><br/><br/><br/>Der Dienst ist nicht verfügbar</div>'
    }
  ],
  tools: [
    {
      xtype: 'glyphtool',
      text: 'Shutdown',
      glyph: 'power-off',
      handler: 'onShutdown',
      bind: {
        hidden: '{offline}'
      }
    }
  ]
});
