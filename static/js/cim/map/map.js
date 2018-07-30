Gis.Map = $.extend({}, {

    selectedLayers : [],

    init : function(){
        Gis.Symbol.init();
        Gis.Map.mapType = 1;
        Gis.Map.initResources();
        Gis.Map.initGxdMap();
        // Gis.Map.initMapLayer();
    },

    initResources : function(){
        //天地图
        eval(function(p,a,c,k,e,r){e=function(c){return(c<62?'':e(parseInt(c/62)))+((c=c%62)>35?String.fromCharCode(c+29):c.toString(36))};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'[a-km-wzA-E]'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('m.n("o",j.B.TiledMapServiceLayer,{constructor:k(){d.p=q j.SpatialReference({C:D});d.initialExtent=(d.fullExtent=q j.geometry.Extent(-e.f,-e.f,e.f,e.f,d.p));d.tileInfo=q j.B.TileInfo({"rows":E,"cols":E,"compressionQuality":0,"origin":{"x":-e.f,"y":e.f},"p":{"C":D},"lods":[{"a":1,"b":78271.51696402048,"c":2.958293554545656E8},{"a":2,"b":39135.75848201024,"c":1.479146777272828E8},{"a":3,"b":19567.87924100512,"c":7.39573388636414E7},{"a":4,"b":9783.93962050256,"c":3.69786694318207E7},{"a":5,"b":4891.96981025128,"c":1.848933471591035E7},{"a":6,"b":2445.98490512564,"c":9244667.357955175},{"a":7,"b":1222.99245256282,"c":4622333.678977588},{"a":8,"b":611.49622628141,"c":2311166.839488794},{"a":9,"b":305.748113140705,"c":1155583.419744397},{"a":10,"b":152.8740565703525,"c":577791.7098721985},{"a":11,"b":76.43702828517625,"c":288895.85493609926},{"a":12,"b":38.21851414258813,"c":144447.92746804963},{"a":13,"b":19.109257071294063,"c":72223.96373402482},{"a":14,"b":9.554628535647032,"c":36111.98186701241},{"a":15,"b":4.777314267823516,"c":18055.990933506204},{"a":16,"b":2.388657133911758,"c":9027.995466753102},{"a":17,"b":1.194328566955879,"c":4513.997733376551},{"a":18,"b":0.5971642834779395,"c":2256.998866688275}]});d.loaded=true;d.onLoad(d)},r:k(a,g,h){s i="t://u.v.w/z?T=vec_w&x="+h+"&y="+g+"&l="+a;A(i)}});m.n("TDTAnnotationLayer",o,{r:k(a,g,h){s i="t://u.v.w/z?T=cva_w&x="+h+"&y="+g+"&l="+a;A(i)}});m.n("TDTImageLayer",o,{r:k(a,g,h){s i="t://u.v.w/z?T=img_w&x="+h+"&y="+g+"&l="+a;A(i)}});',[],41,'||||||||||level|resolution|scale|this|20037508|3427892|row|col|url|esri|function||dojo|declare|TDTLayer|spatialReference|new|getTileUrl|var|http|t0|tianditu|com|||DataServer|return|layers|wkid|3785|256'.split('|'),0,{}))
        //谷歌影像
        Gis.Map.googleMapServer = new esri.layers.ArcGISTiledMapServiceLayer("http://111.40.214.181/arcgis/rest/services/comm/googleMap/MapServer");
        //国信达底图
        Gis.Map.baseMapServer = new esri.layers.ArcGISTiledMapServiceLayer("http://111.40.214.181/arcgis/rest/services/comm/NewChina/MapServer");
        //天地图二维
        Gis.Map.tdtLayer = new TDTLayer();
        Gis.Map.tdtLayer.hide();
        //天地图卫星
        Gis.Map.tdtimageLayer = new  TDTImageLayer();
        Gis.Map.tdtimageLayer.hide();
        //天地图标注
        Gis.Map.tdtAnnotationLayer = new  TDTAnnotationLayer();
        Gis.Map.tdtAnnotationLayer.hide();
        //行政区
        Gis.Map.areaMapServer = new esri.layers.ArcGISDynamicMapServiceLayer("http://111.40.214.181/arcgis/rest/services/comm/area/MapServer",
                        { id:"areaLayer", opacity:1, visible: false,name:"行政区" });
        Gis.Map.areaMapServer.setLayerDefinitions([" STATUS_CD <> 2 "]);
        //街道办
        Gis.Map.streetMapServer = new esri.layers.ArcGISDynamicMapServiceLayer("http://111.40.214.181/arcgis/rest/services/comm/precinct_street/MapServer",
                        { id:"streetLayer", opacity:1, visible: false,name:"街道办" });
        //展示图层，元素层级3
        Gis.Map.showLayer3 = new esri.layers.GraphicsLayer();
        //展示图层，元素层级2
        Gis.Map.showLayer2 = new esri.layers.GraphicsLayer();
        //展示图层，元素层级1 最高
        Gis.Map.showLayer1 = new esri.layers.GraphicsLayer();
        //标注显示层
        Gis.Map.textLayer = new esri.layers.GraphicsLayer();
        //查询展示层
        Gis.Map.queryLayer = new esri.layers.GraphicsLayer();

        Gis.Map.ARR_MAP_CLASS = {1: '企业地图', 2: '天地图', 3: '在线卫星', 4: '谷歌影像', 5: '全景', 6: '百度', 7: '高德'};
    },

    initArcMap : function(){
        Gis.Map.clearAll();
        if(Gis.Map.gxdMap){
            Gis.Map.gxdMap.destroy();
        }
        Gis.Map.gxdMap= new esri.Map('gxdMap',{
            logo:false
            ,slider:false
            ,sliderStyle : "large"
            ,showLabels : true
            ,minZoom:4
        });
    },

    initGxdMap : function(){
        Gis.Map.initArcMap();
        Gis.Map.gxdMap.addLayer(this.baseMapServer);
        Gis.Map.initArcLayer();
    },

    initGMap : function(){
        Gis.Map.initArcMap();
        Gis.Map.gxdMap.addLayer(this.googleMapServer);
        Gis.Map.initArcLayer();
    },

    initTMap : function(type){
        Gis.Map.initArcMap();
    	Gis.Map.tdtAnnotationLayer.show();
    	if (type == 2) {
    	    Gis.Map.tdtimageLayer.hide();
    		Gis.Map.tdtLayer.show();
    	} else {
    	    Gis.Map.tdtLayer.hide();
    		Gis.Map.tdtimageLayer.show();
    	}
    	Gis.Map.gxdMap.addLayer(Gis.Map.tdtLayer);
    	Gis.Map.gxdMap.addLayer(Gis.Map.tdtimageLayer);
    	Gis.Map.gxdMap.addLayer(Gis.Map.tdtAnnotationLayer);
    	Gis.Map.initArcLayer();
    },

    initBMap : function(){
        if(!Gis.Map.BMap){
            // 百度地图API功能
            Gis.Map.BMap = new BMap.Map("bdMap"); 					// 创建Map实例
            Gis.Map.BMap.centerAndZoom(new BMap.Point(116.404, 39.915), 11);	// 初始化地图,设置中心点坐标和地图级别
            Gis.Map.BMap.enableScrollWheelZoom(true); 						// 开启鼠标滚轮缩放
            var stCtrl = new BMap.PanoramaControl(); 				// 构造全景控件
            stCtrl.setOffset(new BMap.Size(20, 20));
            stCtrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
            Gis.Map.BMap.addControl(stCtrl); 								// 添加全景控件
            Gis.Map.BMap.setCurrentCity(bCityName); 				// 设置地图显示的城市 此项是必须设置的
        }
    },

    initAMap : function(){
        if(!Gis.Map.AMap){
            Gis.Map.AMap = new AMap.Map('gdMap', {
                resizeEnable : true,
                keyboardEnable : false,
                showIndoorMap : false,				// 隐藏地图自带的室内地图图层
                zoom : 11,
                isHotspot: true,
                center : [ 116.397428, 39.90923 ]
            });
            Gis.Map.AMap.setCity(cityCodeComp);
        }
    },

    initArcLayer : function(){
        Gis.Map.gxdMap.setExtent(new esri.geometry.Extent({spatialReference:{wkid: 3785},xmax:13001451.37,xmin:12911360.56,ymax:4867870.25,ymin:4835524.88}));
        Gis.Map.gxdMap.addLayer(Gis.Map.areaMapServer);
        Gis.Map.gxdMap.addLayer(Gis.Map.streetMapServer);
        Gis.Map.gxdMap.addLayer(Gis.Map.showLayer3);
        Gis.Map.gxdMap.addLayer(Gis.Map.showLayer2);
        Gis.Map.gxdMap.addLayer(Gis.Map.showLayer1);
        Gis.Map.gxdMap.addLayer(Gis.Map.textLayer);
        Gis.Map.gxdMap.addLayer(Gis.Map.queryLayer);
        dojo.connect(Gis.Map.gxdMap, "onPanEnd", Gis.Map.Event.gxdMapExtentChange);
        dojo.connect(Gis.Map.gxdMap, "onZoomEnd",Gis.Map.Event.gxdMapExtentChange);
    },

    initMapLayer : function(){
        $.ajax({
            url:_ctx+"/aia/area/findMapRegistByCityId",
            type:"POST",
            data:{cityId:cityId},
            success:function(result){
                  Gis.Map.queryServer = result.map_url;
                  var json = {"labelExpressionInfo" : {"value" : "{LABEL}"}};
                  // 小区标注
                  Gis.Map.labelLayerCom=new esri.layers.FeatureLayer(Gis.Map.queryServer+"/1", { id:"labelLayer4Com", opacity:1, visible: false,name:"labelLayer4Com", outFields: ["*"] })
                  var comSymbol = new esri.symbol.SimpleMarkerSymbol();
                  comSymbol.setSize("0");
                  var comRenderer = new esri.renderer.SimpleRenderer(comSymbol);
                  Gis.Map.labelLayerCom.setRenderer(comRenderer);
                  var comLabel = new esri.symbol.TextSymbol().setColor(new esri.Color("#8B0000")).setOffset(0, 8);
                  comLabel.font.setSize("12pt").setWeight(esri.symbol.Font.WEIGHT_BOLDER)
                  var comLabelClass = new esri.layers.LabelClass(json);
                  comLabelClass.symbol = comLabel;
                  Gis.Map.labelLayerCom.setLabelingInfo([ comLabelClass ]);
                  Gis.Map.gxdMap.addLayer(Gis.Map.labelLayerCom);

                  // 楼栋标注
                  Gis.Map.labelLayerBui=new esri.layers.FeatureLayer(Gis.Map.queryServer+"/2", { id:"labelLayer4Bui", opacity:1, visible: false,name:"labelLayer4Bui", outFields: ["*"] })
                  var buiSymbol = new esri.symbol.SimpleMarkerSymbol();
                  buiSymbol.setSize("0");
                  var buiRenderer = new esri.renderer.SimpleRenderer(buiSymbol);
                  Gis.Map.labelLayerBui.setRenderer(buiRenderer);
                  var buiLabel = new esri.symbol.TextSymbol().setColor(new esri.Color("#0000CD")).setOffset(0, 8);
                  buiLabel.font.setSize("10pt").setWeight(esri.symbol.Font.WEIGHT_BOLD);
                  var buiLabelClass = new esri.layers.LabelClass(json);
                  buiLabelClass.symbol = buiLabel;
                  Gis.Map.labelLayerBui.setLabelingInfo([ buiLabelClass ]);
                  Gis.Map.gxdMap.addLayer(Gis.Map.labelLayerBui);

                  // 单元标注
                  Gis.Map.labelLayerUni=new esri.layers.FeatureLayer(Gis.Map.queryServer+"/27", { id:"labelLayer4Uni", opacity:1, visible: false,name:"labelLayer4Uni", outFields: ["*"] })
                  Gis.Map.labelLayerUni.setRenderer(buiRenderer);
                  var uniLabel = new esri.symbol.TextSymbol().setColor(new esri.Color("#000")).setOffset(0, 6);
                  uniLabel.font.setSize("9pt").setWeight(esri.symbol.Font.WEIGHT_BOLD);
                  var uniLabelClass = new esri.layers.LabelClass(json);
                  uniLabelClass.symbol = uniLabel;
                  Gis.Map.labelLayerUni.setLabelingInfo([ uniLabelClass ]);
                  Gis.Map.gxdMap.addLayer(Gis.Map.labelLayerUni);

                  // 户标注No
                  Gis.Map.labelLayerHouNo=new esri.layers.FeatureLayer(Gis.Map.queryServer+"/3", { id:"labelLayer4HouNo", opacity:1, visible: false,name:"labelLayer4HouNo", outFields: ["*"] })
                  Gis.Map.labelLayerHouNo.setRenderer(buiRenderer);
                  var houLabelNo = new esri.symbol.TextSymbol().setColor(new esri.Color("#000")).setOffset(0, 6);
                  houLabelNo.font.setSize("9pt").setWeight(esri.symbol.Font.WEIGHT_BOLD);
                  var houLabelClassNo = new esri.layers.LabelClass(json);
                  houLabelClassNo.symbol = houLabelNo;
                  Gis.Map.labelLayerHouNo.setLabelingInfo([ houLabelClassNo ]);
                  Gis.Map.gxdMap.addLayer(Gis.Map.labelLayerHouNo);
            }
        });
    },

    setMapRange : function(extent){
        var	minLoc = GPS.gcj_encrypt(extent.ymin,extent.xmin);
        var	maxLoc = GPS.gcj_encrypt(extent.ymax,extent.xmax);
        if(Gis.Map.mapType==7){
            Gis.Map.AMap.setBounds(new AMap.Bounds(new AMap.LngLat(minLoc.lon,minLoc.lat),
                new AMap.LngLat(maxLoc.lon,maxLoc.lat)))
        }else if(Gis.Map.mapType==6){
            minLoc = GPS.bd_encrypt(minLoc.lat, minLoc.lon);
            maxLoc = GPS.bd_encrypt(maxLoc.lat, maxLoc.lon);
            Gis.Map.BMap.setViewport([new BMap.Point(minLoc.lon,minLoc.lat),
                     new BMap.Point(maxLoc.lon,minLoc.lat),
                     new BMap.Point(maxLoc.lon,maxLoc.lat),
                     new BMap.Point(minLoc.lon,maxLoc.lat),
                     new BMap.Point(minLoc.lon,minLoc.lat)]);
        }else{
            minLoc = GPS.mercator_encrypt(extent.ymin,extent.xmin);
            maxLoc = GPS.mercator_encrypt(extent.ymax,extent.xmax);
            var et =new esri.geometry.Extent({
               xmin:minLoc.lon,
               ymin:minLoc.lat,
               xmax:maxLoc.lon,
               ymax:maxLoc.lat,
               spatialReference:Gis.Map.gxdMap.spatialReference
           });
            Gis.Map.gxdMap.setExtent(et);
        }
    },

    getMapRange : function(mapType){
    	var extent = {};
    	if(mapType==7){
            obj = Gis.Map.AMap.getBounds();
            var minLoc = GPS.gcj_decrypt_exact(obj.getSouthWest().getLat(),obj.getSouthWest().getLng());
            var maxLoc = GPS.gcj_decrypt_exact(obj.getNorthEast().getLat(),obj.getNorthEast().getLng());
            extent.xmin = minLoc.lon;
            extent.ymin = minLoc.lat;
            extent.xmax = maxLoc.lon;
            extent.ymax= maxLoc.lat;
    	}else if(mapType==6){
            var obj = Gis.Map.BMap.getBounds();
            var minLoc = GPS.bd_decrypt(obj.getSouthWest().lat,obj.getSouthWest().lng);
            var maxLoc = GPS.bd_decrypt(obj.getNorthEast().lat,obj.getNorthEast().lng);
            minLoc = GPS.gcj_decrypt_exact(minLoc.lat,minLoc.lon);
            maxLoc = GPS.gcj_decrypt_exact(maxLoc.lat,maxLoc.lon);
            extent.xmin = minLoc.lon;
            extent.ymin = minLoc.lat;
            extent.xmax = maxLoc.lon;
            extent.ymax= maxLoc.lat;
    	}else{
            var obj = Gis.Map.gxdMap.extent;
            var minLoc = GPS.mercator_decrypt(obj.ymin,obj.xmin);
            var maxLoc = GPS.mercator_decrypt(obj.ymax,obj.xmax);
            extent.xmin = minLoc.lon;
            extent.ymin = minLoc.lat;
            extent.xmax = maxLoc.lon;
            extent.ymax= maxLoc.lat;
    	}
    	return extent;
    },

    clearAll : function(){
        Gis.Map.Draw.clearDraw();
        if(Gis.Map.gxdMap){
            Gis.Map.gxdMap.graphics.clear();
        }
        if(Gis.Map.queryLayer){
            Gis.Map.queryLayer.clear();
        }
        if(Gis.Map.BMap){
            Gis.Map.BMap.clearOverlays();
        }
        if(Gis.Map.AMap){
            Gis.Map.AMap.clearMap();
        }
        Gis.Map.clearQueryGraphics();
    },

    clearQueryGraphics : function(){
        if(Gis.Map.queryLayer){
            Gis.Map.queryLayer.clear();
        }
        if(Gis.Map.gxdMap){
           Gis.Map.gxdMap.infoWindow.hide();
        }
        if(Gis.Map.BMap){
            Gis.Map.BMap.clearOverlays();
        }
        if(Gis.Map.AMap){
            Gis.Map.AMap.clearMap();
        }
        if(Gis.Map.AMapInfoWindow){
            Gis.Map.AMapInfoWindow.close();
        }
    }

});