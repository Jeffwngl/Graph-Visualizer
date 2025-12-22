import { NODESIZE } from "../types/graphs.types";
import type { Vertex, Coordinate } from "../types/graphs.types";

export const drawVertex = (ctx: CanvasRenderingContext2D, v: Vertex) => {
    ctx.beginPath();
    ctx.arc(v.x, v.y, NODESIZE, 0, 2 * Math.PI);
    ctx.fillStyle = v.visited ? "#ba1212ff" : "#ffffffff";
    ctx.fill();
    ctx.strokeStyle = "#000000ff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "12px Arial";
    ctx.fillText(v.id, v.x - 1, v.y + 1);
};

export const drawEdge = (
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
};

export const drawArrow = (
    ctx: CanvasRenderingContext2D,
    v1: Coordinate,
    v2: Coordinate,
    v3: Coordinate
) => {
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
};
