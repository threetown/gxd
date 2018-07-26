//页面初始化方法
$(function(){
	//$("") jquery 选择器，与 CSS 选择器一样 

	//方法有参数为设置，无参数为获取 比如 
	//选择ID为 div_main  
	//获取宽度
	var width = $("#div_main").width();
	//设置高度  PX
	$("#div_main").height(1000);
	//获取整个窗口宽度 
	$(window).width();
	//获取整个窗口高度
	$(window).height();
	$(".coment-left").height($(window).height()-74);
	$(".coment-right").height($(window).height()-40);

    layui.use(['layer'], function(){
        layer = layui.layer;
    });

    $(document).on("click","#dvl-tianjia",function(){
        layer.confirm('<div id="dvl-tankuang"></div>',{
          btn: ['确定','取消'] //按钮
          ,area: ['420px', '526px']
          ,title:"可视化编辑"
        }, function(){
          layer.closeAll();
        }, function(){
          layer.closeAll();
        });
    });

	$(document).on("click",".li-box",function(){
	    if ($(this).siblings().children(".libox-click").is(":visible") == false) {
            return;
        }
		$(this).children(".libox-click").toggle();
		$(this).siblings().children(".libox-click").hide();
		$("#mapView").html("<embed style='width: 100%;height: 99%;' src='" + $(this).attr("url") + "' />");
	});

	$(".right-zoom").on("click", function () {
        var title = $(this).attr("title");
        if (title == "全屏浏览") {
            fullscreen();
        } else {
            exitFullscreen();
        }

    });
});

var layer = null;