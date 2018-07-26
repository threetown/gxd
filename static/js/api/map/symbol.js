Gis.Symbol = $.extend({}, {

    init : function(){
        Gis.Symbol.initGxdSymbol();
    },

    initGxdSymbol : function(){
        Gis.Symbol.gxd = {};
        Gis.Symbol.gxd.color = ["rgb(154,205,50)", "rgb(124,252,0)", "rgb(255,215,0)", "rgb(238,180,180)", "rgb(255,130,71)", "rgb(178,34,34)"],
        Gis.Symbol.gxd.area = [
            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,218,185]), 3),new esri.Color([154,205,50,0.99])),

            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,218,185]), 3),new esri.Color([124,252,0,0.99])),

            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,218,185]), 3),new esri.Color([255,215,0,0.99])),

            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,218,185]), 3),new esri.Color([238,180,180,0.99])),

            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,218,185]), 3),new esri.Color([255,130,71,0.99])),

            new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,218,185]), 3),new esri.Color([178,34,34,0.99]))];
    },

    getTextSymbol : function(text){
        var textSymbol =  new esri.symbol.TextSymbol(text);
       textSymbol.setColor(new esri.Color([51, 51, 51]));
       textSymbol.setFont(new esri.symbol.Font("10pt").setWeight(esri.symbol.Font.WEIGHT_BOLD));
       return textSymbol;
    },

    getGeomSymbol : function(value){
        var legend = [10000, 20000, 30000, 50000, 80000, 100000];

        for (var i = 0;i < legend.length;i++) {
            if (value < legend[i]) {
                return Gis.Symbol.gxd.area[i];
            }
        }
        return Gis.Symbol.gxd.area[5];
    },

    getSymbolLegend : function(){
        var legend = [10000, 20000, 30000, 50000, 80000, 100000];
        var divHtml = "";
        var first = 0;
        for (var i = 0;i < legend.length;i++) {
            if (i == 0) {
                var text = "￥ <= " + legend[i];
            } else if (i == legend.length - 1) {
                var text = "￥ > " + legend[i];
            } else {
                var text = legend[i-1] + " < ￥ <= " + legend[i];
            }

            divHtml += '<label for="A"><input id="A" readonly="readonly" style="border:none; margin-right: 20px;margin-top: -3px;border-radius:10px;width: 100px;height: 8px;background-color: ' + Gis.Symbol.gxd.color[i] + ';"/><div style="float: right">' + text + '</div></label>';
        }

        return divHtml;
    }

});