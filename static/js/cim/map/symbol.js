Gis.Symbol = $.extend({}, {

    init : function(){
        Gis.Symbol.initGxdSymbol();
        Gis.Symbol.initBSymbol();
        Gis.Symbol.initASymbol();
    },

    initGxdSymbol : function(){
        Gis.Symbol.gxd = {};
        Gis.Symbol.gxd.loop = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([0,0,153]), 2),new esri.Color([230,230,230,0.1]));
        Gis.Symbol.gxd.plate = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([137, 68, 101]), 2),new esri.Color([137, 68, 101,0.1]));
        Gis.Symbol.gxd.trade = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([73,226,72]), 2),new esri.Color([73,226,72,0.1]));
        Gis.Symbol.gxd.school = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([249,82,56]), 2),new esri.Color([249,82,56,0.1]));
        Gis.Symbol.gxd.bufferSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([255,45,25]), 2),new esri.Color([255,45,25,0]));
        Gis.Symbol.gxd.cd5 = new esri.symbol.PictureMarkerSymbol({"url":"/static/images/mapicon/cd_5.png",
                            "width":14,"height":14,"type":"esriPMS"});
        Gis.Symbol.gxd.cd6 = new esri.symbol.PictureMarkerSymbol({"url":"/static/images/mapicon/cd_6.png",
                            "width":12,"height":12,"type":"esriPMS"});
        Gis.Symbol.gxd.cd7 = new esri.symbol.PictureMarkerSymbol({"url":"/static/images/mapicon/cd_7.png",
                            "width":8,"height":8,"type":"esriPMS"});
        Gis.Symbol.gxd.cd9 = new esri.symbol.PictureMarkerSymbol({"url":"/static/images/mapicon/cd_9.png",
                            "width":9,"height":9,"type":"esriPMS"});
        Gis.Symbol.gxd.doorway = new esri.symbol.PictureMarkerSymbol({"url":"/static/images/mapicon/doorway.png",
                            "width":14,"height":14,"type":"esriPMS"});
    },

    initBSymbol : function(){
        Gis.Symbol.bd = {};

    },

    initASymbol : function(){
        Gis.Symbol.gd = {};

    },

    getQuerySymbol : function(gp,type){
        var url = null;
        var height = 30;
        var width = 18;
        var bHeight = 40;
        var bWidth = 24;
        if(type=="mapClick"){
            width = 13.5;
            height = 22.5;
            bWidth = 18;
            bHeight = 30;
            if(gp.iFSelect){
                url = "/static/images/mapicon/blu"+gp.index+".png";
            }else{
                url = "/static/images/mapicon/red"+gp.index+".png";
            }
        }else{
            if(gp.iFSelect){
                url = "/static/images/mapicon/"+4+"_"+gp.index+".png";
            }else{
                url = "/static/images/mapicon/"+gp.type+"_"+gp.index+".png";
            }
        }
        if(Gis.Map.mapType==7){
            return url;
        }else if(Gis.Map.mapType==6){
            return new BMap.Icon(url, new BMap.Size(bWidth,bHeight));
        }else{
            return  new esri.symbol.PictureMarkerSymbol({"url":url,
                "width":width,"height":height,"type":"esriPMS"});
        }
    },

    getTextSymbol : function(text){
        var textSymbol =  new esri.symbol.TextSymbol(text);
       textSymbol.setColor(new esri.Color([51, 51, 51]));
       textSymbol.setFont(new esri.symbol.Font("10pt").setWeight(esri.symbol.Font.WEIGHT_BOLD));
       return textSymbol;
    }

});