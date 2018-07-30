function onload() {
    loadScript();
	$('#div_main').width($(window).width());
	$('#div_main').height($(window).height());
	$('#resultDiv').css("max-height",$(window).height()-80-67);
	$("#mapResultDiv").height($(window).height()-155);
	$("#mapResult-list").height($(window).height()-375);
	layui.use(['form','layer'], function(){
        form = layui.form;
        layer = layui.layer;
    });
	loadScript();
	bindEvent();
	initAutoSearch();
	// initCitySelect();
}

// 异步加载
function loadScript() {  
	// 百度api
  	var script = document.createElement("script");  
  	script.src = "http://api.map.baidu.com/api?v=2.0&ak=5xuNVWCpFIpNwcdzf0Sio0djEPPkR7fR&callback=initialize";//此为v2.0版本的引用方式  
  	document.body.appendChild(script);  
  
  	var script = document.createElement("script");  
  	script.src = "http://api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js";//此为v2.0版本的引用方式  
  	document.body.appendChild(script);  
  
	// 高德api
	var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'http://webapi.amap.com/maps?v=1.3&amp;key=5fb42b18306b2694f03213e20e558169';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
} 

function resizMap() {
	setTimeout(function() {
		//resizeMixMap();
		// 刷新map
		Gis.Map.gxdMap.resize(true);
		Gis.Map.gxdMap.reposition();
	}, 300);
}

var layer = null;
var form =null;
var cityName="北京市";
var bCityName="北京";
var cityCode=1101;
var cityCodeComp=110100;
var searchGraphics=[];
var mapClickGraphics=[];
var inputHasFocus = false;
var cityId = 2;
var iFMapResultDivShow = false;
var _a_timer = null;
$(function(){
    onload();
	var i = setInterval(function(){
		if(esri.Map){
			clearInterval(i);
			Gis.Map.init();
			reMapSize();
		}
	},50);

	var k = setInterval(function(){
        if(esri.toolbars){
            clearInterval(k);
            Gis.Map.Draw.init();
        }
    },50);
});

function bindEvent(){
	$("#search-img").mouseout(function(){
		$("#search-img").attr("src","/static/images/sergre.png");
	});
	$("#search-img").mouseover(function(){
		$("#search-img").attr("src","/static/images/ser.png");
	});
	$(".citySelect-btn").click(function(){
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
	$("#search-img").click(function(){
		addressResolution($("#search-input").val(),"search");
	});
	$("#analysisDiv").click(function(){
		if($("#analysisResultDiv").is(":hidden")){
			$("#analysisResultDiv").show();
			$("#resultDiv").hide();
		}else{
			$("#analysisResultDiv").hide();
		}
	});
	$("#mapPoint-show").click(function(){
        Gis.Map.clearAll();
        $("#mapResultDiv").hide();
        $("#resultDiv").hide();
	    $(".drawMapTools li").removeClass("select");
	    if($("#mapPoint").is(":hidden")){
	        $("#mapPoint-show").addClass("select");
            $("#mapPoint").show();
        }else{
            $("#mapPoint-show").removeClass("select");
            $("#mapPoint").hide();
        }
    });
    $(".drawMapTools li").click(function(e){
        Gis.Map.Draw.clearDraw();
        var type = $(this).attr("type");
        $(this).siblings().removeClass("select");
        $(this).addClass("select");
        $(".mapResult-type").children("li").removeClass("select");
        $(".mapResult-type").children("li").eq(0).addClass("select");
        if(type=="point"){
            Gis.Map.Oper.openMapClick();
        }else if(type=="polygon"){
            Gis.Map.Oper.openMapDraw(esri.toolbars.Draw.POLYGON);
        }else{
            Gis.Map.Oper.openMapDraw(esri.toolbars.Draw.RECTANGLE);
        }
    });
	$("#citySelect-show").click(function(e){
		if($("#citySelectDiv").is(":hidden")){
			showFrame("citySelect");
			$("#resultDiv").hide();
			$("#citySelect-list").height($("#citySelect-content").height()-
					$("#citySelect-popular").height()-
					$("#citySelect-toolbar").height()-5);
		}else{
			hideFrame("citySelect");
		}
		e.stopPropagation();
	});
	$("#layerSelect-show").click(function(e){
		if($("#layerSelectDiv").is(":hidden")){
			showFrame("layerSelect");
		}else{
			hideFrame("layerSelect");
		}
		e.stopPropagation();
	});
	$("#search-input").click(function(e){
	    $('#search-input').autocomplete("enable");
        $("#resultDiv").hide();
        Gis.Map.clearAll();
        $("#mapResultDiv").hide();
	}).focus(function(){
        inputHasFocus = true;
    }).blur(function(){
        inputHasFocus = false;
    });
	$(document).on("click",function(e){
		if($(e.target).parents("#citySelectDiv").length == 0)
		{
			hideFrame("citySelect");
		}
		if($(e.target).parents("#layerSelectDiv").length == 0)
		{
			hideFrame("layerSelect");
		}
	});

	 $(document).keydown(function (e) {
        if (e.keyCode == 13) {
            hideFrame("citySelect");
            if(inputHasFocus){
                addressResolution($("#search-input").val(),"search");
            }
        }
    });
	$(document).on("click",".layerSelect-row li",function(){
		if($(this).hasClass("select")){
		    if($(this).hasClass("layerSelect-all-column")){
		        $(this).siblings().removeClass("select");
                var layer = [];
                for(var i=0;i<$(this).siblings().length;i++){
                    layer.push($($(this).siblings()[i]).attr("layer"));
                }
                Gis.Map.Event.changeLayer(layer,false);
		    }else{
                Gis.Map.Event.changeLayer([$(this).attr("layer")],false);
		    }
			$(this).removeClass("select");
		}else{
			if($(this).hasClass("layerSelect-all-column")){
				$(this).siblings().addClass("select");
				var layer = [];
				for(var i=0;i<$(this).siblings().length;i++){
                    layer.push($($(this).siblings()[i]).attr("layer"));
				}
				Gis.Map.Event.changeLayer(layer,true);
			}else{
                Gis.Map.Event.changeLayer([$(this).attr("layer")],true);
			}
			$(this).addClass("select");
		}
	});
	$(document).on("click",".citySelect-list li,#citySelect-popular li",function(){
        var area = JSON.parse($(this).attr("value"));
        $.ajax({
            url:_ctx+"/aia/area/citySelected",
            type:"POST",
            data:{areaId:area.areaId,cityName:area.name},
            success:function(result){
                if(result&&result.range){
                    if(result.bCityName){
                        bCityName = result.bCityName;
                    }else{
                        bCityName = area.name.replace("市","");
                    }
                    $("#citySelect-title").text("当前城市："+area.name);
                    $("#citySelect-show span").text(area.name);
                    cityName=area.name;
                    cityCode=area.zoneNumber.substr(0,4);
                    cityId = area.areaId;
                    $('#search-input').autocomplete("setOptions",{params:{cityId:cityId}});
                    cityCodeComp=area.zoneNumber;
                    if(Gis.Map.BMap){
                        Gis.Map.BMap.setCurrentCity(bCityName);
                    }
                    if(Gis.Map.AMap){
                        Gis.Map.AMap.setCity(cityName);
                    }
                    hideFrame("citySelect");
                    var obj = jsonTostr(result.range);
                    var extent = {};
                    var minLoc = GPS.mercator_decrypt(obj.ymin,obj.xmin);
                    var maxLoc = GPS.mercator_decrypt(obj.ymax,obj.xmax);
                    extent.xmin = minLoc.lon;
                    extent.ymin = minLoc.lat;
                    extent.xmax = maxLoc.lon;
                    extent.ymax= maxLoc.lat;
                    Gis.Map.setMapRange(extent);
                }
            }
        });
	});
	$(document).on("click","#citySelect-alphabetic-province li",function(){
		$("#citySelect-alphabetic-province").find("li.select").removeClass("select");
		$("#citySelect-province-list").find("dt[value="+$(this).text()+"]")[0].scrollIntoView(true);
		$(this).addClass("select");
	});
	$(document).on("click","#citySelect-alphabetic-city li",function(){
		$("#citySelect-alphabetic-city").find("li.select").removeClass("select");
		$("#citySelect-city-list").find("dt[value="+$(this).text()+"]")[0].scrollIntoView(true);
		$(this).addClass("select");
	});
	$(document).on("click",".mapResult-type li",function(){
	    $(this).siblings().removeClass("select");
	    $(this).addClass("select");
	    Gis.Query.poiType = $(this).attr("poiType");
        Gis.Query.queryMapClick(1);
    });
    $(document).on("click",".closeWindow",function(){
        $("#mapResultDiv").hide();
        Gis.Map.queryGraphics = [];
        Gis.Map.clearAll();
    });
	$(document).on("click",".mapResult-row",function(){
	    $(".mapResult-row").removeClass("select");
	    $(this).addClass("select");
	    var $reRow = $(".mapResult-row.select");
	    var reIndex = null;
        if($reRow&&$reRow.length>0){
            reIndex = $($reRow[0]).attr("index");
        }
        if(reIndex&&reIndex==$(this).attr("index")){
            var graphic = Gis.Map.queryGraphics[reIndex];
            Gis.Map.Oper.locationPoint(graphic,"mapClick");
            return;
        }
        Gis.Map.Oper.selectedQueryGraphic($(this).attr("index"),reIndex,"mapClick");
    });
	$(document).on("mouseout","#resultDiv .result-row",function(){
		$(this).removeClass("result-mouseover");
	});
	$(document).on("mouseover","#resultDiv .result-row",function(){
		$(this).addClass("result-mouseover");
	});
	$(document).on("click","#resultDiv .result-row",function(){
		var $img = $(this).find(".result-row-img");
		var $reImg = $(".result-row-img.row4,.result-row-img.row5,.result-row-img.row6");
		var reIndex = null;
		if($reImg&&$reImg.length>0){
			reIndex = $($reImg[0]).parents(".result-row").attr("index"); 
		}
		if(reIndex&&reIndex==$(this).attr("index")){
			for(var i=0;i<Gis.Map.queryGraphics.length;i++){
				var graphic = Gis.Map.queryGraphics[i];
				if(graphic.index==reIndex){
					Gis.Map.Oper.locationPoint(graphic,"search");
					break;
				}
			}
			return;
		}
		resultRowImgChange();
		if($img.is(".row1")){
			$img.removeClass("row1");
			$img.addClass("row4");
		}
		if($img.is(".row2")){
			$img.removeClass("row2");
			$img.addClass("row5");
		}
		if($img.is(".row3")){
			$img.removeClass("row3");
			$img.addClass("row6");
		}
		Gis.Map.Oper.selectedQueryGraphic($(this).attr("index"),reIndex,"search");
	});
	$(document).on("click","#mapResult-list .mapResultListItems",function(){
        var $reImg = $("#mapResult-list .flag.select");
        var reIndex = null;
        if($reImg&&$reImg.length>0){
            reIndex = $($reImg[0]).parents(".mapResultListItems").attr("index");
        }
        if(reIndex&&reIndex==$(this).attr("index")){
            for(var i=0;i<Gis.Map.queryGraphics.length;i++){
                var graphic = Gis.Map.queryGraphics[i];
                if(graphic.index==reIndex){
                    Gis.Map.Oper.locationPoint(graphic,"mapClick");
                    break;
                }
            }
            return;
        }
        $(this).siblings().find(".flag").removeClass("select");
        $(this).siblings().removeClass("select");
        $(this).find(".flag").addClass("select");
        $(this).addClass("select");
        Gis.Map.Oper.selectedQueryGraphic($(this).attr("index"),reIndex,"mapClick");
    });

    $(document).on("click",".pageList li",function(){
        var pageCount = $(".pageList ul").attr("pageCount");
        if(!pageCount){
            return;
        }
        var currentPage = Number($(".pageList ul").attr("currentPage"));
        var pageCount = Number(pageCount);
        var val = $(this).attr("class");
        if(val=="top"){
            if(currentPage!=1){
                Gis.Query.queryMapClick(1);
            }
        }else if(val=="up"){
            if(currentPage>1){
                Gis.Query.queryMapClick(currentPage-1);
            }
        }else if(val=="down"){
            if(currentPage<pageCount){
                Gis.Query.queryMapClick(currentPage+1);
            }
        }else if(val=="tail"){
            if(currentPage!=pageCount){
                Gis.Query.queryMapClick(pageCount);
            }
        }
    });

	$("#mapType").mouseenter(function(){
        if (_a_timer != null) {
            clearTimeout(_a_timer);
        }
        $("#mapType-wrapper").addClass("expand");
        $("#mapShow").hide();
    });
    $("#mapType").mouseleave(function(){
        _a_timer=setTimeout(function(){
            $("#mapType-wrapper").removeClass("expand");
            $("#mapShow").show();
        }, 400);
    });
    $("#mapType div").click(function() {
        $("#mapType div").each(function(){
            $(this).removeClass("active");
        });
        $(this).addClass("active");
        var mapType = Number($(this).attr("mapType"));
        var url = $(this).css("background-image");
        $("#mapShow").css("background-image", url);
        $("#mapShow span").text(Gis.Map.ARR_MAP_CLASS[mapType]);
        Gis.Map.Event.changeMap(mapType);
    });

	
	function resultRowImgChange(){
		$(".result-row-img.row4").addClass("row1");
		$(".result-row-img.row5").addClass("row2");
		$(".result-row-img.row6").addClass("row3");
		$(".result-row-img").removeClass("row4");
		$(".result-row-img").removeClass("row5");
		$(".result-row-img").removeClass("row6");
	}

} 

function addressResolution(address,type){
    $('#search-input').autocomplete("disable");
    $("#mapResultDiv").hide();
    if(address.length>0){
        $("#resultDiv").hide();
        $("#search-img").hide();
        $("#search-loading").show();
        $.ajax({
            url:_ctx+"/cim/info",
            type:"POST",
            data:{type:'land',qType:'key',
                    cityId:cityId,qParam:address},
            success:function(result){
                Gis.Map.queryGraphics = [];
                if(result){
                    $("#resultDiv").empty();
                    var index = 1;
                    if(result.address.status==200||result.address.status==-1){
                        var data = result.address.data;
                        var $title = $("#template-div .result-title.title1").clone();
                        $title.text("地址解析");
                        $("#resultDiv").append($title);
                        var $row = $("#template-div .result-row.row1").clone();
                        var name = null;
                        if(data.splitData){
                            name = formattedName(data.splitData);
                        }else{
                            name = formattedName(data);
                        }
                        var address = formattedAddress(data);
                        $row.attr("index",index);
                        $row.find(".result-row-img").text(index);
                        $row.find(".result-row-name").text(name);
                        $row.find(".result-row-address").text(address);
                        $("#resultDiv").append($row);
                        Gis.Map.queryGraphics.push({index:index,name:name,address:address,type:1,lng:data.lng,lat:data.lat});
                        index+=1;

                    }
                    if(result.poi&&result.poi.status==200){
                        var $title = $("#template-div .result-title.title2").clone();
                        $title.text("POI");
                        $("#resultDiv").append($title);
                        for(var i=0;i<result.poi.data.length;i++){
                            var item = result.poi.data[i];
                            var $row = $("#template-div .result-row.row2").clone();
                            $row.attr("index",index);
                            $row.find(".result-row-img").text(index);
                            $row.find(".result-row-name").text(item.name);
                            $row.find(".result-row-address").text(item.address);
                            $("#resultDiv").append($row);
                            Gis.Map.queryGraphics.push({index:index,name:item.name,address:item.address,type:2,lng:item.lng,lat:item.lat});
                            index+=1;
                            if(i==3){
                                break;
                            }
                        }
                    }
                    if(result.internet&&result.internet.status==200){
                        var $title = $("#template-div .result-title.title2").clone();
                        $title.text("互联网搜索结果");
                        $("#resultDiv").append($title);
                        for(var i=0;i<result.internet.data.length;i++){
                            var item = result.internet.data[i];
                            var $row = $("#template-div .result-row.row3").clone();
                            $row.attr("index",index);
                            $row.find(".result-row-img").text(index);
                            $row.find(".result-row-name").text(item.name);
                            $row.find(".result-row-address").text(item.address);
                            $("#resultDiv").append($row);
                            Gis.Map.queryGraphics.push({index:index,name:item.name,address:item.address,type:3,lng:item.lng,lat:item.lat});
                            index+=1;
                        }
                    }
                    if(index>1){
                        $("#search-img").show();
                        $("#search-loading").hide();
                        $("#resultDiv").slideDown();
                    }
                }
                Gis.Show.loadQueryGraphics(true,"search");
            }
        });
    }
}

function initAutoSearch(){
	//自动like列表
 	$('#search-input').autocomplete({
 		serviceUrl : _ctx+'/cim/nav',
		noCache : true,
		type:"GET",
		params:{cityId:cityId},
		paramName : 'key',
		matchContains : true,
		triggerSelectOnValidInput : false,
		transformResult : function(response) {
			return {
				suggestions : $.map($.parseJSON(response), function(
								dataItem) {
							return {
								value : dataItem.full_name,
								data : dataItem.address_id
							};
						})
			}; 
		},
		onSelect : function(suggestion) {
			addressResolution(suggestion.value,suggestion.data);
		},
		onSearchStart : function(){
		    $("#resultDiv").hide();
            Gis.Map.clearQueryGraphics();
		}
	});
}

function initAnalysisResult(){
	$("#analysisResult-table").bootstrapTable({
        url: 'http://127.0.0.1:11004/testBatchAddressResolution',
        dataType: "json",
        pageSize: 10,
        pageNumber: 1,
        method: 'post',
        sidePagination: 'server',
        cache: false,
        pagination: true,
        showRefresh: false,
        showColumns: false,
        pageList:[10],
		height:310,
        columns: [
            {
                title: '原始地址',
                field: 'address',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '拆分(X市-区(县)-街道办(乡镇)-路街-路牌号-村-小区-楼栋-单元-楼层-户室)',
                field: 'address',
                align: 'center',
                valign: 'middle',
				formatter:function(value,row,index){
					return formattedAddress(row);
				}
            },
			{
                title: '地块匹配',
                field: 'lots',
                align: 'center',
                valign: 'middle'
            },
			{
                title: '小区匹配',
                field: 'community',
                align: 'center',
                valign: 'middle'
            },
			{
                title: '楼栋匹配',
                field: 'building',
                align: 'center',
                valign: 'middle'
            },
			{
                title: '单元匹配',
                field: 'unit',
                align: 'center',
                valign: 'middle'
            },
			{
                title: '楼层匹配',
                field: 'floor',
                align: 'center',
                visible: false,
                valign: 'middle'
            },
			{
                title: '户室匹配',
                field: 'house',
                align: 'center',
                valign: 'middle'
            },
			{
                title: '定位',
                field: 'address',
                align: 'center',
                valign: 'middle'
            }]
    });
}

function initCitySelect(){
	$.ajax({
		url:_ctx+"/aia/area/findProvinceAndCity",
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
						codeHead = provinceData[i].code.substr(0, 1);
						html +='<dt value="'+codeHead+'">'+provinceData[i].name+'：</dt>';
						html +='<dd>';
						provinceCodeHeadArray.push(codeHead);
					}else{
						if(codeHead!=provinceData[i].code.substr(0, 1)){
							codeHead = provinceData[i].code.substr(0, 1);
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
		url:_ctx+"/aia/area/findCityList",
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

function loadPageList(response){
    $(".pageList ul").attr("pageCount",response.pageCount);
    $(".pageList ul").attr("currentPage",response.currentPage);
    $(".pageList .dot").text(response.currentPage+"/"+response.pageCount);
}

function formattedName(data){
	if(data.house){
		return data.house;
	}
	if(data.floor){
		return data.floor;
	}
	if(data.unit){
		return data.unit;
	}
	if(data.building){
		return data.building;
	}
	if(data.community){
		return data.community;
	}
	if(data.village){
		return data.village;
	}
	if(data.roadNo){
		return data.roadNo;
	}
	if(data.road){
		return data.road;
	}
	if(data.street){
		return data.street;
	}
	if(data.district){
		return data.district;
	}
	return data.city;
}

function formattedAddress(data){
	var str = data.city;
	if(data.district){
		str +="-"+data.district;
	}
	if(data.street){
		str +="-"+data.street;
	}
	if(data.community){
		str +="-"+data.community;
	}
	if(data.building){
		str +="-"+data.building;
	}
	if(data.unit){
		str +="-"+data.unit;
	}
	if(data.floor){
		str +="-"+data.floor;
	}
	if(data.house){
		str +="-"+data.house;
	}
	return str;
}

window.onresize=function(){  
	reMapSize();
}  

function showFrame(id){
	iFMapResultDivShow=false;
	$("#"+id+"-show").addClass("select");
	$("#"+id+"-show").find("img").attr("src","/static/images/more1.png");
	$("#"+id+"Div").show();
	if(id=="layerSelect"&&!$("#mapResultDiv").is(":hidden")){
        iFMapResultDivShow=true;
	    $("#mapResultDiv").hide();
	}
}

function hideFrame(id){
	$("#"+id+"-show").removeClass("select");
	$("#"+id+"-show").find("img").attr("src","/static/images/more.png");
	$("#"+id+"Div").hide();
	if(id=="layerSelect"&&iFMapResultDivShow==true){
        $("#mapResultDiv").show();
	}
}

function reMapSize(){
    $('#div_main').width($(window).width());
    $('#div_main').height($(window).height());
    $('#gxdMap').width($(window).width());
    $('#gxdMap').height($(window).height());
    $('#resultDiv').css("max-height",$(window).height()-80-67);
    $("#mapResultDiv").height($(window).height()-155);
    $("#mapResult-list").height($(window).height()-375);
	Gis.Map.gxdMap.resize(true);
	Gis.Map.gxdMap.reposition();
}

function getAttr(name){
    var attr = "";
    switch(name){
    case "loop":
      attr = "OBJECTID,NAME,REMARK";
      break;
    case "plate":
      attr = "OBJECTID,PRECINCT_ID,LABEL,PRECINCT_TYPE,AREA_ID";
      break;
    case "trade":
      attr = "ADDRESS_ID,LABEL,REMARK";
      break;
    case "school":
      attr = "ADDRESS_ID,LABEL,REMARK";
      break;
    case "doorway":
      attr = "ADDRESS_ID,LABEL,REMARK";
      break;
    }
    return attr;
}
function isNull(str){
	if(!str){
		return "";
	}else if(str==null){
		return "";
	}else if(str=="null"){
		return "";
	}else if(str==undefined){
		return "";
	}else if(str=="undefined"){
		return "";
	}
	return str
}
