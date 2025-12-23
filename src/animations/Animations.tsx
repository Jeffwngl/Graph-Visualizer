import type { Coordinate, Vertex } from "../types/graphs.types"

const LINEWIDTH = 6;

export type Animation = { // UNUSED
    cancel: () => void;
    run: () => Promise<void>;
}

export const lineAnimation = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    fromVertex: Vertex,
    toVertex: Vertex,
    delay: number, // FIX BAND AID METHOD
    color: string,
    increment: number
): Promise<void> => {
    let t = 0;

    return new Promise(resolve => {
        const canvas = canvasRef.current;
        if (!canvas) return resolve();

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();

        const animate = () => {
            const x = fromVertex.x + (toVertex.x - fromVertex.x) * t;
            const y = fromVertex.y + (toVertex.y - fromVertex.y) * t;

            ctx.beginPath();
            ctx.moveTo(fromVertex.x, fromVertex.y);
            ctx.lineTo(x, y);
            ctx.lineWidth = LINEWIDTH;
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