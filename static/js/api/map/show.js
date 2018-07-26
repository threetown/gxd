Gis.Show = $.extend({}, {

    queryServerCallBack:function(response){
        for(var i=0;i<response.features.length;i++){
            var  feature = response.features[i];
            feature.setSymbol(Gis.Symbol.gxd["cd"+feature.attributes.ADDR_TYPE_CD]);
            Gis.Map.showLayer.add(feature);
        }
    },
    queryPointCallBack:function(response,type){
        var symbol = Gis.Symbol.gxd[type];
        for(var i=0;i<response.length;i++){
            var geom = Gis.Util.JsonToGeometry(response[i].GEOMSTRY);
            if(geom==null){
                continue;
            }
            var graphic = new esri.Graphic(geom, symbol);
            graphic.attributes=response[i];
            Gis.Map.showLayer.add(graphic);
            var point = new esri.geometry.Point(Number(geom.x),Number(geom.y)+8,Gis.Map.gxdMap.spatialReference);
            var text = (isNull(response[i].LABEL)!=""?response[i].LABEL:response[i].NAME);
            Gis.Map.textLayer.add(new esri.Graphic(point,Gis.Symbol.getTextSymbol(text),null));
        }
    },
    queryPolygonCallBack:function(response){
        Gis.Map.showLayer.clear();
        Gis.Map.textLayer.clear();
        var symbols = Gis.Symbol.gxd["area"];
        for(var i=0;i<response.data.length;i++){
            var item = response.data[i];
            var geom = null;
            if(item.polygon) {
                item.polygon.coordinates[0] = GPS.mercator_encrypt_range(item.polygon.coordinates[0]);
                item.polygon.type = "Polygon";
                var arcgis = Terraformer.ArcGIS.convert(item.polygon, {sr: Gis.Map.gxdMap.spatialReference.wkid});
                geom = esri.geometry.fromJson(arcgis);

                var price = Math.floor(Math.random()*(110000-5000+1)+5000);;//Number(item.avg_price == undefined ? 0 : item.avg_price);
                var symbol = Gis.Symbol.getGeomSymbol(price);
                var graphic = new esri.Graphic(geom, symbol);
                Gis.Map.showLayer.add(graphic);
                if (geom.getExtent() != undefined) {
                    var point = geom.getExtent().getCenter();
                    var text = item.name + "(" + (price == 0 ? " - " : price) + ")";
                    Gis.Map.textLayer.add(new esri.Graphic(point, Gis.Symbol.getTextSymbol(text), null));
                }
            }
        }
    },
    queryMapClickPointCallBack:function(response){
        Gis.Map.clearQueryGraphics();
        Gis.Map.queryGraphics = [];
        $("#mapResult-list").html("");
        $(".pageList ul").removeAttr("pageCount");
        $(".pageList .dot").text("1/1");
        if(response.status==200){
            loadPageList(response);
            var index = 1;
            for(var i=0;i<response.data.length;i++){
                var item = response.data[i];
                item.index = index;
                var $row = $("#template-div .mapResultListItems").clone();
                $row.find(".flag").text(index);
                $row.find("h5").text(item.name);
                $row.find("p").text(item.address);
                $row.attr("index",index);
                $("#mapResult-list").append($row);
                Gis.Map.queryGraphics.push(item);
                index++;
            }
            Gis.Show.loadQueryGraphics(true,"mapClick");
        }else{
            layer.msg("未查到数据！",{time:600});
        }
        $("#mapResultDiv").show();
    },
    loadQueryGraphics : function(isLocation,type){
        var extent = null;
        Gis.Map.clearQueryGraphics();
        if(Gis.Map.queryGraphics){
            for(var i=0;i<Gis.Map.queryGraphics.length;i++){
                var gp = Gis.Map.queryGraphics[i];
                if(!extent){
                    extent={
                       xmin:gp.lng,
                       ymin:gp.lat,
                       xmax:gp.lng,
                       ymax:gp.lat
                   };
                }else{
                    if(extent.xmin>gp.lng){
                        extent.xmin = gp.lng;
                    }
                    if(extent.ymin>gp.lat){
                        extent.ymin = gp.lat;
                    }
                    if(extent.xmax<gp.lng){
                        extent.xmax = gp.lng;
                    }
                    if(extent.ymax<gp.lat){
                        extent.ymax = gp.lat;
                    }
                }
                Gis.Show.addGraphic(gp,type);
            }
        }
        if(isLocation){
            extent.xmin = extent.xmin-0.001;
            extent.ymin = extent.ymin-0.001;
            extent.xmax = extent.xmax+0.001;
            extent.ymax = extent.ymax+0.001;
            Gis.Map.setMapRange(extent);
        }
    },
    addGraphic : function(gp,type){
    	var loc = GPS.gcj_encrypt(gp.lat, gp.lng);
    	if(Gis.Map.mapType==7){
    		var marker = new AMap.Marker({
                icon: Gis.Symbol.getQuerySymbol(gp,type),
                position: [loc.lon, loc.lat],
                extData:gp,
                zIndex:1000
            });
            marker.setMap(Gis.Map.AMap);
    	}else if(Gis.Map.mapType==6){
    		loc = GPS.bd_encrypt(loc.lat, loc.lon);
    		var point = new BMap.Point(loc.lon, loc.lat);
    		var marker = new BMap.Marker(point,{icon:Gis.Symbol.getQuerySymbol(gp,type)});
    		marker.setZIndex(1000);
    		marker.data = gp;
    		Gis.BMap.addOverlay(marker);
    	}else{
    		loc = GPS.mercator_encrypt(gp.lat, gp.lng);
    		var graphic = new esri.Graphic(new esri.geometry.Point(loc.lon, loc.lat, Gis.Map.gxdMap.spatialReference),
    			Gis.Symbol.getQuerySymbol(gp,type));
    		graphic.attributes=gp;
    		Gis.Map.queryLayer.add(graphic);
    	}
    },
    showInfoWindow : function(gp,type){
        var html = '<div class="infoWindow suspended-frame" >'+gp.name+'</div>';
        var loc = GPS.gcj_encrypt(gp.lat, gp.lng);
    	if(Gis.Map.mapType==7){
    	    if(Gis.Map.AMapInfoWindow){
    	        Gis.Map.AMapInfoWindow.close();
    	    }
    	    Gis.Map.AMapInfoWindow = new AMap.InfoWindow({
    	        isCustom: true,
                content: html,  //使用默认信息窗体框样式，显示信息内容
                offset: new AMap.Pixel(5, -33)
            });
            Gis.Map.AMapInfoWindow.open(Gis.Map.AMap,new AMap.LngLat(loc.lon,loc.lat));
    	}else if(Gis.Map.mapType==6){
    		/*loc = GPS.bd_encrypt(loc.lat, loc.lon);
    		var opts = {
    		    width:36+(name.length*16),
    		    height:10
    		};
    		var html = '<div class="infoWindow-arc" >'+name+'</div>';
            var infoWindow = new BMap.InfoWindow(html, opts);  // 创建信息窗口对象
            var point = new BMap.Point(loc.lon,loc.lat);
            BAIDU_MAP.openInfoWindow(infoWinselectLayerdow,point); //开启信息窗口*/
    	}else{
    		loc = GPS.mercator_encrypt(gp.lat, gp.lng);
            var infoWindow = Gis.Map.gxdMap.infoWindow;
            infoWindow.resize(1000, 42);
            var html = '<div class="infoWindow-arc" >'+gp.name+'</div>';
            infoWindow.setContent(html);
            infoWindow.resize(25+(gp.name.length*16), 42);
            var screenPoint = null;
            if(type=="mapClick"){
                screenPoint = Gis.Map.gxdMap.toScreen(new esri.geometry.Point(loc.lon, loc.lat, Gis.Map.gxdMap.spatialReference));
            }else{
                screenPoint = Gis.Map.gxdMap.toScreen(new esri.geometry.Point(loc.lon+10, loc.lat, Gis.Map.gxdMap.spatialReference));
            }
            infoWindow.show(screenPoint,Gis.Map.gxdMap.getInfoWindowAnchor(screenPoint));
    	}
    }
});