Gis.Map.Draw = $.extend({}, {

    init : function(){
        Gis.Map.Draw.drawTool = new esri.toolbars.Draw(Gis.Map.gxdMap);
        Gis.Map.Event.onMapDrawEndHandler = dojo.connect(Gis.Map.Draw.drawTool,"onDrawEnd",Gis.Map.Event.mapDrawEnd);
    },

    clearDraw : function(){
        if(Gis.Map.Draw.drawTool){
            Gis.Map.Draw.drawTool.deactivate();
        }
        dojo.disconnect(Gis.Map.Event.onMapClickHandler);
        Gis.Map.Event.onMapClickHandler = null;
    }

});