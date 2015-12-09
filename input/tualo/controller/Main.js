Ext.define('Tualo.controller.Main', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.board',

  services: function(){
    Ext.Ajax.request({
        url: '/services',
        scope: this,
        success: function(response, opts) {
          this.view.getLayout().setActiveItem(0);
          this.view.viewModel.set('offline',false);
        },
        failure: function(response, opts) {
          this.view.viewModel.set('offline',true);
          this.view.getLayout().setActiveItem(1);
          console.log('server-side failure with status code ' + response.status);
        }
    });
  },
  onBoxReady: function(){
    this.services();
    this.interval = setInterval(this.services.bind(this),5000);
  }
})
