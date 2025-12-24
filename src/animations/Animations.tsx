import { calculateOffset } from "../hooks/useGeometryCalc";
import type { Coordinate, Vertex } from "../types/graphs.types"
import { NODESIZE } from "../types/graphs.types";

export type Animation = { // UNUSED
    cancel: () => void;
    run: () => Promise<void>;
}

const circleAnimation = (
    location: Coordinate,
    delay: number,
    color: string
) => {

    
}

export const lineAnimation = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    fromVertex: Vertex,
    toVertex: Vertex,
    delay: number,
    color: string,
    increment: number
): Promise<void> => {
    let t = 0;
    const toCoord: Coordinate = calculateOffset(fromVertex.x, fromVertex.y, toVertex.x, toVertex.y, NODESIZE, 0);
    const fromCoord: Coordinate = calculateOffset(toVertex.x, toVertex.y, fromVertex.x, fromVertex.y, NODESIZE, 0);

    return new Promise(resolve => {
        const canvas = canvasRef.current;
        if (!canvas) return resolve();

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();

        const animate = () => {
            const x = fromCoord.x + (toCoord.x - fromCoord.x) * t;
            const y = fromCoord.y + (toCoord.y - fromCoord.y) * t;

            ctx.beginPath();
            ctx.moveTo(fromCoord.x, fromCoord.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = color;
            ctx.stroke();

            if (t < 1) {
                t += increment;
                requestAnimationFrame(animate);
            } 
            else {
                resolve();
            };
        };
        requestAnimationFrame(animate);
    }
);
};