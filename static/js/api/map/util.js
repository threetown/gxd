Gis.Util = $.extend({}, {

    JsonToGeometry: function(wkt){
        var geometry = null;
        try {
            var primitive;
            for(var i=0;i<5;i++){
                try {
                    primitive = Terraformer.WKT.parse(wkt);
                    break;
                } catch (err) {
                    continue;
                }
            }
            var arcgis = Terraformer.ArcGIS.convert(primitive,{sr:Gis.Map.gxdMap.spatialReference.wkid});
            geometry = esri.geometry.fromJson(arcgis);
         } catch (err) {
             geometry = null;
        }
        return geometry;
    },
    GeometryToJson: function(geometry){
        geometry.setSpatialReference(new esri.SpatialReference({ wkid: Gis.Map.gxdMap.spatialReference.wkid }));
        var str = Terraformer.ArcGIS.parse(geometry);
        var geoTextPy = Terraformer.WKT.convert(str);
        return geoTextPy;
    }

});
