Ext.define('Tualo.models.OpenFiles', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.openfiles',
  data:{
    record: null
  },
  stores: {
    openfiles: {
      type: 'json',
      autoLoad: true,
      autoSync: false,
      remoteFilter: false,
      pageSize: 500,
      fields: [
        {name: 'id'}
      ],
      listeners:{
        load: 'onOpenFilesLoad'
      },
      proxy: {
        type: 'ajax',
        api: {
          read: '/noaddressfiles'
        },
        reader: {
          type: 'json',
          rootProperty: 'data',
          idProperty: 'id'
        },
        listeners: {
          exception: function(proxy, response, operation){
            /*
            var o,msg;
            try{
              o = Ext.JSON.decode(response.responseText);
              msg = o.msg;
            }catch(e){
              msg = response.responseText;
            }
            Ext.MessageBox.show({
              title: 'Fehler',
              msg: msg,
              icon: Ext.MessageBox.ERROR,
              buttons: Ext.Msg.OK
            });
            */
          }
        }
      }
    }
  }
});
