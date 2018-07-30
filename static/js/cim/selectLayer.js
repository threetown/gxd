$(function(){
    var treeData = [
        { id: 1, name: '地块', pid: 0 },
        { id: 2, name: '楼盘', pid: 0 },
        { id: 3, name: '显示', pid: 1 },
        { id: 4, name: '显示', pid: 1 }
    ];

    function getData(id, arr){
        var result = [],
            lev=0;
        var forFn = function(arr, id ,lev){
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item.pid === id) {
                    item.lev = lev;
                    result.push(item);
                    forFn(arr,item.id,lev+1);
                }
            }
        }
        forFn(arr, id,lev);
        return result;
    }

    function createTree(data, id) {
        var tree = getData(id,data);
        var temp = [];
        for(var i=0;i<tree.length;i++){
            var item = tree[i],u = "";
            if(i>0){
                u = "</ul>";
            }
            if(item['lev']==0){
                temp.push(u+'<li><a class="isParent"><i class="iconfont icon-upward"></i>'+item.name+'</a><ul>');
            }else{
                temp.push('<li><span class="title" data-id="' + item.id + '" data-name="' + item.name + '"><b>' + item.name + '</b><i class="iconfont icon-success js-selectLayerIcon"></i></span></li>')
            }
            if(i+1==tree.length){
                temp.push("</ul>")
            }
        }
        return temp.join("")
    }

    $('.js-typeTree').html(createTree(treeData, 0));
    $('.js-typeTree').on('click', '.isParent', function(){
        $(this).siblings('ul').toggle()
        $(this).toggleClass('toggle')
    })
    $('.js-selectLayerIcon').on('click', function(){
        var $this = $(this);
        if($this.hasClass('select')){
            $this.removeClass('select');
            selectLayerDataFn($this.siblings('b').text())
        }else{
            $this.addClass('select');
            selectLayerDataFn($this.siblings('b').text(),'add')
        }
    })

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    var selectLayerData = [];
    function selectLayerDataFn(value, type){
        if(type == 'add'){
            selectLayerData.push(value);
        }else{
            selectLayerData.remove(value)
        }
        selectResult(selectLayerData)
    }

    function selectResult(data){
        $('.js-selectLayerNum').text(data.length)
        $('.js-selectLayerList').html(createSelectItems(data))
        $('.js-removeLayerFn').on('click', function(){
            var v = $(this).siblings('b').text();
            data.remove(v)
            $('.js-typeTree').find('.title[data-name="'+ v +'"]').children('i').removeClass('select')
            selectResult(data)
        })
    }

    function createSelectItems(data){
        if(data.length != 0){
            var result = []
            for (var i = 0; i < data.length; i++) {
                result.push('<li><b>'+data[i]+'</b><i class="iconfont icon-error js-removeLayerFn"></i></li>');
            }
            return result.join('')
        }else{
            return '<span class="emptyData">没有选择</span>';
        }
    }

})