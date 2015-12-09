Ext.Loader.setPath('Tualo', '/input/tualo');
Ext.onReady(function(){
  Ext.require(['Tualo.views.Main','Tualo.GlyphTool'],function(){
   Application = new Ext.container.Viewport({
     requires: ['Tualo.views.Main'],
     layout: 'fit',
     items: [
       {
         xtype: 'main'
       }
     ]
   });
 });
});
