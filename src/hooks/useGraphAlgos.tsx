import type { Vertex, Edge } from "../types/graphs.types";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

const DELAY = 1000;

export const useAlgos = (
    vertices: Vertex[],
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
) => {
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const dfs = async (startId: string) => {
        setVertices(prev => prev.map(v => ({ ...v, visited: false})));

        const visited = new Set<string>();

        const dfsRec = async (currentId: string) => {
            if (visited.has(currentId)) {
                return;
            };
            setVertices(prev => prev.map(v => v.id === currentId ? {...v, visited: true} : v));
            await new Promise(resolve => setTimeout(resolve, DELAY));
            const currentVertex = vertices.find(v => v.id === currentId);
            if (currentVertex) {
                for (let v of currentVertex.neighbours) {
                    await dfsRec(v.id);
                };
            };
        };
        await dfsRec(startId);
        setIsAnimating(false);
    };

    const stopAnimation = () => {
        setIsAnimating(false)
        setVertices(prev => prev.map(v => ({ ...v, visited: false})));
    }

    return {
        dfs,
        isAnimating,
        stopAnimation
    }
};

// const bfs = (fromVertex: string) => {
//     setVertices(prev => prev.map(v => ({ ...v, visited: false })));
// }