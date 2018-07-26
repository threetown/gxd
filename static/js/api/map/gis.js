dojo.require("esri.map");
dojo.require("esri.layers.ArcGISImageServiceLayer");
dojo.require("esri.geometry.jsonUtils");
dojo.require("esri.toolbars.draw");
dojo.require("esri.tasks.query");
dojo.require("dojo.parser");
dojo.require("esri.Color");
dojo.require("esri.symbols.Font");
dojo.require("esri.graphic");
dojo.require("esri.tasks.geometry");
dojo.require("esri.geometry.Point");
dojo.require("esri.geometry.Circle");
dojo.require("esri.geometry.Polygon");
dojo.require("dijit.dijit");
dojo.require("esri.InfoTemplate");
dojo.require("esri.geometry.Extent");
dojo.require("esri.SpatialReference");
dojo.require("esri.geometry.webMercatorUtils");
var Gis = {};

Gis.Map = $.extend({}, {
    clearAll : function(){
        if(Gis.Map.gxdMap){
            Gis.Map.gxdMap.graphics.clear();
        }
        Gis.Map.clearQueryGraphics();
    },

    clearQueryGraphics : function(){
        if(Gis.Map.gxdMap){
            Gis.Map.gxdMap.infoWindow.hide();
        }
    }

});