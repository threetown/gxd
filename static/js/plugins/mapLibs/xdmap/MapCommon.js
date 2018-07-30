class MapCommon {
    /*
   * 根据像素获取features
   * */
    static GetFeatureForPixel(map, e) {
        var features = new Array();
        var pixel = map.getEventPixel(e.originalEvent);
        map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            features.push(feature)
        });
        return features;
    }

    /*
    * JS原生请求
    * */
    static Ajax(ajax, url, callback, async) {
        if (async == null) {
            async = true;
        }
        ajax.open('get', url, async);
        ajax.onreadystatechange = function (data) {
            if (ajax.readyState == 4 && ajax.status == 200) {
                callback(data.currentTarget.responseText);
            }
        }
        ajax.send();
    }
}