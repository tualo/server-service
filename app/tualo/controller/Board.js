Ext.define('Tualo.controller.Board', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.board',
  onChangeService: function(f,nv,ov){
    if (this.suppressChange===false){
      clearInterval(this.interval);
      Ext.Ajax.request({
          url: '/service/'+(nv?'start':'stop')+'/'+f.name,
          scope: this,
          success: function(response, opts) {
            var o = JSON.parse(response.responseText);
            this.view.viewModel.set('state',true);
            if (o.success){

            }
            this.onBoxReady();
          },
          failure: function(response, opts) {
            this.view.viewModel.set('state',false);
            this.onBoxReady();
            console.log('server-side failure with status code ' + response.status);
          }
      });
    }
  },
  services: function(){
    Ext.Ajax.request({
        url: '/services',
        scope: this,
        success: function(response, opts) {
          this.view.getLayout().setActiveItem(0);
          this.view.viewModel.set('offline',false);
          var o = JSON.parse(response.responseText);
          if (o.success){
            this.suppressChange = true;
            this.view.viewModel.set('camera',o.data.camera);
            this.view.viewModel.set('ocrservice',o.data.ocrservice);
            this.view.viewModel.set('erpdispatcher',o.data.erpdispatcher);
            this.suppressChange = false;
          }
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
  },
  onShutdown: function(){
    Ext.MessageBox.confirm('Ausschalten','Möchten Sie den Server wirklich ausschalten?',function(btn){
      if (btn=='yes'){
        Ext.Ajax.request({
            url: '/shutdown',
            success: function(response, opts) {
              Ext.MessageBox.alert('Ausschalten','Der Server wird in einer Minute ausgeschalten');
            },
            failure: function(response, opts) {
              console.log('server-side failure with status code ' + response.status);
            }
        });
      }
    },this);
  }
})
