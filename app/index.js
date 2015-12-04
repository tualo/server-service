Ext.Loader.setPath('Tualo', './app/tualo');
Ext.onReady(function(){
  Ext.require(['Tualo.views.Board','Tualo.GlyphTool'],function(){
   Application = new Ext.container.Viewport({
     requires: ['Tualo.views.Board'],
     layout: 'fit',
     items: [
       {
         xtype: 'board'
       }
     ]
   });
 });
});
