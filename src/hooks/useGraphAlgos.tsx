import type { Vertex, Edge } from "../types/graphs.types";
import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import { lineAnimation, circleAnimation } from "../animations/Animations";
import type { Step } from "../types/graphs.types";

const DELAY = 1000;
const LINECOLOR = 'orange';
const SPEED = 0.02;

export const useAlgos = (
    vertices: Vertex[],
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
    setCurrentCall: Dispatch<SetStateAction<string>>,
    edgeCanvasRef: React.RefObject<HTMLCanvasElement | null>,
    nodeCanvasRef: React.RefObject<HTMLCanvasElement | null>,
    isPaused: React.RefObject<boolean>,
    edgeRefs: React.RefObject<Edge[]>
) => {
    const stopRequest = useRef(false);

    const waitIfPaused = async () => {
        while (isPaused.current === true) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    const generateDfsSteps = (
        startId: string
    ): Step[] => {
        const visited = new Set<string>();
        const steps: Step[] = [];

        const dfsRec = (currentId: string) => {
            if (visited.has(currentId)) {
                return;
            };

            visited.add(currentId);
            steps.push({ type: "visit", id: currentId })

            const currentVertex = vertices.find(v => v.id === currentId);

            if (currentVertex) {
                for (let v of currentVertex.neighbours) {
                    if (visited.has(v.id)) {
                        continue;
                    }

                    steps.push({ type: "edge", from: currentId, to: v.id })

                    dfsRec(v.id);

                    steps.push({ type: "backtrack", id: currentId })
                };
            };
        };
        dfsRec(startId);
        steps.push({ type: "finish" })
        return steps;
    };

    const executeTraversal = async (
        steps: Step[]
    ) => {
        stopRequest.current = false;
        for (const item of steps) {
            if (stopRequest.current) return;

            await waitIfPaused();

            switch (item.type) {
                case "visit": {
                    setCurrentCall(`Visiting Vertex ${ item.id }.`);

                    setVertices(prev => 
                        prev.map(v => 
                            v.id === item.id ? {...v, visited: true} : v
                        )
                    );

                    await new Promise(resolve => setTimeout(resolve, DELAY));
                    break;
                }

                case "edge": {
                    setCurrentCall(`Checking neighbour ${ item.to }`)

                    await lineAnimation(
                        edgeCanvasRef, 
                        vertices[Number(item.from) - 1], 
                        vertices[Number(item.to) - 1], 
                        DELAY,
                        LINECOLOR,
                        SPEED,
                        stopRequest,
                        vertices,
                        edgeRefs
                    );

                    break;
                }

                case "backtrack": {
                    setCurrentCall(`Backtracking from neighbour vertex to ${ item.id }`);
                    
                    await circleAnimation(
                        nodeCanvasRef,
                        vertices[Number(item.id) - 1],
                        stopRequest
                    )

                    break;
                }

                case "finish": {
                    setCurrentCall(`Finished.`);
                    edgeRefs.current = [];
                    break;
                }
            }
        }
    };

    const endAnimation = () => {
        const canvas = edgeCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stopRequest.current = true;
        edgeRefs.current = [];
        setVertices(prev => prev.map(v => ({ ...v, visited: false})));
    };

    return {
        generateDfsSteps,
        executeTraversal,
        endAnimation
    };
};

// const bfs = (fromVertex: string) => {
//     setVertices(prev => prev.map(v => ({ ...v, visited: false })));
// }