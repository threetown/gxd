	var MAP_ID = "";//全局变量，记录此页面对应的infowindow对象所在的子地图id
	var PARAM = new Object();//全局变量，记录此页面对应的地址对象信息

	$(function() {
		addListeners();//增加事件监听
	});
	
	/**
	 * 配置页面
	 * @param mapId 此页面对应的infowindow对象所在的子地图id
	 * @param param 此页面对应的地址对象信息
	 * */
	function configInfoPage(mapId, param) {
		//将传递的参数记录在全局变量中
		MAP_ID = mapId;
		PARAM = param;
		
		$("#info_name").html(PARAM.NAME);//设置对象名称
		$("#info_name").attr("title", PARAM.NAME);
		setFavBtnImage();//根据对象的收藏情况，设置其收藏按钮的样式
		$("#infowindow_photo").attr("title", PARAM.NAME);
		$("#info_address").html(PARAM.ADDRESS);//设置对象地址
		$("#info_address").attr("title", PARAM.ADDRESS);
		$("#info_phone1").html(PARAM.PHONE1);//设置对象电话号码
		$("#info_phone2").html(PARAM.PHONE2);
		
		//渠道地区
		if(PARAM.BUREAU_NAME != "") {
			$("#infowindow_base").append('<div id="bureau_id" class="infowindow-text" >'+bureauname+'</div>');
		}
		//根据对象的坐标获取其百度全景图片
		getBaiduTranCoords(PARAM.MAXX, PARAM.MINY, function(lng, lat) {
			//不同尺寸的全景图片
			var largeImg = "http://"+api_bd_url+"/panorama?width=340&height=180&location="+lng+','+lat+"&fov=180&ak=RWxkHbUjEZxGG2GhVDa9Cpfy";
			var smallImg = "http://"+api_bd_url+"/panorama?width=80&height=60&location="+lng+','+lat+"&fov=180&ak=RWxkHbUjEZxGG2GhVDa9Cpfy";

			$("#verify_img").attr("src", largeImg);//校验全景图片是否加载成功
			$("#infowindow_photo").css("background", "url("+largeImg+") no-repeat");//设置图片路径
			PARAM.img = smallImg;
		});
		
		//页面初始化完成后，重新定义该页面所在的infowindow对象的尺寸
		var windowBody = parent.getInfoWindowBody(MAP_ID);//获取所在的infowindow的infowindow-body对象
		var bodyHeight = $("#infowindow_header").outerHeight(true)
			+ $("#infowindow_base").outerHeight(true) + $("#bottom_bar").outerHeight(true);
		var bodyWidth = $("#infowindow_header").outerWidth(true);
		windowBody.height(bodyHeight);
		windowBody.width(bodyWidth);
	}

	/**
	 * 添加事件监听
	 * @author wangqi
	 * @since 2015/7/30
	 * */
	function addListeners() {
		//收藏按钮的点击事件
		$("#fav_collect").click(function(event) {
			if(getHasFavourite()) {
				//调用收藏页面中的删除收藏函数
				parent.parent.getTabPageByBtnId("user").contentWindow
					.document.getElementById("tab_page1").contentWindow.deleteFavourite({
					x: PARAM.MAXX,//被收藏的对象的横轴坐标
					y: PARAM.MINY//被收藏的对象的纵轴坐标
				}, true);
				setFavBtnImage();//根据对象的收藏情况，设置其收藏按钮的样式
			}else {
				//调用收藏页面中的添加收藏函数
				parent.parent.getTabPageByBtnId("user").contentWindow
					.document.getElementById("tab_page1").contentWindow.addFavourite({
					x: PARAM.MAXX,//被收藏的对象的横轴坐标
					y: PARAM.MINY,//被收藏的对象的纵轴坐标
					name: PARAM.NAME,//地址名称
					address: PARAM.ADDRESS,//地址
					img: PARAM.img,//对象图片路径
					date: new Date().format("yyyy/MM/dd")//收藏事件
				}, true);
				setFavBtnImage();//根据对象的收藏情况，设置其收藏按钮的样式
			}
		});
		
		//监听关闭按钮的点击事件
		$("#close_btn").click(function() {
			var map = parent.getMapById(MAP_ID);//获取此infowindow所在的map对象
			parent.hideInfoWindow(map);//关闭infowindow
		});
		
		//点击查看街景
		$("#infowindow_photo").click(function() {
		    //杭州需屏蔽
			parent.viewStreetByPosition(PARAM.MAXX, PARAM.MINY);
		});
		//评估按钮点击事件
		$("#evaluate_btn").click(function() {
			parent.parent.evaluate(11, "", PARAM);//调用主页面中的评估方法
		});
	    //对比按钮点击事件
	    $("#compare_select_btn").click(function(event) {
			//根据页面的嵌套关系和触发点击事件的坐标值获取点击事件触发点相对主页面的坐标值
			var mainPageX = parent.parent.$("#bdmap").offset().left + parent.getInfoWindowBody(MAP_ID).offset().left + event.pageX;
			var mainPageY = parent.parent.$("#bdmap").offset().top + parent.getInfoWindowBody(MAP_ID).offset().top + event.pageY;
	    	//调用主页面中的增加对比项函数
			parent.parent.addCompare(mainPageX, mainPageY, {
				x: PARAM.MAXX,//被收藏的对象的横轴坐标
				y: PARAM.MINY,//被收藏的对象的纵轴坐标
				name: PARAM.NAME,//地址名称
				address: PARAM.ADDRESS,//地址
				img: PARAM.img//对象图片路径
			});
	    });
	    //搜索周边按钮点击事件
	    $("#around_btn").click(function() {
	    	parent.parent.setAroundCenterPoint(PARAM);//调用主页面中的设置周边搜索中心点方法
	    });
	    
	    //监听校验图片对象的error事件
		$("#verify_img").error(function() {
			//当图片加载失败时，将全景图片设置为默认图片
			$("#infowindow_photo").css("background", "url(../../image/default_addr_large.png) no-repeat");
			PARAM.img = "../../image/default_addr_small.png";
		});
		/**
		 * 地址详情点击事件
		 */
	    $("#infowindow_detail").click(function() {
	    	parent.parent.getAddrDtail({
				x: PARAM.MAXX,//被收藏的对象的横轴坐标
				y: PARAM.MINY,//被收藏的对象的纵轴坐标
				name: PARAM.NAME,//地址名称
				address: PARAM.ADDRESS,//地址
				img: PARAM.img,//对象图片路径
				date: new Date().format("yyyy/MM/dd")//收藏事件
			});//调用主页面中的设置周边搜索中心点方法
	    });
		
	}
	
	/**
	 * 判断当前infowindow记录的对象是否已经被收藏
	 * @author wangqi
	 * @since 2015/8/18
	 * */
	function getHasFavourite() {
		var status = false;
		//从cookie中获取记录的收藏列表
		var favList = parent.parent.getTabPageByBtnId("user").contentWindow
			.document.getElementById("tab_page1").contentWindow.getCookieFavList();
		for(var i=0; i<favList.length; i++) {//迭代收藏列表
			//若当前infowindow中记录的对象与收藏列表中的某一项的横纵坐标一致，则说明该对象已经被收藏
			if(favList[i].x==PARAM.MAXX && favList[i].y==PARAM.MINY) {
				status = true;
			}
		}
		return status;
	}

	/**
	 * 根据当前infowindow对应的地址对象的收藏情况设置其收藏按钮的背景图片
	 * @author wangqi
	 * @since 2015/8/19
	 * */
	function setFavBtnImage() {
		$("#fav_collect_img").css("background", 
			"url("+(getHasFavourite() ? "../../image/fav_img_checked.png" : "../../image/fav_img_unchecked.png")+") no-repeat");
	}