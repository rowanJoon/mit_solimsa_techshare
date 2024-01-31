import { GeoCanvasEventHandler } from './GeoCanvasEventHandler.js';

export class MouseMoveEventHandler extends GeoCanvasEventHandler {
    handleEvent(e: MouseEvent): void {
        if (this.geoCanvasInteract.isDragging) {
            const deltaX: number = e.clientX - this.geoCanvasInteract.dragStartX;
            const deltaY: number = e.clientY - this.geoCanvasInteract.dragStartY;

            this.geoCanvasInteract.panX = deltaX;
            this.geoCanvasInteract.panY = deltaY;
        }
    }
}
