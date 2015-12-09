Ext.define('Tualo.models.Board', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.board',
  data:{
    erpdispatcher: false,
    ocrservice: false,
    ocrserviceui: false,
    camera: false,
    offline: true
  }
});
