<%@ page language="java" import="java.util.*"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String api_bd_url = "api.map.baidu.com";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  	<base href="<%=basePath%>">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<%@include file="/common/jquery_include.jsp"%>
	<script src="module/baidumap/js/common.js"></script>
	<script src="module/baidumap/infowindow.js"></script>
	<link rel="stylesheet" type="text/css" href="module/baidumap/css/common.css"/>
	<style type="text/css">
		#infowindow_header{ height:30px; background-color: #F9F9F9; border-bottom: 1px solid #CCCCCC; }
		#fav_collect { float:right; width:50px; height:30px; line-height:30px; font-size:12px; color:#3385FF; cursor:pointer; }
		#fav_collect_img { float:left; margin:9px 3px 0px 0px; width:12px; height:12px; background: url(module/baidumap/images/fav_img_unchecked.png) no-repeat; }
		#close_btn { float:right; margin-right:10px; height:12px; width:12px; margin-top:9px; background:url(module/baidumap/images/close_btn2.png) no-repeat; cursor:pointer; }
		#close_btn:hover { background:url(module/baidumap/images/close_btn_hover2.png) no-repeat; }
		
		#infowindow_base { margin:10px 0px; }
		#info_name { float:left; margin-left:10px; height:30px; width:170px; line-height:30px; font-size:14px; font-weight:700; color:#4C4C4C; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
		#infowindow_detail { float:left; margin-left:10px; color:#3385FF; line-height:30px; font-size:12px; cursor:pointer; }
		#infowindow_detail:hover { text-decoration:underline; }
		#infowindow_photo { position:relative; margin:0px 10px; height:100px; cursor:pointer; }
		.infowindow-text { margin:4px 0px 4px 15px; width:330px; line-height:16px; color:#737373; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
		
		#bottom_bar { border-top:1px solid #DADADA; padding:10px 0px 15px 0px; overflow:hidden; }
		.bottom-btn { float:left; margin-left:10px; height:26px; line-height:26px; padding:0px 8px; cursor:pointer; background-color:#F8F9FC; border:1px solid #CCCCCC; font-size:12px; color:#666666; }
		.bottom-btn:hover { border-color:#0072E9; color:#0072E9; }
		.bottom-btn-img { float:left; margin:7px 3px 0px 0px; width:12px; height:12px; }
	</style>
  </head>
  <body style="overflow:hidden;">
	<div id="infowindow_header">
		<div id="info_name"></div>
		<div id="infowindow_detail">周边详情&gt;&gt;</div>
		<div id="close_btn"></div>
		<div id="fav_collect" title="加入收藏夹"><div id="fav_collect_img"></div>收藏</div>
	</div>

	<div id="infowindow_base">
		<div id="infowindow_photo">
			<div style="position:absolute; height:20px; left:0; right:0px; bottom:0; background-color:#000000; opacity:0.6; filter:alpha(opacity=60);"></div>
			<div style="position:absolute; left:13px; bottom:0px; line-height:20px; color:#FFFFFF; font-size:12px;">查看街景&gt;&gt;</div>
		</div>
		<div id="info_address" class="infowindow-text"></div>
		<div id="info_phone1" class="infowindow-text"></div>
		<div id="info_phone2" class="infowindow-text"></div>
	</div>
	
	<div id="bottom_bar">
		<div id="evaluate_btn" class="bottom-btn">
			<span class="bottom-btn-img" style="background:url(module/baidumap/images/evaluate_btn.png) no-repeat;"></span>评估
		</div>
		<div id="compare_select_btn" class="bottom-btn">
			<span class="bottom-btn-img" style="background:url(module/baidumap/images/add_btn.png) no-repeat;"></span>对比
		</div>
		<div id="around_btn" class="bottom-btn">
			<span class="bottom-btn-img" style="background:url(module/baidumap/images/around_btn.png) no-repeat;"></span>搜索周边
		</div>
	</div>
	<!-- 此图片标签用于校验地址的全景图片是否可以被访问到，如果不能被访问到，则触发此img对象的error事件，在error事件的监听器中进行实际操作，此img对象不显示 -->
	<img id="verify_img" style="display:none;"/>
  </body>
</html>

