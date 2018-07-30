class VectorStyle {
    constructor() {

    }

    /*
    * 获取点样式_图片
    * */
    GetImgStyle(src) {
        let style = new ol.style.Style({
            image: new ol.style.Icon(({
                src: src
            }))
        })
        return style;
    }

    /*
    * 获取线样式
    * */
    GetLineStyle(lineJoin, color, width, fillColor) {
        let stroke = null;
        if (lineJoin == 'bevel') { //非虚线模式
            stroke = new ol.style.Stroke({
                lineJoin: 'bevel', // 非虚线模式
                color: color,
                width: width
            })
        } else {
            stroke = new ol.style.Stroke({
                lineDash: [1, 2, 3],
                color: color,
                width: width
            })
        }
        let style = new ol.style.Style({
            stroke: stroke,
            fill: new ol.style.Fill({
                color: fillColor
            }),
            zIndex: 2
        })
        return style;
    }

    /*
    * 获取面样式
    * */
    GetPolyonStyle(strokeColor, strokeWidth, fontSize, text, fontColor, fillColor) {
        let style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: strokeWidth
            }),
            text: new ol.style.Text({
                font: fontSize,
                textAlign: 'center',
                rotateWithView: true,
                text: text,
                fill: new ol.style.Fill({
                    color: fontColor
                })
            }),
            fill: new ol.style.Fill({
                color: fillColor
            })
        })
        return style;
    }
}