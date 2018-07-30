class View {
    constructor(center, zoom) {
        this.view = new ol.View({
            center: center,
            zoom: zoom
        })
    }

    /*
    * 初始化
    * */
    getView() {
        return this.view;
    }

    /*
    * 获取zoom
    * */
    getZoom() {
        return this.view.getZoom();
    }

    /*
    * 设置zoom
    * */
    setZoom(zoom) {
        if (typeof zoom === 'number') {
            this.view.setZoom(zoom)
        } else {
            alert('zoom类型为数字')
        }
    }


}