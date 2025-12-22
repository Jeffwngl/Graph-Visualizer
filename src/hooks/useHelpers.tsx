import type { Vertex, Coordinate } from "../types/graphs.types";

export const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): Coordinate => {
    if (!canvas) {
        console.log("Error: Canvas Element not Found.");
        return {
            x: 0,
            y: 0
        };
    };

    const rec = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rec.left,
        y: e.clientY - rec.top
    };
};

// make checks for if mouse in node location
export const checkInVertex = (v: Vertex, x: number, y: number): boolean => {
    if (v.x - v.width <= x && 
        x <= v.x + v.width && 
        v.y - v.width <= y && 
        y <= v.y + v.width) {
            return true;
    };
    return false;
};