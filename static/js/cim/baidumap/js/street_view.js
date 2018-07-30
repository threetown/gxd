	/************************************************
	 * 此js文件记录map.jsp中街景功能相关的所有代码
	 ************************************************/
	/**
	 * 初始化街景功能相关的组件
	 * */

	var mapDiv = null;
	var map = null;
	var mapClickHandler = null;
	
	function initStreetViewDom() {
		
		//监听卫星地图和街景切换按钮的鼠标经过事件
		$(".map-switch-btn").mouseover(function() {
			$(this).find(".map-switch-text").css("color", "#FFFFFF");
			$(this).find(".map-switch-text").css("background-color", "#0C88E8");
		}).mouseout(function() {
			if(!($(this).attr("id")=="street_view_btn" && $(this).attr("is-street-mode")=="true")) {
				$(this).find(".map-switch-text").css("color", "#666666");
				$(this).find(".map-switch-text").css("background-color", "#FFFFFF");
			}
		});
		//监听街景切换按钮的点击事件
		$("#street_view_btn").click(function() {
			if($(this).attr("is-street-mode") == "false") {//切换到街景模式
				map = getCurrentMap();//获取当前显示的地图对象
				mapDiv = $("#"+$("#map_list").attr("current-map"));//获取当前显示的子地图对象所在的div对象
				mapDiv.bind('mousemove', streetViewMouseOver);//绑定mousemove事件
				mapDiv.bind('mousedown', streetViewRightClick);//绑定鼠标右键点击事件
		    	map.setMapCursor("pointer");//将鼠标箭头变为链接状手
		    	$(this).attr("is-street-mode","true");
			}else if($(this).attr("is-street-mode") == "true") {//切换回普通模式
				cancelStreetView();
			}
		});
		//监听卫星地图切换按钮的点击事件
		$("#normal_3d_switch_btn").click(satelliteMapBtnClick);
		
		//街景窗口的放大和缩小
		$("#street_view_title").dblclick(changeStreetWinSize);
		//监听街景关闭按钮的点击事件
		$("#street_win_close").click(function() {
			$("#street_view_win").css("display", "none");
		});
		//街景窗口的放大和缩小
		$("#street_win_resize").click(changeStreetWinSize);
	}
	
	/**
	 * 初始化街景功能相关的组件
	 * */
	function initStreetViewDom4Others() {
		mapDiv = $("#privateMap");
		map =  gxdobj.gmap;//获取当前显示的地图对象
		m_isStreetMode = "false";
		//街景窗口的放大和缩小
		$("#street_view_title").dblclick(changeStreetWinSize);
		//监听街景关闭按钮的点击事件
		$("#street_win_close").click(function() {
			$("#street_view_win").css("display", "none");
		});
		//街景窗口的放大和缩小
		$("#street_win_resize").click(changeStreetWinSize);
	}
	
	/**
	 * 在街景模式下，绑定mouseover事件
	 * */
	function streetViewMouseOver(event) {
		$("#street_view_mouse").css("display", "block");
		$("#street_view_mouse").offset({top:event.pageY-35, left:event.pageX-25});
	}
	
	/**
	 * 街景模式下，在地图中点击鼠标右键时，取消街景模式
	 * */
	function streetViewRightClick(event) {
		if(3 == event.which) {
			//不显示默认的右键菜单
			$(this).bind('contextmenu',function(e) {
				return false;  
			});
			cancelStreetView();//取消街景模式
		}
	}
	
	/**
	 * 取消街景模式
	 * */
	function cancelStreetView() {
		
		$("#street_view_mouse").css("display", "none");//隐藏跟随在鼠标上的图片
		mapDiv.unbind('mousemove', streetViewMouseOver);//解除mousemove事件的绑定
		mapDiv.unbind('mousedown', streetViewRightClick);//解除鼠标右键点击事件的绑定
    	map.setMapCursor("default");//将鼠标箭头变为默认状态
		
    	$("#street_view_btn").find(".map-switch-text").css("color", "#666666");
    	$("#street_view_btn").find(".map-switch-text").css("background-color", "#FFFFFF");
    	$("#street_view_win").css("display", "none");//隐藏街景窗口
    	
    	try {
    		gxdobj.streetlayer.clear();
    		gxdobj.isStreetMode = false;
        	
        	if (mapClickHandler != null) {
    			dojo.disconnect(mapClickHandler);
    		}
    	} catch(e) {
    		$("#street_view_btn").attr("is-street-mode", "false");
    	}
	}
	
	/**
	 * 根据地址对象的横纵坐标查看街景
	 * @param maxx 横坐标
	 * @param miny 纵坐标
	 * */
	function viewStreetByPosition(maxx, miny) {
		$("#street_view_win").css("display", "block");//显示街景窗口
		document.getElementById("street_view_page").contentWindow.viewStreetByPosition(maxx, miny);//调用街景子页面中的查看街景方法
	}
	
	/**
	 * 根据地址对象的横纵坐标查看街景
	 * @param maxx 横坐标
	 * @param miny 纵坐标
	 * */
	function viewStreetByPosition2(maxx, miny) {
		$("#street_view_win").css("display", "block");//显示街景窗口
		document.getElementById("street_view_page").contentWindow.viewStreetByPosition2(maxx, miny);//调用街景子页面中的查看街景方法
	}
	
	/**
	 * 卫星地图切换按钮的点击事件
	 * */
	function satelliteMapBtnClick() {
		var maps = getMapObjects();//获取所有子地图对象
		if($("#normal_3d_switch_text").html() == "卫星") {//切换为卫星地图
			for(var i=0; i<maps.length; i++) {
				var layerIds = maps[i].layerIds;
				for(var j=0; j<layerIds.length; j++) {//迭代子地图对象中的图层id数组
					var layer = maps[i].getLayer(layerIds[j]);
					switch(layer.url) {
						case "Vector": layer.setVisibility(false); break;
						case "Image": layer.setVisibility(true); break;
						case "POI": layer.setVisibility(true); break;
						default: break;
					}
				}
			}
			$(this).css("background", "url(/static/js/aia/baidumap/images/normal_map.png) no-repeat");
			$("#normal_3d_switch_text").html("地图");
		}else {//切换为普通地图
			for(var i=0; i<maps.length; i++) {
				var layerIds = maps[i].layerIds;
				for(var j=0; j<layerIds.length; j++) {//迭代子地图对象中的图层id数组
					var layer = maps[i].getLayer(layerIds[j]);
					switch(layer.url) {
						case "Vector": layer.setVisibility(true); break;
						case "Image": layer.setVisibility(false); break;
						case "POI": layer.setVisibility(false); break;
						default: break;
					}
				}
			}
			$(this).css("background", "url(/static/js/aia/baidumap/images/3D_map.png) no-repeat");
			$("#normal_3d_switch_text").html("卫星");
		}
	}

	/**
	 * 最大化或缩小街景窗口
	 * */
	function changeStreetWinSize() {
		if($("#street_win_resize").attr("type") == "max") {
			$("#street_win_resize").attr("type", "narrow");
			$("#street_view_win").animate({top:50, left:50, bottom:50, right:100}, "fast", "swing");
			$("#street_win_resize").css("background", "url(/static/js/aia/baidumap/images/window_maximum.png) no-repeat");
			$("#street_win_resize").attr("title", "最大化");
		}else if($("#street_win_resize").attr("type") == "narrow") {
			$("#street_win_resize").attr("type", "max");
			$("#street_view_win").animate({top:0, right:0, bottom:0, left:0}, "fast", "swing");
			$("#street_win_resize").css("background", "url(/static/js/aia/baidumap/images/window_narrow.png) no-repeat");
			$("#street_win_resize").attr("title", "缩小");
		}
	}
	