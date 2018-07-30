class VectorSource {
    constructor() {

    }

    /*
    * 获取数据源
    * */
    GetSource(callback) {
        let source = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            loader: function (extent) {
                callback(source, extent)
            }
        })
        return source;
    }

    /*
    * 获取所有要素
    * */
    GetFeatures(source){
        return source.getFeatures();
    }
}