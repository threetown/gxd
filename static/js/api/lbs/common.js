// 页面初始化方法
$(function(){
    initCitySelect();

    // 事件
    $(".citySelect-list li,#citySelect-popular li").on("click",function(){
        var area = eval("(" + ($(this).attr("value")) + ")");
        $.ajax({
            url:_ctx+"/gxdyun/area/citySelected",
            type:"POST",
            data:{areaId:area.areaId,cityName:area.name},
            success:function(result){
                if(result && result.range){
                    $("#citySelect-show span").html(area.name);
                    $("#citySelect-title").html("当前城市：" + area.name);
                    result.city_id = area.areaId;
                    // 切换地图方法
                    citySelectCallback(result);
                }
            }
        });
    });
    $("#citySelect-alphabetic-province li").on("click",function(){
        $("#citySelect-alphabetic-province").find("li.select").removeClass("select");
        $("#citySelect-province-list").find("dt[value="+$(this).text()+"]")[0].scrollIntoView(true);
        $(this).addClass("select");
    });
    $("#citySelect-alphabetic-city li").on("click",function(){
        $("#citySelect-alphabetic-city").find("li.select").removeClass("select");
        $("#citySelect-city-list").find("dt[value="+$(this).text()+"]")[0].scrollIntoView(true);
        $(this).addClass("select");
    });
    $(document).on("click",function(e){
        if($(e.target).parents("#citySelectDiv").length == 0)
        {
            $("#citySelect-show").removeClass("select");
            $("#citySelect-show").find("img").attr("src","/static/images/lbs/more.png");
            $("#citySelectDiv").hide();
        }
    });
    $("#citySelect-show").on("click", function(e){
        if($("#citySelectDiv").is(":hidden")){
            $("#citySelect-show").addClass("select");
            $("#citySelect-show").find("img").attr("src","/static/images/lbs/more1.png");
            $("#citySelectDiv").show();
            $("#citySelect-list").height($("#citySelect-content").height()-
                $("#citySelect-popular").height()-
                $("#citySelect-toolbar").height()-5);
        }else{
            $("#citySelect-show").removeClass("select");
            $("#citySelect-show").find("img").attr("src","/static/images/lbs/more.png");
            $("#citySelectDiv").hide();
        }
        e.stopPropagation();
    });
    $(".citySelect-btn").on("click", function(){
        $(".citySelect-btn.select").removeClass("select");
        $(this).addClass("select");
        if($(this).attr("id")=="citySelect-province"){
            $("#citySelect-alphabetic-city").hide();
            $("#citySelect-city-list").hide();
            $("#citySelect-alphabetic-province").show();
            $("#citySelect-province-list").show();
        }else{
            $("#citySelect-alphabetic-province").hide();
            $("#citySelect-province-list").hide();
            $("#citySelect-alphabetic-city").show();
            $("#citySelect-city-list").show();
        }
        $("#citySelect-list").height($("#citySelect-content").height()-
            $("#citySelect-popular").height()-
            $("#citySelect-toolbar").height()-5);
        $(".citySelect-alphabetic").find("li.select").removeClass("select");
        $("#citySelect-list").scrollTop(0);
    });
});
//初始化
function initCitySelect(){
    $.ajax({
        url:_ctx+"/gxdyun/area/findProvinceAndCity",
        type:"POST",
        success:function(provinceData){
            var provinceCodeHeadArray = [];
            var codeHead = null;
            var parentArea = null;
            var html = '';
            for(var i=0;i<provinceData.length;i++){
                if(provinceData[i].citys&&provinceData[i].citys.length>0){
                    if(codeHead==null){
                        parentArea = provinceData[i].areaId;
                        codeHead = provinceData[i].zoneNumber.substr(0, 1);
                        html +='<dt value="'+codeHead+'">'+provinceData[i].name+'：</dt>';
                        html +='<dd>';
                        provinceCodeHeadArray.push(codeHead);
                    }else{
                        if(codeHead!=provinceData[i].zoneNumber.substr(0, 1)){
                            codeHead = provinceData[i].zoneNumber.substr(0, 1);
                            provinceCodeHeadArray.push(codeHead);
                        }
                        html +='</dd>';
                        html +='<dt value="'+codeHead+'">'+provinceData[i].name+'：</dt>';
                        html +='<dd>';
                    }
                    for(var j=0;j<provinceData[i].citys.length;j++){
                        html +='<li value=\''+JSON.stringify(provinceData[i].citys[j])+'\'>'+provinceData[i].citys[j].name+'</li>';
                    }
                }
            }
            html+='</dd>';
            $('#citySelect-province-list').append(html);
            $.each(provinceCodeHeadArray,function(i,item){
                $("#citySelect-alphabetic-province").append('<li>'+item+'</li>');
            });
        }
    });
    $.ajax({
        url:_ctx+"/gxdyun/area/findCityList",
        type:"POST",
        success:function(cityData){
            var cityCodeHeadArray = [];
            var codeHead = null;
            var html = '';
            for(var i=0;i<cityData.length;i++){
                if(codeHead==null){
                    codeHead = cityData[i].code.substr(0, 1);
                    html+='<dt value="'+codeHead+'">'+codeHead+'：</dt>';
                    html+='<dd>';
                    cityCodeHeadArray.push(codeHead);
                }else if(codeHead!=cityData[i].code.substr(0, 1)){
                    codeHead = cityData[i].code.substr(0, 1);
                    html+='</dd>';
                    html+='<dt value="'+codeHead+'">'+codeHead+'：</dt>';
                    html+='<dd>';
                    cityCodeHeadArray.push(codeHead);
                }
                html+='<li value=\''+JSON.stringify(cityData[i])+'\'>'+cityData[i].name+'</li>';
                var $li = $("#citySelect-popular").find("li[name='"+cityData[i].name+"']");
                if($li.length>0){
                    $($li[0]).attr("value",JSON.stringify(cityData[i]));
                }
            }
            html+='</dd>';
            $('#citySelect-city-list').append(html);
            $.each(cityCodeHeadArray,function(i,item){
                $("#citySelect-alphabetic-city").append('<li>'+item+'</li>');
            });
        }
    });
}

// leaflet 加载地图（地图+图层）
function loadLeafletMap(mapDiv, tileLayerUrl, dyLayerUrl, initZoom) {
    // CRS 设置
    var crs = new L.Proj.CRS("EPSG:3785", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ", {
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

    var pt = GPS.mercator_decrypt(4871665.8519, 12947867.2696)

    // 中心點
    var centerPoint = new L.LatLng(pt.lat,pt.lon);

    var mapOptions = {
        center: centerPoint,
        zoom: initZoom,
        crs: crs,
        attributionControl: true,
    };
    var map = L.map(mapDiv, mapOptions);
    var tileLayer = L.esri.tiledMapLayer({
        url: tileLayerUrl,
        maxZoom: 19,
        minZoom: 0,
        continuousWorld: true
    });
    map.addLayer(tileLayer);

    var dynamicMapLayer = null;
    if (dyLayerUrl != null) {
        dynamicMapLayer = L.esri.dynamicMapLayer({
            url: dyLayerUrl,
            opacity: 1,
        });

        dynamicMapLayer.addTo(map);
    }
    // 比例尺
    L.control.scale().addTo(map);
    // 地图注释
    L.control.attribution({ position: 'bottomright', prefix: '北京国信达' }).addTo(map);

    $(".leaflet-control-attribution a").hide();

    return [map,dynamicMapLayer];
}

// 全屏
function fullscreen() {
    var docElm = document.getElementById("map");
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}

// 退出全屏
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// 监听是否全屏
window.onload = function() {

    var elem = document.getElementById('state');

    var yes = "<img src=\"${ctx }/static/images/lbs/map-detail-back.png\" alt=\"\">退出全屏";
    var no = "<img src=\"${ctx }/static/images/lbs/map-detail-fullscreen.png\" alt=\"\">全屏浏览";

    document.addEventListener('fullscreenchange',
        function() {
            $(elem).html(document.fullscreen ? yes : no);
            $("#state").attr("title", document.fullscreen ? "退出全屏" : "全屏浏览");
        },
        false);
    document.addEventListener('mozfullscreenchange',
        function() {
            $(elem).html(document.mozFullScreen ?  yes : no);
            $("#state").attr("title", document.mozFullScreen ? "退出全屏" : "全屏浏览");
        },
        false);
    document.addEventListener('webkitfullscreenchange',
        function() {
            $(elem).html(document.webkitIsFullScreen ?  yes : no);
            $("#state").attr("title", document.webkitIsFullScreen ? "退出全屏" : "全屏浏览");
        },
        false);
    document.addEventListener('msfullscreenchange',
        function() {
            $(elem).html(document.msFullscreenElement ?  yes : no);
            $("#state").attr("title", document.msFullscreenElement ? "退出全屏" : "全屏浏览");
        },
        false);
}