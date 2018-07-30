class Layer {
    constructor(map) {
        this.map = map
    }

    /*
    * 添加一个图层
    * */
    AddLayer(layer) {
        this.map.addLayer(layer)
    }

    /*
    * 删除一个图层
    * */
    Remove(layer) {
        this.map.removeLayer(layer)
    }

    /*
    * 删除一个图层根据Id
    * */
    RemoveLayerById(id) {
        let map = this.map;
        map.getLayers().forEach(layer => {
            if (layer) {
                if (layer.get('id')) {
                    if (layer.get('id') == id) {
                        map.removeLayer(layer)
                    }
                }
            }
        })
    }

    /*
    * 移除除id以外的图层
    * */
    RemoveOtherById(id) {
        let map = this.map;
        map.getLayers().forEach(layer => {
            if (layer.get('id')) {
                if (layer.get('id') != 'base') {
                    if (layer.get('id') != id) {
                        map.removeLayer(layer)
                    }
                }
            }
        })
    }

    /*
    * 移除图层组根据name
    * */
    RemoveLayersByName(name) {
        let map = this.map;
        map.getLayers().forEach(layer => {
            if (layer) {
                if (layer.get('name')) {
                    if (layer.get('name') == name) {
                        map.removeLayer(layer)
                    }
                }
            }
        })
    }

    /*
    * 移除所有图层
    * */
    RemoveAll() {
        let map = this.map;
        map.getLayers().forEach(layer => {
            if (layer) {
                if (layer.get('id') != 'base') {
                    map.removeLayer(layers)
                }
            }
        })
    }
}