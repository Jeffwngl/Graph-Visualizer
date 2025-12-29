import type { Coordinate, Vertex } from "../types/graphs.types"
import { NODESIZE } from "../types/graphs.types";
import { useRef } from "react";

const LINEWIDTH = 6;

export const circleAnimation = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    Vertex: Vertex,
    stopRequest: React.RefObject<boolean>
): Promise<void> => {
    return new Promise(resolve => {
        const canvas = canvasRef.current;
        if (!canvas) return resolve();

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve();

        let alpha = 0;
        let increment = 0.02;

        const animate = () => {
            if (stopRequest.current) {
                return resolve();
            }
            ctx.beginPath();
            ctx.arc(Vertex.x, Vertex.y, NODESIZE, 0, Math.PI * 2, false)
            ctx.strokeStyle = `rgba(76, 245, 93, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();

            alpha += increment;

            if (alpha < 1) {
                requestAnimationFrame(animate);
            }
            else {
                resolve();
            }
        }
        animate();
    })
};

export const lineAnimation = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    fromVertex: Vertex,
    toVertex: Vertex,
    delay: number, // FIX BAND AID METHOD
    color: string,
    increment: number,
    stopRequest: React.RefObject<boolean>
): Promise<void> => {
    let t = 0;

    return new Promise(resolve => {
        const canvas = canvasRef.current;
        if (!canvas) return resolve();

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();

        const animate = () => {
            if (stopRequest.current) {
                return resolve();
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
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
    })
};