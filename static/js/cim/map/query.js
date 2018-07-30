Gis.Query = $.extend({}, {

    query: function (server, geometry, fieldArray, whereSql, callBack, errorBack) {
        var queryTask = new esri.tasks.QueryTask(server);
        var query = new esri.tasks.Query();
        if (null != geometry) {
            query.geometry = geometry;
        } else {
            query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_ENVELOPEINTERSECTS;
        }
        query.returnGeometry = true;
        query.outFields = fieldArray;
        if (whereSql) {
            query.where = whereSql;
        } else {
            query.where = "1=1";
        }
        queryTask.execute(query, callBack, errorBack);
    },

    queryRealTime: function () {
        var ex = Gis.Map.gxdMap.extent;
        if (ex == undefined) {
            return;
        }
        console.log("地图级别：" + Gis.Map.gxdMap.getLevel());
        var x1 = ex.xmin;
        var x2 = ex.xmax;
        var y1 = ex.ymin;
        var y2 = ex.ymax;
        var p1 = Gis.Query.getPointByCoords(x1, y1);
        var p2 = Gis.Query.getPointByCoords(x1, y2);
        var p3 = Gis.Query.getPointByCoords(x2, y2);
        var p4 = Gis.Query.getPointByCoords(x2, y1);
        var gon = new esri.geometry.Polygon(Gis.Map.gxdMap.spatialReference);
        gon.addRing([p1, p2, p3, p4, p1]);
        Gis.Map.showLayer3.clear();
        Gis.Map.showLayer2.clear();
        Gis.Map.showLayer1.clear();
        Gis.Map.textLayer.clear();
        for (var i = 0; i < Gis.Map.selectedLayers.length; i++) {
            switch (Gis.Map.selectedLayers[i]) {
                case "land":
                    if (Gis.Map.gxdMap.getLevel() < 14) {
                        Gis.Query.showLayer(ex, cityId, "land");
                    }
                    break;
                case "building":
                    if (Gis.Map.gxdMap.getLevel() > 15) {
                        Gis.Query.query(Gis.Map.queryServer + '/2', gon, ["*"], null,
                            Gis.Show.queryServerCallBack, Gis.Query.queryAllVisLayerErrorBack);
                    }
                    if (Gis.Map.gxdMap.getLevel() > 16) {
                        if (!Gis.Map.labelLayerBui.visible) {
                            Gis.Map.labelLayerBui.show();
                        }
                    } else {
                        Gis.Map.labelLayerBui.hide();
                    }
                    break;
                case "house":
                    if (Gis.Map.gxdMap.getLevel() > 15) {
                        Gis.Query.query(Gis.Map.queryServer + '/3', gon, ["*"], null,
                            Gis.Show.queryServerCallBack, Gis.Query.queryAllVisLayerErrorBack);
                    }
                    if (Gis.Map.gxdMap.getLevel() > 16) {
                        if (!Gis.Map.labelLayerHouNo.visible) {
                            Gis.Map.labelLayerHouNo.show();
                        }
                    } else {
                        Gis.Map.labelLayerHouNo.hide();
                    }
                    break;
            }
        }
    },
    showLayer: function (gon, cityId, type) {
        $.ajax({
            type: "post",
            url: '/cim/layer',
            dataType: 'json',
            data: {
                cityId: cityId,
                type: type,
                count: 500,
                extent: gon.xmin + "_" + gon.xmax + "_" + gon.ymin + "_" + gon.ymax
            },
            success: function (resultData) {
                Gis.Show.queryPolygonCallBack(resultData, type);
            }
        });
    },
    //查看周边
    queryMapClick: function (page) {
        var gtType = "gp";
        var geometry = null;
        if (Gis.Query.graphicQuery.type == "point") {
            var geo = GPS.mercator_decrypt(Gis.Query.graphicQuery.y, Gis.Query.graphicQuery.x);
            geometry = geo.lon + "_" + geo.lat;
        } else {
            gtType = "gr";
            var geo = GPS.mercator_decrypt_range(Gis.Query.graphicQuery.rings[0]);
            geometry = JSON.stringify(geo);
        }
        $.ajax({
            type: "post",
            url: '/aia/geom/queryDataByGeometry',
            data: {
                type: Gis.Query.poiType,
                gtType: gtType,
                distance: Gis.Query.distanceQuery,
                geometry: geometry,
                page: page
            },
            success: function (resultData) {
                Gis.Show.queryMapClickPointCallBack(resultData);
            }
        });
    },
    queryAllVisLayerErrorBack: function (error) {
        console.log(error);
    },
    getPointByCoords: function (x, y) { // 通过坐标得到 地图点
        var mapPoint = new esri.geometry.Point(x, y, Gis.Map.gxdMap.spatialReference);
        return mapPoint;
    }
});