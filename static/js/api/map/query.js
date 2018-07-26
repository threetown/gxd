Gis.Query = $.extend({}, {

    query:function(server,geometry,fieldArray,whereSql,callBack, errorBack){
        var queryTask = new esri.tasks.QueryTask(server);
        var query = new esri.tasks.Query();
        if(null!=geometry){
              query.geometry = geometry;
        }else{
             query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_ENVELOPEINTERSECTS;
        }
        query.returnGeometry = true;
        query.outFields = fieldArray;
        if(whereSql){
            query.where = whereSql;
        }else{
            query.where = "1=1";
        }
        queryTask.execute(query,callBack,errorBack);
    },

    queryRealTime:function(){
        var ex= Gis.Map.gxdMap.extent;
        if (ex == undefined) {
            return;
        }
        console.log("地图级别："+Gis.Map.gxdMap.getLevel());
        var x1 =ex.xmin;
        var x2 =ex.xmax;
        var y1 =ex.ymin;
        var y2 =ex.ymax;
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
        for(var i=0;i<Gis.Map.selectedLayers.length;i++){
            switch(Gis.Map.selectedLayers[i]){
                case "community":
                    if(Gis.Map.gxdMap.getLevel()>13){
                        Gis.Query.query(Gis.Map.queryServer+'/1',gon,["*"],null,
                            Gis.Show.queryServerCallBack,Gis.Query.queryAllVisLayerErrorBack);
                     }
                    if(Gis.Map.gxdMap.getLevel()>14){
                        if(!Gis.Map.labelLayerCom.visible){
                            Gis.Map.labelLayerCom.show();
                        }
                    }else{
                        Gis.Map.labelLayerCom.hide();
                    }
                    break;
                case "building":
                    if(Gis.Map.gxdMap.getLevel()>15){
                        Gis.Query.query(Gis.Map.queryServer+'/2',gon,["*"],null,
                            Gis.Show.queryServerCallBack,Gis.Query.queryAllVisLayerErrorBack);
                     }
                    if(Gis.Map.gxdMap.getLevel()>16){
                        if(!Gis.Map.labelLayerBui.visible){
                            Gis.Map.labelLayerBui.show();
                        }
                    }else{
                        Gis.Map.labelLayerBui.hide();
                    }
                    break;
                case "unit":
                    if(Gis.Map.gxdMap.getLevel()>16){
                        Gis.Query.query(Gis.Map.queryServer+'/27',gon,["*"],null,
                            Gis.Show.queryServerCallBack,Gis.Query.queryAllVisLayerErrorBack);
                     }
                    if(Gis.Map.gxdMap.getLevel()>17){
                        if(!Gis.Map.labelLayerUni.visible){
                            Gis.Map.labelLayerUni.show();
                        }
                    }else{
                        Gis.Map.labelLayerUni.hide();
                    }
                    break;
                case "house":
                    if(Gis.Map.gxdMap.getLevel()>15){
                        Gis.Query.query(Gis.Map.queryServer+'/3',gon,["*"],null,
                            Gis.Show.queryServerCallBack,Gis.Query.queryAllVisLayerErrorBack);
                     }
                    if(Gis.Map.gxdMap.getLevel()>16){
                        if(!Gis.Map.labelLayerHouNo.visible){
                            Gis.Map.labelLayerHouNo.show();
                        }
                    }else{
                        Gis.Map.labelLayerHouNo.hide();
                    }
                    break;
                case "doorway":
                    if(Gis.Map.gxdMap.getLevel()>15){
                       Gis.Query.queryPointByShape(ex,"doorway","GP_SPECIAL_MAP_"+cityCode,
                        "STATUS_CD=1  and TYPE_CD =3");
                    }
                case "loop":
                    if(Gis.Map.gxdMap.getLevel()<14){
                       Gis.Query.queryPolygonByShape(ex,"loop","GR_LOOPLINE",
                        "STATUS_CD=0 AND AREAID = "+cityId);
                    }
                    break;
                case "plate":
                    if(Gis.Map.gxdMap.getLevel()<18){
                       Gis.Query.queryPolygonByShape(ex,"plate","gr_precinct_"+cityCode,
                        "STATUS_CD != 2");
                    }
                    break;
                case "trade":
                    if(Gis.Map.gxdMap.getLevel()<18){
                       Gis.Query.queryPolygonByShape(ex,"trade","GR_SPECIAL_MAP_"+cityCode,
                        "STATUS_CD=1 and TYPE_CD =5");
                    }
                    break;
                case "school":
                    if(Gis.Map.gxdMap.getLevel()<18){
                       Gis.Query.queryPolygonByShape(ex,"school","GR_SPECIAL_MAP_"+cityCode,
                        "STATUS_CD=1  and TYPE_CD =4");
                    }
                    break;
            }
        }
    },
    queryPointByShape:function(gon,type,tableName,where){
        $.ajax({
            type: "post",
            url : _ctx+'/gxdyun/area/queryPointByCustom',
            data : { tableName: tableName,
                        where: where,
                        attr: this.getAttr(type),
                        count: 500,
                        extent:gon.xmin+"_"+gon.xmax+"_"+gon.ymin+"_"+gon.ymax},
            success : function(resultData){
                Gis.Show.queryPointCallBack(resultData,type);
            }
        });
      },
    queryPolygonByShape:function(city_id, area_level){
        $.ajax({
            type: "post",
            url : _ctx+'/gxdyun/area/queryAreaByCondition',
            data : { city_id: city_id,
                        area_level: area_level,
                        page: 1,
                        pageSize: 100 },
            success : function(resultData){
                Gis.Show.queryPolygonCallBack(resultData);
            }
        });
      },
    queryMapClick:function(page){
        var gtType = "gp";
        var geometry = null;
        if(Gis.Query.graphicQuery.type=="point"){
            var geo = GPS.mercator_decrypt(Gis.Query.graphicQuery.y,Gis.Query.graphicQuery.x);
            geometry = geo.lon+"_"+geo.lat;
        }else{
            gtType = "gr";
            var geo = GPS.mercator_decrypt_range(Gis.Query.graphicQuery.rings[0]);
            geometry = JSON.stringify(geo);
        }
        $.ajax({
            type: "post",
            url : _ctx+'/gxdyun/area/queryDataByGeometry',
            data : { type: Gis.Query.poiType,
                        gtType: gtType,
                        distance : Gis.Query.distanceQuery,
                        geometry: geometry,
                        page:page},
            success : function(resultData){
                Gis.Show.queryMapClickPointCallBack(resultData);
            }
        });
    },
    queryAllVisLayerErrorBack:function(error){
        console.log(error);
    },
    getPointByCoords: function(x, y){ // 通过坐标得到 地图点
        var mapPoint = new esri.geometry.Point(x, y,Gis.Map.gxdMap.spatialReference);
        return mapPoint;
    },
    getAttr:function (type) {
        return "OBJECTID,NAME,AVG_PRICE,AREA_ID";
    }
});