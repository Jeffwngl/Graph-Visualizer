import type { Vertex } from "../types/graphs.types";
import type { Dispatch, SetStateAction } from "react";
import { useState, useRef } from "react";
import { lineAnimation } from "../animations/Animations";

const DELAY = 1000;
const LINECOLOR = 'orange';
const SPEED = 0.02;

export const useAlgos = (
    vertices: Vertex[],
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const stopRequest = useRef(false);

    const dfs = async (startId: string) => {
        setVertices(prev => 
            prev.map(v => ({ ...v, visited: false}))
        );

        stopRequest.current = false;

        const visited = new Set<string>();

        const dfsRec = async (currentId: string) => {
            if (stopRequest.current) {
                return;
            };
            if (visited.has(currentId)) {
                return;
            };

            visited.add(currentId);

            setVertices(prev => 
                prev.map(v => 
                    v.id === currentId ? {...v, visited: true} : v
                )
            );

            await new Promise(resolve => setTimeout(resolve, DELAY));
            const currentVertex = vertices.find(v => v.id === currentId);

            if (currentVertex) {
                for (let v of currentVertex.neighbours) {
                    if (visited.has(v.id)) continue;

                    await lineAnimation(
                        canvasRef, 
                        vertices[Number(currentId) - 1], 
                        vertices[Number(v.id) - 1], 
                        DELAY,
                        LINECOLOR,
                        SPEED
                    );

                    await dfsRec(v.id);
                };
            };
        };
        await dfsRec(startId);
        setIsAnimating(false);
    };

    const stopAnimation = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stopRequest.current = true;
        setIsAnimating(false)
        setVertices(prev => prev.map(v => ({ ...v, visited: false})));
    };

    return {
        dfs,
        isAnimating,
        stopAnimation
    };
};

// const bfs = (fromVertex: string) => {
//     setVertices(prev => prev.map(v => ({ ...v, visited: false })));
// }