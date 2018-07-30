class Overlayer {
    constructor(map) {
        this.map = map;
    }

    /*
    * 创建覆盖物
    * */
    CreateOverlay(id, div, center, offset) {
        if (!offset) {
            offset = [0, 0]
        }
        let overlay = new ol.Overlay({
            id: id,
            element: div,
            position: center,
            offset: offset,
            insertFirst: false,
            stopEvent: false
        });
        return overlay;
    }

    /*
    * 添加overlay
    * */
    AddOverlay(overlay) {
        this.map.addOverlay(overlay)
    }

    /*
    * 获取Id
    * */
    GetId(overlay) {
        return overlay.getId();
    }

    /*
    * 获取元素
    * */
    GetElement(overlay) {
        return overlay.getElement();
    }

    /*
    * 获取坐标
    * */
    GetPosition(overlay) {
        return overlay.getPosition();
    }

    /*
    * 获取所有overlays
    * */
    GetAll() {
        return this.map.getOverlays();
    }

    /*
    * 删除overlay
    * */
    RemoveOverlay(overlay) {
        this.map.removeOverlay(overlay)
    }

    /*
     * 删除overlay根据id
     * */
    RemoveOverlayById(id) {
        let overlayers = this.map.getOverlays().a;
        for (let i = 0; i < overlayers.length; i++) {
            let overlay = overlayers[i];
            if (overlay) {
                if (overlay.get('name') != undefined) {
                    if (id == overlay.get('name')) {
                        this.RemoveOverlay(overlay);
                        i--;
                    }
                }
            }
        }
    }

    /*
    * 删除overlay根据Name
    * */
    RemoveOverlayByName(name) {
        let overlayers = this.map.getOverlays().a;
        for (let i = 0; i < overlayers.length; i++) {
            let overlay = overlayers[i];
            if (overlay) {
                if (overlay.get('name') != undefined) {
                    if (name == overlay.get('name')) {
                        this.RemoveOverlay(overlay);
                        i--;
                    }
                }
            }
        }
    }

    /*
    * 删除所有overlayers
    * */
    RemoveAll() {
        this.map.getOverlays().clear();
    }

    /*
        * 隐藏overlay
        * */
    HideOverlay(overlay) {
        let ele = this.GetElement(overlay);
        ele.display = 'none'
    }

    /*
    * 隐藏overlay根据Name
    * */
    HideOverlayByName(name) {
        this.map.getOverlays().forEach(function (t) {
            if (t) {
                if (t.get('name') == name) {
                    let ele = overlay.getElement();
                    ele.style.display = 'none'
                }
            }
        })
    }

    /*
    * 隐藏所有overlay
    * */
    HideAll() {
        this.map.getOverlays().forEach(function (t) {
            if (t) {
                let ele = overlay.getElement();
                ele.style.display = 'none'
            }
        })
    }

    /*
    * 显示overlay
    * */
    ShowOverlay(overlay) {
        let ele = this.GetElement(overlay);
        ele.display = 'block'
    }

    /*
    * 显示所有overlay根据name
    * */
    showOverlayByName(name) {
        this.map.getOverlays().forEach(function (t) {
            if (t) {
                if (t.get('name') == name) {
                    this.GetElement(t).display = 'block';
                }
            }
        })
    }

    /*
    * 显示所有overlay
    * */
    ShowAll(overlay) {
        this.map.getOverlays().forEach(function (t) {
            if (t) {
                this.GetElement(t).display = 'block';
            }
        })
    }
}