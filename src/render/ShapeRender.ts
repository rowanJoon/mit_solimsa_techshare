import { BoundingBox, Coordinate, GeoCanvasInteract, PolyDataSet, Shape } from "../type/Type.js";
import { ShapeRenderService } from "./ShapeRenderService.js";
import { Layer } from "./Layer.js";

export class ShapeRender extends ShapeRenderService {
    private readonly shape: Shape;
    private readonly layer: Layer;
    constructor(canvasId: string, shape: Shape, layer: Layer) {
        super(canvasId);
        this.shape = shape;
        this.layer = layer;
    }

    render(geoCanvasInteract: GeoCanvasInteract): void {
        const shapeType: number = this.shape.shapeHeader.shapeType;
        const boundingBox: BoundingBox = this.shape.shapeHeader.boundingBox;
        const contents: Coordinate[] | PolyDataSet = this.shape.shapeContents.contents;

        this.layer.addGeoObject(this.shape);
        this.checkInitRenderer();
        this.renderingCanvas(shapeType, contents, boundingBox, geoCanvasInteract);

        console.log(this.layer);
    }

    renderingCanvas(
        shapeType: number,
        contents: Coordinate[] | PolyDataSet,
        boundingBox: BoundingBox,
        geoCanvasInteract: GeoCanvasInteract
    ): void {
        let extractCoord: Coordinate;
        let hasCleared: boolean = false;

        this.clearContext();
        this.saveContext();
        this.scaleContext(geoCanvasInteract.zoom, geoCanvasInteract.zoom);
        this.translateContext(geoCanvasInteract.panX, geoCanvasInteract.panY);

        for (let i = 0, len = this.layer.sizeGeoObject(); i < len; i++) {
            if (!hasCleared) {
                this.clearContext();
                hasCleared = true;
            }

            const contents: Coordinate[] | PolyDataSet = this.layer.geoObjects[i].shapeContents.contents;

            if (Array.isArray(contents)) {
                for (const coord of contents) {
                    extractCoord = this.extractCoordinates(coord, boundingBox);
                    this.renderer.drawPoint(extractCoord.x, extractCoord.y, geoCanvasInteract.radius);
                }
            } else {
                const partsCoordinates: Array<Coordinate>[] = contents.PartsCoordinates;
                const polyShapeType = this.layer.getGeoObject()[i].shapeHeader.shapeType;
                this.renderer.setLineWidth(geoCanvasInteract.lineWidth);

                partsCoordinates.forEach(coordPair => {
                    this.renderer.beginPath();

                    Object.values(coordPair).forEach((coord: Coordinate, idx: number) => {
                        extractCoord = this.extractCoordinates(coord, boundingBox);
                        this.renderer.drawPoly(extractCoord.x, extractCoord.y, idx);
                    });

                    if (polyShapeType === 3) {
                        this.renderer.strokeColor('#99FF99');
                    }

                    if (polyShapeType === 5) {
                        this.renderer.strokeColor('black');
                        this.renderer.fill();
                        this.renderer.fillColor('#FFFFCC');
                    }

                    this.renderer.stroke();
                });
            }
        }

        this.restoreContext();
    }

}