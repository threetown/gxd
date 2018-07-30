<%@ page language="java" import="java.util.*" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  	<head>
  	<base href="<%=basePath%>">
  	
 	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=Mk4mQWAtoQdwCe9VwUH3MND24eAoOFFH"></script>
	<link rel="stylesheet" type="text/css" href="module/baidumap/css/common.css"/>
	
	<%@include file="/common/jquery_include.jsp"%>
	<script src="module/baidumap/js/common.js"></script>
	<script src="module/baidumap/streetscape.js"></script>
  </head>
  	<style>
  		body, html, #baiduMap { width:100%; height:100%; overflow:hidden; margin:0; }
  		#baiduMap .pano_close { display:none; }/**隐藏百度地图自带的退出全景按钮*/
  		#loading_panel { position:absolute; top:0px; left:0px; right:0px; bottom:0px; background-color:#FFFFFF; display:none; }
  	</style>
  <body onload="init();">
	<div id="baiduMap"></div><!-- 百度地图对象，其本身隐藏，只用于进行接近查询 -->
	<div id="loading_panel">
		<div style="width:100px; height:20px; background:url(module/baidumap/images/loading.gif) no-repeat; margin:0 auto; margin-top:220px;"></div>
	</div>
  </body>
</html>
