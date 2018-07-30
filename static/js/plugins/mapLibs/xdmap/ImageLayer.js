class ImageLayer {
    constructor() {

    }

    /*
    * 获取一个图片服务
    * */
    GetImageLayer(id,url, layers, visible, zIndex, filter) {
        if (zIndex == null) {
            zIndex = 1;
        }
        if (visible == null) {
            visible = true;
        }
        var layer = new ol.layer.Image({
            id: id,
            source: new ol.source.ImageWMS({
                crossOrigin: 'anonymous',
                ratio: 1,
                url: url,
                params: {
                    VERSION: '1.1.0',
                    STYLES: '',
                    LAYERS: layers,
                    Filter: filter
                }
            }),
            visible: visible,
            zIndex: zIndex
        });
        return layer;
    }
}