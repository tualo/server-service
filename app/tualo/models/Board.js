Ext.define('Tualo.models.Board', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.board',
  data:{
    erpdispatcher: false,
    ocrservice: false,
    ocrserviceio: false,
    camera: false,
    offline: true
  }
});
