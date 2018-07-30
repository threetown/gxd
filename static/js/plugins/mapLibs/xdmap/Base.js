class Base {
    constructor() {
        this.map = null;
    };

    /*
    * 获取底图
    * */
    getBase(id) {
        this.id = id;
        let layers = null;
        switch (this.id) {
            case 'gxd': {
                layers = this.InitGxd();
            }
                break;
            case 'gxdBlack': {
                layers = this.InitGxdBlack()
            }
                break;
            case 'gxdDark': {
                layers = this.InitGxdDark();
            }
                break;
            case 'baidu': {
                layers = this.InitBaidu();
            }
                break;
            case 'wiki': {
                layers = this.InitWiki();
            }
                break;
            case 'google': {
                layers = this.InitGoogle();
            }
                break;
            case 'tianditu' : {
                layers = this.InitTianditu();
            }
                break;
        }
        return layers;
    }

    /*
    * 公司灰色底图
    * */
    InitGxd() {
        var url = 'http://111.40.214.181/arcgis/rest/services/comm/ChinaGray/MapServer'
        var gxd = new ol.layer.Tile({
            preload: 80,
            source: new ol.source.TileArcGISRest({
                url: url,
                wrapX: false
            }),
            zIndex: 0
        })
        gxd.set('id', 'base');
        return gxd;
    }


    /*
     * 公司黑色底图
     * */
    InitGxdBlack() {
        var url = 'http://111.40.214.181/arcgis/rest/services/comm/ChinaBlack/MapServer'
        var gxd = new ol.layer.Tile({
            preload: 80,
            source: new ol.source.TileArcGISRest({
                url: url,
                wrapX: false
            }),
            zIndex: 0
        })
        gxd.set('id', 'base');
        return gxd;
    }

    /*
    * 公司暗黑色底图
    * */
    InitGxdDark() {
        var url = 'http://111.40.214.181/arcgis/rest/services/comm/ChinaDark/MapServer';
        var gxd = new ol.layer.Tile({
            preload: 80,
            source: new ol.source.TileArcGISRest({
                url: url,
                wrapX: false
            }),
            zIndex: 0
        })
        gxd.set('id', 'base');
        return gxd;
    };

    /*
    * 天地图
    * */
    InitTianditu() {
        var base = new Array();
        var tian_di_tu_road_layer = new ol.layer.Tile({
            id: 'base',
            title: "天地图路网",
            source: new ol.source.XYZ({
                //crossOrigin: 'anonymous',
                url: "http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
            }),
            zIndex: 0
        });
        base.push(tian_di_tu_road_layer);
        var tian_di_tu_annotation = new ol.layer.Tile({
            id: 'base',
            title: "天地图文字标注",
            source: new ol.source.XYZ({
                //crossOrigin: 'anonymous',
                url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
            }),
            zIndex: 0
        });
        base.push(tian_di_tu_annotation);
        return base;
    }

    /*
    * 维基
    * */
    InitWiki() {
        var weiji = new ol.layer.Tile({
            source: new ol.source.OSM(),
            zIndex: 0
        });
        weiji.set('id', 'base');
        return weiji;
    }

    /*
    * 谷歌
    * */
    InitGoogle() {
        // var url ='http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2szh-CN!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965';
        var url = 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
        var googleLayer = new ol.layer.Tile({
            visible: true,
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous',
                url: url
            }),
            zIndex: 0
        });
        googleLayer.set('id', 'base');
        return googleLayer;
    }

    /*
    * 百度
    * */
    InitBaidu() {
        // 自定义分辨率和瓦片坐标系
        var resolutions = [];
        var maxZoom = 18;
        // 计算百度使用的分辨率
        for (var i = 0; i <= maxZoom; i++) {
            resolutions[i] = Math.pow(2, maxZoom - i);
        }
        var tilegrid = new ol.tilegrid.TileGrid({
            origin: [0, 0],    // 设置原点坐标
            resolutions: resolutions    // 设置分辨率
        });
        var projection = ol.proj.get("EPSG:3857");
        var baiduSource = new ol.source.TileImage({
            projection: projection,
            tileGrid: tilegrid,
            tileUrlFunction: function (tileCoord, pixelRatio, proj) {
                if (!tileCoord) {
                    return "";
                }
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = tileCoord[2];
                if (x < 0) {
                    x = "M" + (-x);
                }
                if (y < 0) {
                    y = "M" + (-y);
                }

                return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
            }
        });
        // 百度地图层
        var baidu = new ol.layer.Tile({
            source: baiduSource,
            zIndex: 0
        });
        baidu.set('id', 'base');
        return baidu;
    }

    /*
    * 切换
    * */
    Swicth(id) {
        let map = this.map;
        let layers = this.getBase(id);
        map.getLayers().forEach(function (layer) {
            if (layer) {
                if (layer.get('id')) {
                    if (layer.get('id') == 'base')
                        map.removeLayer(layer)
                }
            }
        })
        if (id == 'tianditu') {
            layers.forEach(function (layer) {
                map.addLayer(layer)
            })
        } else {
            map.addLayer(layers)
        }
    }
}