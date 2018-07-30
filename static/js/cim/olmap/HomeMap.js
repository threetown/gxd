var xdmap = new Xdmap();
var map = xdmap.Init('map',4, [12956654.349363782, 4852461.421256379],'gxdBlack');
var HomeMap = {
    cityBound: null,
    vector: null,
    source: null,
    serverUrl: 'http://geoserver.cindata.cn',
    ajax: new XMLHttpRequest(),
    popup: null,
    realEstateData: null,
    collectionData: new Array(),
    inlineDataData: new Array(),
    allData:null,
    init: function () {
        //单击事件
        xdmap.on('click', (e, features) => {

        })
        //移动事件
        xdmap.on('move', (e, features) => {
           HomeMap.onMove(e, features)
        });
        //缩放事件
        xdmap.on('res', () => {

        });
        this.layerInit();
        this.getPopup();
        this.getData();
        this.tabChange('realEstate');
    },
    /*
    * 图层初始化
    * */
    layerInit: function () {
        this.cityBound = this.getCityBound();
        xdmap.layer.AddLayer(this.cityBound);
    },
    /*
    * 获取popup
    * */
    getPopup: function () {
        var div = $('<div id="info" style="cursor: pointer;">' +
            '<p id="sj" style="border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid rgb(4,21,50); position: absolute; left: 50%; bottom: -39px; transform: translateX(-50%);"></p>' +
            '<div id="name" style="border: 1px solid rgb(0,188,212); color: rgb(255, 255, 255); padding: 6px 11px; border-radius: 4px; background: rgb(4, 21, 50); position: absolute; top: -43px; left: 50%; max-width: 500px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; z-index: 10; transform: translateX(-50%); cursor: pointer;">info</div>' +
            '</div>')
        this.popup = xdmap.overlayer.CreateOverlay('cityPopup', div[0],[0,0],[0,-29]);
        xdmap.overlayer.AddOverlay(this.popup);
    },

    /*
    * 获取数据源
    * */
    getData:function() {
        var filter =
            '&filter=' +
            '<PropertyIsEqualTo>' +
            '<PropertyName>if_fine_quality</PropertyName>' +
            '<Literal>' + 0 + '</Literal>' +
            '</PropertyIsEqualTo>';
        let url = 'http://geoserver.cindata.cn' +
            '/geoserver/cim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cim:gr_city'
            + /*filter +*/
            '&maxFeatures=400&outputFormat=application%2Fjson'
        MapCommon.Ajax(HomeMap.ajax, url, function (data) {
            let features = HomeMap.source.getFormat().readFeatures(data);
            features.forEach((feature) => {
                feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
            })
            HomeMap.allData = features;
        }, false);
    },
    /*
    * 获取精品城市
    * */
    getCityBound: function () {
        var filter =
            '&filter=' +
            '<PropertyIsEqualTo>' +
            '<PropertyName>if_fine_quality</PropertyName>' +
            '<Literal>' + 0 + '</Literal>' +
            '</PropertyIsEqualTo>';

        let source = xdmap.vectorSoure.GetSource((sou, ext) => {})
        let vector = xdmap.vectorLayer.GetVector('bound', source);
        vector.setStyle((feat, res) => {
            let style = xdmap.vectorStyle.GetPolyonStyle('rgba(0,161,231,1)', 1, '15px', feat.N.name, 'rgba(255,255,255,0)', 'rgba(0,161,231,0.5)');
            feat.setStyle(style)
        })
        this.vector = vector;
        this.source  = source;
        return vector;
    },

    /*
    * 移动事件
    * */
    onMove(e, features) {
        HomeMap.setDefaultStyle();
        if (features.length == 0) {
            var ele = $('#info');
            if (ele) {
                ele.hide();
            }
            return;
        } else {
            var feature = features[0];
            feature.set('select', true);
            let style = xdmap.vectorStyle.GetPolyonStyle('rgba(16,165,255,1)', 3, '15px', feature.N.name, 'rgba(255,255,255,0)', 'rgba(16,165,255,0.7)')
            feature.setStyle(style)
            let center = e.coordinate;
            var ele = $('#name');
            if (ele.length == 0) {
                HomeMap.getPopup();
                ele = $('#name');
            }
            ele.html('<div style="">精品城市:</div>' + feature.N.name);
            ele.show();
            $('#info').show();
            HomeMap.popup.setPosition(center);
        }
    },

    /*
    * 恢复原style
    * */
    setDefaultStyle() {
        this.vector.getSource().forEachFeature((feature) => {
            if (feature.get('select')) {
                feature.set('select', false);
                let style = xdmap.vectorStyle.GetPolyonStyle('rgba(0,161,231,1)', 1, '15px', feature.N.name, 'rgba(255,255,255,0)', 'rgba(0,161,231,0.5)')
                feature.setStyle(style)
            }
        })
    },
    /*
    * tab切换
    * */
    tabChange: function (value) {
        switch (value) {
            case 'realEstate': {
                this.setData(0)
            }
                break;
            case 'collection': {
                this.setData(1)
            }
                break;
            case 'inlineData': {
                this.setData(2)
            }
                break;
        }
    },
    /*
    * 设置右上角数据
    * */
    setData: function (ifFineQuality) {
        HomeMap.source.clear();
        HomeMap.allData.forEach((feature)=> {
            if (feature.N.if_fine_quality == ifFineQuality) {
                HomeMap.source.addFeature(feature);
            }
        })
        if (HomeMap.realEstateData == null) {
            $.ajax({
                url: 'cim/getEstateSurvey',
                async: true,
                tyle: 'GET',
                success: function (data) {
                    HomeMap.realEstateData = data;
                    main_ol.setRqInfo(data);
                }
            })
        } else {
            main_ol.setRqInfo(HomeMap.realEstateData);
        }
        if (HomeMap.collectionData[ifFineQuality] == null) {
            $.ajax({
                url: 'cim/getEstateTotal',
                async: true,
                tyle: 'POST',
                data: {
                    ifFineQuality: ifFineQuality
                },
                success: function (data) {
                    HomeMap.collectionData[ifFineQuality] = data;
                    main_ol.setRqCount(data);
                }
            })
        } else {
            main_ol.setRqCount(HomeMap.collectionData[ifFineQuality]);
        }
        if (HomeMap.inlineDataData[ifFineQuality] == null) {
            $.ajax({
                url: 'cim/getCityEstateTotal',
                async: true,
                tyle: 'POST',
                data: {
                    ifFineQuality: ifFineQuality
                },
                success: function (data) {
                    HomeMap.inlineDataData[ifFineQuality] = data;
                    main_ol.setCityList(data);
                }
            })
        } else {
            main_ol.setCityList(HomeMap.inlineDataData[ifFineQuality]);
        }
    }
}