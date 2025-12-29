import type { Vertex } from "../types/graphs.types";
import type { Dispatch, SetStateAction } from "react";
import { useState, useRef } from "react";
import { lineAnimation, circleAnimation } from "../animations/Animations";

const DELAY = 1000;
const LINECOLOR = 'orange';
const SPEED = 0.02;

export const useAlgos = (
    vertices: Vertex[],
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
    setCurrentCall: Dispatch<SetStateAction<string>>,
    edgeCanvasRef: React.RefObject<HTMLCanvasElement | null>,
    nodeCanvasRef: React.RefObject<HTMLCanvasElement | null>
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

            setCurrentCall(`Visiting vertex ${currentId}`);

            setVertices(prev => 
                prev.map(v => 
                    v.id === currentId ? {...v, visited: true} : v
                )
            );

            await new Promise(resolve => setTimeout(resolve, DELAY));
            const currentVertex = vertices.find(v => v.id === currentId);

            if (currentVertex) {
                for (let v of currentVertex.neighbours) {
                    if (visited.has(v.id)) {
                        setCurrentCall(`Neighbour ${v.id} already visited, skipping.`);
                        await new Promise(resolve => setTimeout(resolve, DELAY));
                        continue;
                    }
                    setCurrentCall(`Checking neighbour ${v.id}`)
                    await lineAnimation(
                        edgeCanvasRef, 
                        vertices[Number(currentId) - 1], 
                        vertices[Number(v.id) - 1], 
                        DELAY,
                        LINECOLOR,
                        SPEED
                    );

                    await dfsRec(v.id);
                    setCurrentCall(`Backtracking from neighbor vertex ${v.id} to ${currentId}`);
                    await circleAnimation(
                        nodeCanvasRef,
                        vertices[Number(currentId) - 1]
                    )
                    // await new Promise(resolve => setTimeout(resolve, DELAY));
                };
            };
        };
        await dfsRec(startId);
        setCurrentCall("Finished.")
        setIsAnimating(false);
    };

    const endAnimation = () => {
        const canvas = edgeCanvasRef.current;
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
        endAnimation
    };
};

// const bfs = (fromVertex: string) => {
//     setVertices(prev => prev.map(v => ({ ...v, visited: false })));
// }