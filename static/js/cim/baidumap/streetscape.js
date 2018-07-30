
	var baiduPanorama = null;
	
	function init() {
		//初始化百度地图对象
		baiduPanorama = new BMap.Panorama('baiduMap', {
			albumsControl: false //默认为不显示相册控件，默认值为false
		});
		baiduPanorama.setPov({heading: -20, pitch: 6});
	}
	
	/**
	 * 按照地址点的横纵坐标查看街景
	 * @param maxx 横坐标
	 * @param miny 纵坐标
	 * */
	function viewStreetByPosition(maxx, miny) {
		$("#loading_panel").css("display", "block");//显示loading动画
		//通过百度api将横纵坐标转换为经纬度后，查看指定经纬度的街景
		getBaiduTranCoords(maxx, miny, function(lng, lat) {
			baiduPanorama.setPosition(new BMap.Point(lng, lat));
			$("#loading_panel").css("display", "none");//隐藏loading动画
		});
	}
	
	/**
	 * 按照地址点的横纵坐标查看街景
	 * @param maxx 横坐标
	 * @param miny 纵坐标
	 * */
	function viewStreetByPosition2(maxx, miny) {
		$("#loading_panel").css("display", "block");//显示loading动画
		var ggPoint = new BMap.Point(maxx, miny);
		var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, function (data){
        	$("#loading_panel").css("display", "none");//隐藏loading动画
            if(data.status === 0) {
            	showStreetViewNow(data.points[0]);
            }
        });
	}
	
	function showStreetViewNow(pnt) {
		if (baiduPanorama == null) {
			//初始化百度地图对象
			baiduPanorama = new BMap.Panorama('baiduMap', {
				albumsControl: false //默认为不显示相册控件，默认值为false
			});
			baiduPanorama.setPov({heading: -20, pitch: 6});
		}
		
		baiduPanorama.setPosition(pnt);
	}
	