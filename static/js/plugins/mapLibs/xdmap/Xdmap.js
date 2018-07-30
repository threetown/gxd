class Xdmap {
    constructor() {
    };

    /*
    * 初始化
    * */
    Init(id, zoom, center, type) {
        this.base = new Base();
        var base = this.base.getBase(type);
        this.view = new View(center, zoom);
        let map = new ol.Map({
            target: id,
            view: this.view.getView(),
            layers: [base],
            controls: ol.control.defaults({
                attribution:false
            })
        })
        this.base.map = map;
        this.map = map;
        this.layer = new Layer(map);
        this.vectorStyle = new VectorStyle();
        this.vectorSoure = new VectorSource();
        this.vectorLayer = new VectorLayer();
        this.overlayer = new Overlayer(map);
        this.imageLayer = new ImageLayer();
        return map;
    }

    /*
    * 事件绑定
    * */
    on(event, callback) {
        let map = this.map;
        switch (event) {
            case 'click': {
                map.on('singleclick', function (e) {
                    let features = MapCommon.GetFeatureForPixel(map, e);
                    callback(e, features);
                })
            }
                break;
            case 'move': {
                map.on('pointermove', function (e) {
                    let features = MapCommon.GetFeatureForPixel(map, e);
                    callback(e, features);
                })
            }
                break;
            case 'res': {
                map.getView().on('change:resolution', function (e) {
                    callback(e);
                })
            }
                break;
        }
    }
}
