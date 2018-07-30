Gis.Map.Event = $.extend({}, {

    onMapClickHandler:null,

    onMapDrawEndHandler:null,

    gxdMapExtentChange : function(){
        Gis.Query.queryRealTime();
    },

    mapClick : function(evt){
        $("#mapPoint-show").removeClass("select");
        $("#mapPoint").hide();
        Gis.Map.Draw.clearDraw();
        Gis.Query.distanceQuery=Number($("[name=quiz]").val());
        var graphic = new esri.Graphic(new esri.geometry.Circle(evt.mapPoint,{"radius": Gis.Query.distanceQuery*1.3333,"radiusUnit":esri.Units.METERS}),Gis.Symbol.gxd.bufferSymbol);
        Gis.Map.gxdMap.graphics.add(graphic);
        Gis.Query.graphicQuery = evt.mapPoint;
        Gis.Query.poiType = 6;
        Gis.Query.queryMapClick(1);
    },

    mapDrawEnd : function(geometry){
        $("#mapPoint-show").removeClass("select");
        $("#mapPoint").hide();
        Gis.Map.Draw.clearDraw();
        var graphic = new esri.Graphic(geometry,Gis.Symbol.gxd.bufferSymbol);
        Gis.Map.gxdMap.graphics.add(graphic);
        Gis.Query.graphicQuery = geometry;
        Gis.Query.poiType = 6;
        Gis.Query.queryMapClick(1);
    },

    changeLayer : function(names,enable){
        for(var i=0;i<names.length;i++){
            var name = names[i];
            if(name=="area"&&enable){
                Gis.Map.areaMapServer.setVisibleLayers([0]);
                Gis.Map.areaMapServer.show();
            }else if(name=="area"){
                Gis.Map.areaMapServer.hide();
            }else if(name=="street"&&enable){
                Gis.Map.streetMapServer.setVisibleLayers([1]);
                Gis.Map.streetMapServer.show();
            }else if(name=="street"){
                Gis.Map.streetMapServer.hide();
            }else if(enable){
                if(Gis.Map.selectedLayers.indexOf(name)==-1){
                    Gis.Map.selectedLayers.push(name);
                }
            }else{
                switch(name){
                    case "community":
                        Gis.Map.labelLayerCom.hide();
                        break;
                    case "building":
                        Gis.Map.labelLayerBui.hide();
                        break;
                    case "unit":
                        Gis.Map.labelLayerUni.hide();
                        break;
                    case "house":
                        Gis.Map.labelLayerHouNo.hide();
                        break;
                }
                Gis.Map.selectedLayers.remove(name);
            }
        }
        Gis.Query.queryRealTime();
    },

    changeMap : function(mapType){
        if(Gis.Map.mapType == mapType){
            return;
        }
        Gis.Map.clearAll();
        var extent = Gis.Map.getMapRange(Gis.Map.mapType);
        //百度到ArcGIS
        if (Gis.Map.mapType == 6 && mapType < 5) {
            $('#bdMap').hide();
            $('#div_main').show();
            Gis.Map.Event.changeArcMap(mapType);
        }
        //高德到ArcGIS
        else if (Gis.Map.mapType == 7 && mapType < 5) {
            $('#gdMap').hide();
            $('#div_main').show();
            Gis.Map.Event.changeArcMap(mapType);
        }
        // ArcGIS到ArcGIS
        else if (Gis.Map.mapType < 5 && mapType < 5) {
            Gis.Map.Event.changeArcMap(mapType);
        }
        // ArcGIS到百度
        else if (Gis.Map.mapType < 5 && mapType == 6) {
            $('#div_main').hide();
            $('#bdMap').show();
            Gis.Map.initBMap();
        }
        // 4、从ArcGIS到高德
        else if (Gis.Map.mapType < 5 && mapType == 7) {
            $('#div_main').hide();
            $('#gdMap').show();
            Gis.Map.initAMap();
        }
        // 6、从高德到百度
        else if (Gis.Map.mapType == 7 && mapType == 6) {
            $('#gdMap').hide();
            $('#bdMap').show();
            Gis.Map.initBMap();
        }
        // 7、从百度到高德
        else if (Gis.Map.mapType == 6 && mapType == 7) {
            $('#bdMap').hide();
            $('#gdMap').show();
            Gis.Map.initAMap();
        }
        Gis.Map.mapType = mapType;
        Gis.Map.setMapRange(extent);
        reMapSize();
    },

    changeArcMap : function(mapType){
        if(mapType==1){
            Gis.Map.initGxdMap();
        }else if(mapType==2||mapType==3){
            Gis.Map.initTMap(mapType);
        }else{
            Gis.Map.initGMap();
        }
    }
});