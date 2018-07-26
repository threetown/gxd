// 底图服务
var qyMapUrl = "http://111.40.214.181/arcgis/rest/services/comm/ChinaGray/MapServer";
// 楼盘数据矢量服务
var addr_bui_unit_m = "http://111.40.214.181/arcgis/rest/services/comm/ADDRESS_BUI_UNIT/MapServer";
var addr_bui_unit_f = "http://111.40.214.181/arcgis/rest/services/comm/ADDRESS_BUI_UNIT/FeatureServer";

//3.如果你想一次编写多次使用的话,那就可以给String扩展一个replaceAll方法
String.prototype.replaceAll = function (FindText, RepText) {
    let regExp = new RegExp(FindText,'g');
    return this.replace(regExp, RepText);
};

// CRS 设置
var crs = new L.Proj.CRS("EPSG:3785", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ",
    {
        origin: [-20037700 , 30241100],
        resolutions: [
            156543.03392800014,
            78271.51696399994,
            39135.75848200009,
            19567.87924099992,
            9783.93962049996,
            4891.96981024998,
            2445.98490512499,
            1222.992452562495,
            611.4962262813797,
            305.74811314055756,
            152.87405657041106,
            76.43702828507324,
            38.21851414253662,
            19.10925707126831,
            9.554628535634155,
            4.77731426794937,
            2.388657133974685,
            1.1943285668550503,
            0.5971642835598172,
            0.29858214164761665
        ]
    });

// 中心點
var centerPoint = new L.LatLng(40.115052,116.403954);

var mapOptions = {
    center: centerPoint,
    zoom: 11,
    crs: crs,
    attributionControl: true,
};
var map = L.map('map', mapOptions);
var tileLayer = L.esri.tiledMapLayer({
    url: qyMapUrl,
    maxZoom: 19,
    minZoom: 0,
    continuousWorld: true
});
map.addLayer(tileLayer);

var cfg = {
    radius:0.02,
    maxOpacity:0.7,           //设置最大的不透明度
    scaleRadius:true,       //设置热力点是否平滑过渡
    blur: 0.95,               //系数越高，渐变越平滑，默认是0.85,
                                //滤镜系数将应用于所有热点数据。
    useLocalExtrema: true,    //使用局部极值
    latField: 'y',
    lngField: 'x',
    valueField: 'count'
};

var heatmapLayer = new HeatmapOverlay(cfg);
map.addLayer(heatmapLayer);

map.on('moveend', onmove);

function onmove(ev) {

    var bounds = map.getBounds();

    var mktSW = GPS.mercator_encrypt(bounds._southWest.lat, bounds._southWest.lng);
    var mktNE = GPS.mercator_encrypt(bounds._northEast.lat, bounds._northEast.lng);

    var xmin = mktSW.lon;
    var ymin = mktSW.lat;
    var xmax = mktNE.lon;
    var ymax = mktNE.lat;

    var data = {};
    data.url = (addr_bui_unit_m + "/0").replaceAll("/","-");
    data.outFields = "ADDRESS_ID,LABEL,ADDR_FULL_NAME,CITY_CODE,TOTALHOUSEHOLDCOUNT";
    data.where = "1=1";
    data.geometry = "{\"xmin\":" + xmin + ",\"ymin\":" + ymin +
        ",\"xmax\":" + xmax + ",\"ymax\":" + ymax + ",\"spatialReference\":{\"wkid\":\"3785\"}}";//xmin + "," + ymin + "," + xmax + "," + ymax;
    data.f = "json";

    $.ajax({
        url: _ctx + "/gxdyun/search/queryAddressByExtent",
        data: data,
        type: "POST",
        success: function (result) {
            heatmapLayer.setData(getData(result));
        },
        error: function (o) {

        }
    });
}

function getData(result) {
    var features = result.features;
    var heatdata = { max:features.length };
    var data = [];
    for (var i = 0;i < features.length;i++) {
        var wgs84 = GPS.mercator_decrypt(features[i].geometry.y,features[i].geometry.x);
        data.push({ x:wgs84.lon, y:wgs84.lat, count:features[i].attributes.TOTALHOUSEHOLDCOUNT })
    }
    heatdata.data = data;
    return heatdata;
}

function citySelectCallback(result) {
    var range = eval("("+result.range+")");
    var min = GPS.mercator_decrypt(range.ymin, range.xmin);
    var max = GPS.mercator_decrypt(range.ymax, range.xmax);

    var corner1 = L.latLng(min.lat,min.lon),
        corner2 = L.latLng(max.lat,max.lon),
        bounds = L.latLngBounds(corner1, corner2);
    map.panInsideBounds(bounds);
}

/*
// arcgis地图API功能
function initQyMap() {
    var map;
    require([
            "esri/InfoTemplate",
            "esri/map",
            "esri/layers/FeatureLayer",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/geometry/Extent",
            "esri/renderers/HeatmapRenderer",
            "dojo/domReady!"
        ],
        function (InfoTemplate, Map, FeatureLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, Extent, HeatmapRenderer){

            $("#qymap").height($(window).height());

            map = new Map("qymap", {
                slider:true,
                sliderStyle: "large",
                sliderPosition: "top-left",
                logo : false
            });

            // 底图
            var tilelayer = new ArcGISTiledMapServiceLayer(qyMapUrl);
            //var layer = new ArcGISTiledMapServiceLayer(qyMapUrl+"?token="+token);
            map.addLayer(tilelayer);
            // 初始化范围
            var extent = new Extent({spatialReference:{wkid: 3785},xmax:13001451.37,xmin:12911360.56,ymax:4867870.25,ymin:4835524.88});
            map.setExtent(extent);

            var infoContentDesc = "<p>${LABEL}</p>";
            var infoContentDetails = "${ADDR_FULL_NAME}";
            var infoContent = infoContentDesc + infoContentDetails;
            var infoTemplate = new InfoTemplate("详情", infoContent);

            var serviceURL = addr_bui_unit_f + "/0";
            var heatmapFeatureLayerOptions = {
                outFields: [
                    "ADDRESS_ID",
                    "LABEL",
                    "ADDR_FULL_NAME",
                    "TOTALHOUSEHOLDCOUNT",
                    "CITY_CODE"
                ]
            };

            var heatmapFeatureLayer = new FeatureLayer(serviceURL, heatmapFeatureLayerOptions);
            heatmapFeatureLayer.setDefinitionExpression("ADDR_TYPE_CD = '6'");
            var heatmapRenderer = new HeatmapRenderer({
                field: "TOTALHOUSEHOLDCOUNT",
                colorStops:  [{ratio: 0, color:"rgba(0, 255, 0, 0)"},
                    {ratio:0.3, color:"rgb(0, 255, 0)"},
                    {ratio:0.4, color:"rgb(150, 255, 0)"},
                    {ratio:0.5, color:"rgb(255, 255, 0)"},
                    {ratio:0.65, color:"rgb(255, 130, 0)"},
                    {ratio:0.8, color:"rgb(255, 90, 0)"}],
                blurRadius: 6,
                maxPixelIntensity: 300,
                minPixelIntensity: 0
            });
            heatmapFeatureLayer.setRenderer(heatmapRenderer);
            map.addLayer(heatmapFeatureLayer);

            //给属性查询按钮添加click事件
            map.on("click", function(e){
                //定义查询参数对象
                //获得用户点击的地图坐标
                var point = e.mapPoint;
                queryiden(addr_bui_unit_m, point, [0], showQueryResult, errback);
            });

            // 属性查询完成之后，用showQueryResult来处理返回的结果
            function showQueryResult(queryResult) {

                if (queryResult.length == 0) {
                    return;
                }
                var htmls = "";
                map.graphics.clear();
                if (queryResult.length >= 1) {
                    htmls = htmls + "<table style=\"width: 100%\">";
                    htmls = htmls + "<tr><td>名称</td></tr>";
                    //for (var i = 0; i < queryResult.length; i++) {
                    //获得图形graphic
                    var graphic = queryResult[0].feature;
                    //赋予相应的符号
                    graphic.setSymbol(symbol);
                    //将graphic添加到地图中，从而实现高亮效果
                    map.graphics.add(graphic);
                    //获得教学楼名称（此处是和shp属性表对应的）
                    var ptName = graphic.attributes["COMMUNITY_NAME"];

                    htmls = htmls + "<tr bgcolor=\"#F0F0F0\">";
                    htmls = htmls + "<td><a href=\"#\" \">" + ptName + "</a></td>";
                    htmls = htmls + "</tr>";
                    //}
                    htmls = htmls + "</table>";
                    //将属性绑定在divShowResult上面
                    //dom.byId("divShowResult").innerHTML = htmls;
                }
            }

            function queryiden(serivices,geometry,slayers,callback, errback){
                require(["esri/tasks/IdentifyTask","esri/tasks/IdentifyParameters"],
                    function(IdentifyTask,IdentifyParameters) {
                        var  identifyTask = new    esri.tasks.IdentifyTask(serivices);
                        var  identifyParams = new  esri.tasks.IdentifyParameters();
                        identifyParams.tolerance =10;
                        identifyParams.returnGeometry = true;
                        identifyParams.layerIds =slayers;
                        identifyParams.width  = map.width;
                        identifyParams.height = map.height;
                        identifyParams.mapExtent = map.extent;
                        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
                        identifyParams.outFields = ["*"];
                        identifyParams.geometry = geometry;
                        var deferred = identifyTask.execute(identifyParams);
                        identifyTask.execute(identifyParams, callback, errback);

                    });
            }

            function errback() {

            }
        });
}*/
