import {GeoCanvasEventHandler} from './GeoCanvasEventHandler';
import {BoundingBox, Coordinate, GeoCanvasInteract, PolyDataSet} from '../../types';
import {Rectangle, QuadTree} from './QuadTree';
import {ShapeRender} from "../render/ShapeRender";
import {Layer} from "../render/Layer";

export class MouseClickEventHandler extends GeoCanvasEventHandler {
    constructor(shapeRender: ShapeRender, boundingBox: BoundingBox, geoCanvasInteract: GeoCanvasInteract, layer: Layer, quadtree: QuadTree) {
        super(shapeRender, boundingBox, geoCanvasInteract, layer, quadtree);
    }

    public handleEvent(e: MouseEvent): void {
        const mouseX: number = e.clientX - this.geoCanvasInteract.canvas.getBoundingClientRect().left;
        const mouseY: number = e.clientY - this.geoCanvasInteract.canvas.getBoundingClientRect().top;
        const canvasX = (mouseX - this.geoCanvasInteract.panX) / this.geoCanvasInteract.zoom;
        const canvasY = (mouseY - this.geoCanvasInteract.panY) / this.geoCanvasInteract.zoom;
        const mouseClickCoordinate: Coordinate = {
            x: canvasX,
            y: canvasY,
        };

        const clickRectangle = Rectangle.createFromClickPoint(mouseClickCoordinate, 20);
        let points: Coordinate[] = [];
        this.quadtree.query(clickRectangle, points);
        const closeCoordinate = this.quadtree.queryClosest(mouseClickCoordinate);
        const layer = this.layer.getGeoObject();
        const data = this.layer.getGeoData()[0];
        let index = 0;

        for (let i = 0; i < layer.length; i++) {
            const contents: Coordinate[] | PolyDataSet = layer[i].shapeContents.contents;

            if (Array.isArray(contents)) {
                for (let j = 0; j < contents.length; j++) {
                    const coord = this.shapeRender.extractCoordinates(contents[j], this.boundingBox);
                    if (this.areNumbersEqual(coord.x, (closeCoordinate as Coordinate).x) && this.areNumbersEqual(coord.y, (closeCoordinate as Coordinate).y)) {
                        console.log('겹치는 좌표: ', contents[j]);
                        console.log('겹치는 화면 좌표: ', coord);
                        index = j;
                    }
                }

                console.log(data[index]);
            }
        }

        console.log('쿼드트리 사각박스 내 point 갯수: ', points);
        console.log(closeCoordinate);
    }

    areNumbersEqual(num1: number, num2: number) {
        const epsilon = 1e-14;
        return Math.abs(num1 - num2) < epsilon;
    }
}
