import { ARROWWIDTH, ARROWHEIGHT, NODESIZE } from "../types/graphs.types";
import type { Coordinate } from "../types/graphs.types";

export const calculateArrow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
    ) => {
    const c1 = ARROWHEIGHT;
    const c2 = ARROWWIDTH;

    const angle = Math.atan2(y2 - y1, x2 - x1);

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const v2: Coordinate = {
        x: x2 + cos * c1,
        y: y2 + sin * c1
    };

    const v1: Coordinate = {
        x: x2 - sin * c2,
        y: y2 + cos * c2
    };

    const v3: Coordinate = {
        x: x2 + sin * c2,
        y: y2 - cos * c2
    };

    return { v1, v2, v3 };
};

export const calculateOffset = ( x1: number, y1: number, x2: number, y2: number, nodeSize: number, arrowHeight: number ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy *dy);
    const unitX = dx / d;
    const unitY = dy / d;
    const edgeX = x2 - (nodeSize + arrowHeight) * unitX;
    const edgeY = y2 - (nodeSize + arrowHeight) * unitY;
    return {
        x: edgeX,
        y: edgeY
    }
}