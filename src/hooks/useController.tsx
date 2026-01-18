import type { Dispatch, SetStateAction } from "react";
import { useState, useRef } from "react";
import type { Vertex, Edge, Step } from "../types/graphs.types";
import { lineAnimation, circleAnimation } from "../animations/Animations";
import { DELAY, LINECOLOR, SPEED } from "../types/graphs.types";
import { drawEdge, drawVisitedVertex } from "./useCanvasDraw";
import { version } from "react-dom/static";

// TODO: Animations don't refresh with skipped step so fix it so that the animation
// refreshes at the right steps.

export const useController = (
    vertices: Vertex[],
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
    edgeCanvasRef: React.RefObject<HTMLCanvasElement | null>,
    nodeCanvasRef: React.RefObject<HTMLCanvasElement | null>,
    edgeRefs: React.RefObject<Edge[]>,
    vertexRefs: React.RefObject<Vertex[]>,
    isPaused: React.RefObject<boolean>,
    setCurrentCall: Dispatch<SetStateAction<string>>,
    globalSteps: React.RefObject<Step[]>,
    stopRequest: React.RefObject<boolean>
) => {
    const currStep = useRef(0);

    const resetGraph = () => {
        setVertices(prev => prev.map(v => ({ ...v, visited: false})));
        edgeRefs.current = [];
        vertexRefs.current = [];
        setCurrentCall("");

        const edgeCanvas = edgeCanvasRef.current;
        if (!edgeCanvas) return;
        const edgeContext = edgeCanvas.getContext('2d');
        if (!edgeContext) return;

        edgeContext.clearRect(0, 0, edgeCanvas.width, edgeCanvas.height);
    };

    const waitIfPaused = async () => {
        while (isPaused.current === true) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    };

    const moveOneForward = async (step: Step) => {
        switch (step.type) {
            case "visit":
                setCurrentCall(`Visiting Vertex ${ step.id }.`);
                setVertices(prev => 
                    prev.map(v => 
                        v.id === step.id ? {...v, visited: true} : v
                    )
                );
                break;

            case "edge":
                setCurrentCall(`Checking neighbour ${ step.to }`)
                break;

            case "backtrack":
                setCurrentCall(`Backtracking from neighbour vertex to ${ step.id }`);
                break;

            case "finish":
                setCurrentCall(`Finished.`);
        }
    };

    const moveStepForward = async () => {
        if (currStep.current >= globalSteps.current.length) return;
        moveOneForward(globalSteps.current[currStep.current]);
        const step = globalSteps.current[currStep.current];
        
        // MOVE ANIMATIONS HERE
        switch (step.type) {
            case "visit":
                break;

            case "edge":
                await lineAnimation(
                    edgeCanvasRef, 
                    vertices[Number(step.from) - 1], 
                    vertices[Number(step.to) - 1], 
                    DELAY,
                    LINECOLOR,
                    SPEED,
                    stopRequest,
                    vertices,
                    edgeRefs
                )
                break;

            case "backtrack":
                await circleAnimation(
                    nodeCanvasRef,
                    vertices[Number(step.id) - 1],
                    stopRequest,
                    vertexRefs
                )
                break;
        };

        currStep.current++;
        console.log("move forward.")
    };

    const moveStepBackward = () => {
        if (currStep.current === 0) return;
        console.log("moving back.")
        stopRequest.current = true; // this isnt triggering the stoprequest in animations
        resetGraph();

        for (let i = 0; i < currStep.current - 1; i++) {
            moveOneForward(globalSteps.current[i]);
        };

        currStep.current--;

        redrawCurrentStep();
        stopRequest.current = false;
    };

    const skipForward = () => {

        return;
    }

    const executeTraversal = async () => {
        stopRequest.current = false;

        while (currStep.current < globalSteps.current.length) {
            console.log(currStep.current)
            if (stopRequest.current) {
                console.log("Stopping.")
                return;
            }

            await waitIfPaused();
            moveStepForward();

            await new Promise(resolve => setTimeout(resolve, DELAY));
        }
        currStep.current = 0;
    };
    
    const redrawCurrentStep = () => {
        const edgeCanvas = edgeCanvasRef.current;
        if (!edgeCanvas) return;
        const edgeContext = edgeCanvas.getContext("2d");
        if (!edgeContext) return;

        const vertexCanvas = nodeCanvasRef.current;
        if (!vertexCanvas) return;
        const vertexContext = vertexCanvas.getContext("2d");
        if (!vertexContext) return;

        // Redraw all path edges
        for (const edge of edgeRefs.current) {
            const fromVertex = vertices.find(v => v.id === edge.from);
            const toVertex = vertices.find(v => v.id === edge.to);
            if (fromVertex && toVertex) {
                // TODO: fix this to use actual global constants
                drawEdge(edgeContext, fromVertex.x, fromVertex.y, toVertex.x, toVertex.y, "orange", 6);
            }
        };

        // Redraw all visited vertices
        for (const v of vertexRefs.current) {
            drawVisitedVertex(vertexContext, v);
        };
    };

    return {
        moveStepForward,
        moveStepBackward,
        executeTraversal,
        currStep
    };
}