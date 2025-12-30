import type { Vertex, Edge } from "../types/graphs.types";
import type { Dispatch, SetStateAction } from "react";
import { useState, useRef, useEffect } from "react";
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
        console.log("paused");
        while (isPaused.current === true) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    useEffect(() => {
        console.log(isPaused)
    }, [isPaused])

    const generateDfsSteps = ( // TODO: Finish
        startId: string
    ): Step[] => {
        const visited = new Set<string>();
        const steps: Step[] = [];

        const dfsRec = async (currentId: string) => {
            if (visited.has(currentId)) {
                return;
            };

            visited.add(currentId);
            steps.push({ type: "visit", id: currentId })

            setVertices(prev => 
                prev.map(v => 
                    v.id === currentId ? {...v, visited: true} : v
                )
            );

            const currentVertex = vertices.find(v => v.id === currentId);

            if (currentVertex) {
                for (let v of currentVertex.neighbours) {

                    if (visited.has(v.id)) {
                        steps.push({ type: "edge", from: currentId, to: v.id })
                        continue;
                    }

                    dfsRec(v.id);

                    steps.push({ type: "backtrack", id: currentId })
                };
            };
        };
        steps.push({ type: "finish" })
        return steps;
    }

    const dfs = async (startId: string) => { // PREVIOUS FUNCTION
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

            await waitIfPaused();

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

                    await waitIfPaused();

                    if (visited.has(v.id)) {
                        setCurrentCall(`Neighbour ${v.id} already visited, skipping.`);
                        await new Promise(resolve => setTimeout(resolve, DELAY));
                        continue;
                    }
                    setCurrentCall(`Checking neighbour ${v.id}`)

                    await waitIfPaused();

                    await lineAnimation(
                        edgeCanvasRef, 
                        vertices[Number(currentId) - 1], 
                        vertices[Number(v.id) - 1], 
                        DELAY,
                        LINECOLOR,
                        SPEED,
                        stopRequest,
                        vertices,
                        edgeRefs
                    );

                    await dfsRec(v.id);

                    await waitIfPaused();

                    setCurrentCall(`Backtracking from neighbor vertex ${v.id} to ${currentId}`);
                    await circleAnimation(
                        nodeCanvasRef,
                        vertices[Number(currentId) - 1],
                        stopRequest
                    )
                };
            };
        };
        await dfsRec(startId);
        setCurrentCall("Finished.")
        edgeRefs.current = [];
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
        dfs,
        endAnimation
    };
};

// const bfs = (fromVertex: string) => {
//     setVertices(prev => prev.map(v => ({ ...v, visited: false })));
// }