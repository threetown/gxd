//AJAX全局错误提示
$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
    var layer = null;
    layui.use('layer', function(){
        layer = layui.layer;
    });
    var result = jqxhr.responseJSON;
    if(result == undefined) {
        result = $.parseJSON(jqxhr.responseText);
    }
    if(result && result.message) {
        if(result.state == -1) {//用户失效时，跳转到登录页
            layer.alert(result.message, {
                closeBtn: 0
            }, function () {
                window.location = _ctx;
            });
        }
        if(result.state == -2) {
            layer.alert(result.message, {icon: 7});
        }
        if(result.state == -3) {
            layer.alert("系统异常:"+result.message, {icon: 7});
        }
    } else {
        layer.msg("系统错误!", {icon: 2});

    }
});