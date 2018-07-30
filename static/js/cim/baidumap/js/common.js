// 组织请求URL,拼接用户信息
function getURL(url) {
	return _contextPath + "/" + url;
}

/**
 * 兼容array的indexOf方法
 * */
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt) {
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;
		for (; from < len; from++) {
			if (from in this &&  this[from] === elt)
				return from;
		}
		return -1;
	};
}

/**
 * Date类数据增加format函数
 * */
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}
 

/**
 * 监听document的点击事件，如果调用此方法的页面是main.jsp中的分页，则使main.jsp中的下拉框隐藏
 * */
$(document).click(function() {
	if(parent && parent.hideInputRecordPanel) {
		parent.hideInputRecordPanel();
	}
});

/**
 * 通过百度api转换经纬度
 * @paramlng 传递的经度
 * @paramlat 传递的纬度
 * @param callback 回调函数，函数有两个参数，分别为经度和纬度
 * */
function getBaiduTranCoords(paramlng, paramlat, callback) {
    var TRANPARAM = 1.19432856685505;  //地图转换参数
	paramlng = parseFloat(paramlng)/TRANPARAM;
	paramlat = parseFloat(paramlat)/TRANPARAM;
	$.ajax({
		type: 'GET',
		data: { coords: paramlng+","+paramlat,
			from: 6,
			to: 5,
			ak: 'A9vLXzKR6UsNM5KEcR8Z2hI4'
		},
		dataType: "JSONP",
		url: "http://"+api_bd_url+"/geoconv/v1/", //调百度坐标转换接口  
		success: function(resultData) {
			callback(resultData.result[0].x, resultData.result[0].y);//将转换完的经纬度传递到回调函数中
		},
		error: function(resultData) {
			//网络连接失败
		}
	});
}

/**
 * 设置cookie属性
 * @param name cookie属性名
 * @param value cookie属性值
 * @param hours cookie过期时间
 * @param path cookie的保存目录，默认为根目录
 * */
function setCookie(name, value, hours, path, domain, secure) {
	var cdata = name + "=" + escape(value);
	if(hours) {
		var d = new Date();
		d.setHours(d.getHours() + hours);
		cdata += "; expires=" + d.toGMTString();
	}
	cdata += path ? ("; path=" + path) : "; path=/" ;
	cdata += domain ? ("; domain=" + domain) : "" ;
	cdata += secure ? ("; secure=" + secure) : "" ;
	document.cookie = cdata;
}

/**
 * 根据cookie属性名获取对应的属性值
 * @param name cookie属性名
 * */
function getCookie(name) {
	var reg = eval("/(?:^|;\\s*)" + name + "=([^=]+)(?:;|$)/");
	return reg.test(document.cookie) ? unescape(RegExp.$1) : "";
}

/**
 * 清除指定的cookie属性
 * 
 * */
function removeCookie(name, path, domain) {
	setCookie(name, "", -1, path, domain);
}
/**
 * 检查因子对应的图片是否存在
 * @return
 */
function checkHasImg(data){
	var isExit =false;
	$.ajax({
		type : 'GET',
		async: false,
		data : {},
		url : "/static/js/cim/baidumap/images/factor/list/list_factor_"+data.factorId+".png",
		success : function(resultData) {
			isExit =true;
		},
		error : function(result) {
			isExit=false;
		}
	});
	return isExit;
}