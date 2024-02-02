import { ShapeHeader, BoundingBox } from '../types';

export class ShapeReader {
    private static _getBoundingBox(view: DataView): BoundingBox {
        return {
            xMin: view.getFloat64(36, true),
            yMin: view.getFloat64(44, true),
            xMax: view.getFloat64(52, true),
            yMax: view.getFloat64(60, true)
        };
    }

    public static getHeader(view: DataView): ShapeHeader {
        return {
            fileCode: view.getInt32(0),
            fileLength: view.getInt32(24),
            version: view.getInt32(28, true),
            shapeType: view.getInt32(32, true),
            boundingBox: this._getBoundingBox(view)
        };
    }
}
