Gis.Map.Oper = $.extend({}, {

    openMapClick : function(){
        Gis.Map.Event.onMapClickHandler=dojo.connect(Gis.Map.gxdMap,"onClick",Gis.Map.Event.mapClick);
    },

    openMapDraw : function(type){
        Gis.Map.Draw.drawTool.activate(type);
    },

    locationPoint : function(gp,type){
        Gis.Show.showInfoWindow(gp,type);
        var loc = GPS.gcj_encrypt(gp.lat, gp.lng);
        if(Gis.Map.mapType==7){
            var buffer = (21-Gis.Map.AMap.getZoom())*0.00002;
            Gis.Map.AMap.setBounds(new AMap.Bounds(new AMap.LngLat(loc.lon-buffer,loc.lat-buffer),
                new AMap.LngLat(loc.lon+buffer,loc.lat+buffer)));
        }else if(Gis.Map.mapType==6){
            loc = GPS.bd_encrypt(loc.lat, loc.lon);
            var buffer = (22-Gis.Map.BMap.getZoom())*0.00002;
            Gis.Map.BMap.setViewport([new BMap.Point(loc.lon-buffer,loc.lat-buffer),
                      new BMap.Point(loc.lon+buffer,loc.lat-buffer),
                      new BMap.Point(loc.lon+buffer,loc.lat+buffer),
                      new BMap.Point(loc.lon-buffer,loc.lat+buffer),
                      new BMap.Point(loc.lon-buffer,loc.lat-buffer)]);
        }else{
            loc = GPS.mercator_encrypt(gp.lat, gp.lng);
            var buffer = (21-Gis.Map.gxdMap.getZoom())*100;
            var et =new esri.geometry.Extent({
                xmin:loc.lon-buffer,
                ymin:loc.lat-buffer,
                xmax:loc.lon+buffer,
                ymax:loc.lat+buffer,
                spatialReference:Gis.Map.gxdMap.spatialReference
            });
            Gis.Map.gxdMap.setExtent(et);
        }
    },

    selectedQueryGraphic : function(index,reIndex,type){
        for(var i=0;i<Gis.Map.queryGraphics.length;i++){
            var gp = Gis.Map.queryGraphics[i];
            if(index==gp.index){
                gp.iFSelect = true;
                Gis.Map.Oper.updateQueryGraphic(gp,type);
                Gis.Map.Oper.locationPoint(gp,type);
            }
            if(reIndex==gp.index){
                gp.iFSelect = false;
                Gis.Map.Oper.updateQueryGraphic(gp,type);
            }
        }
    },

    updateQueryGraphic : function(gp,type){
    	if(Gis.Map.mapType==7){
    	    var overlays = Gis.Map.AMap.getAllOverlays("marker");
    		for(var i=0;i<overlays.length;i++){
    			var marker = overlays[i];
    			if(marker.index == gp.index){
    				marker.setIcon(Gis.Symbol.getQuerySymbol(gp,type));
    				break;
    			}
    		}
    	}else if(Gis.Map.mapType==6){
            var overlays = Gis.Map.BMap.getOverlays();
    		for(var i=0;i<overlays.length;i++){
    			var marker = overlays[i];
    			if(marker.index == gp.index){
    			    marker.setIcon(Gis.Symbol.getQuerySymbol(gp,type));
    				break;
    			}
    		}
    	}else{
    	    var graphics = Gis.Map.queryLayer.graphics;
    		for(var i=0;i<graphics.length;i++){
    			var graphic = graphics[i];
    			if(graphic.attributes.index==gp.index){
    				graphic.setSymbol(Gis.Symbol.getQuerySymbol(gp,type));
    				break;
    			}
    		}
    	}
    }
});