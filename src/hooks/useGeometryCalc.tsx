import { ARROWWIDTH, ARROWHEIGHT, NODESIZE } from "../types/graphs.types";
import type { Coordinate } from "../types/graphs.types";

// export const calculateArrow = (x1: number, y1: number, x2: number, y2: number) => {
//     const dx = x2 - x1;
//     const dy = y2 - y1;
//     const angle = Math.atan2(dy, dx);
//     const tipX = x2 + Math.cos(angle) * ARROWHEIGHT;
//     const tipY = y2 + Math.sin(angle) * ARROWHEIGHT;

//     const perpAngle = angle + Math.PI / 2;
//     const edge1X = x2 + Math.cos(perpAngle) * ARROWWIDTH;
//     const edge1Y = x2 + Math.sin(perpAngle) * ARROWWIDTH;
//     const edge2X = x2 - Math.cos(perpAngle) * ARROWWIDTH;
//     const edge2Y = x2 - Math.sin(perpAngle) * ARROWWIDTH;

//     return {
//         v1: { x: edge1X, y: edge1Y },
//         v2: { x: tipX, y: tipY },
//         v3: { x: edge2X, y: edge2Y }
//     };
// };


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

export const calculateOffset = ( x1: number, y1: number, x2: number, y2: number ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy *dy);
    const unitX = dx / d;
    const unitY = dy / d;
    const edgeX = x2 - (NODESIZE + ARROWHEIGHT) * unitX;
    const edgeY = y2 - (NODESIZE + ARROWHEIGHT) * unitY;
    return {
        x: edgeX,
        y: edgeY
    }
}