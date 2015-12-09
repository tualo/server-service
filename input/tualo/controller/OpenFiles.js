Ext.define('Tualo.controller.OpenFiles', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.openfiles',
  onOpenFilesLoad: function(store,records,state){
    if (state){
      setTimeout(function(){ store.load() }.bind(this),5000);
    }
  }
})
