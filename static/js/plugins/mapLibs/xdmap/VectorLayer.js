class VectorLayer {
    constructor() {

    }

    /*
    * 创建Vector
    * */
    GetVector(param1, param2, param3, param4, param5) {
        let vector = null;
        if (arguments.length == 2) {
            vector = this.GetVector2(param1, param2);
        }
        if (arguments.length == 3) {
            vector = this.GetVector2(param1, param2, param3);
        }
        if (arguments.length == 4) {
            vector = this.GetVector4(param1, param2, param3, param4);
        }
        if (arguments.length == 5) {
            vector = this.GetVector2(param1, param2, param3, param4, param5);
        }
        return vector;
    }

    /*
    * 创建Vector
    * */
    GetVector5(id, name, zIndex, visible, source) {
        if (arguments.length == 2) {

        }
        let vector = new ol.layer.Vector();
        if (id) {
            vector.set('id', id);
        }
        if (name) {
            vector.set('name', name);
        }
        if (zIndex) {
            vector.setZIndex(zIndex);
        }
        if (visible) {
            vector.setVisible(visible);
        }
        if (source) {
            vector.setSource(source)
        }
        return vector
    }

    /*
     * 创建Vector
     * */
    GetVector4(id, name, visible, source) {
        let vector = new ol.layer.Vector();
        if (id) {
            vector.set('id', id);
        }
        if (name) {
            vector.set('name', name);
        }
        if (visible) {
            vector.setVisible(visible);
        }
        if (source) {
            vector.setSource(source)
        }
        return vector
    }

    /*
     * 创建Vector
     * */
    GetVector3(id, visible, source) {
        let vector = new ol.layer.Vector();
        if (id) {
            vector.set('id', id);
        }
        if (visible) {
            vector.setVisible(visible);
        }
        if (source) {
            vector.setSource(source)
        }
        return vector
    }

    /*
    * 创建Vector
    * */
    GetVector2(id, source) {
        let vector = new ol.layer.Vector();
        if (id) {
            vector.set('id', id);
        }
        if (source) {
            vector.setSource(source)
        }
        return vector
    }

    /*
    * 设置是否显示该图层
    * true : 显示
    * false: 不显示
    * */
    SetVisible(vector, b) {
        vector.setVisible(b)
    }

    /*
    * 设置Zindex
    * */
    SetzIndex(vector, zIndex) {
        vector.setZIndex(zIndex)
    }

    /*
    * 设置透明度
    * */
    SetOpacity(vector, n) {
        vector.setOpacity()
    }

    /*
    * 设置id
    * */
    SetId(vector, id) {
        vector.set('id', id)
    }

    /*
    * 设置name
    * */
    SetName(vector, name) {
        vector.set('name', name);
    }
}