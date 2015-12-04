Ext.define('Tualo.views.OpenFiles', {
  extend: 'Ext.grid.Panel',
  xtype: 'openfiles',
  requires: [
    'Tualo.models.OpenFiles',
    'Tualo.controller.OpenFiles'
  ],
  listeners: {
    //boxReady: 'onBoxReady'
  },
  controller: 'openfiles',
  viewModel: {
      type: 'openfiles'
  },
  title: 'offene Dateien',
  bind: {
    store: '{openfiles}'
  },
  columns: [
    {
      header: 'Dateiname',
      dataIndex: 'id',
      flex: 1
    }
  ]
});
