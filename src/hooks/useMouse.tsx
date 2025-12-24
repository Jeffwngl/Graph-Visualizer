import { useState } from "react";
import { type connectionStart, type tempEdge, type Arrow, type Coordinate, type Vertex} from "../types/graphs.types";
import { NODESIZE, ARROWHEIGHT } from "../types/graphs.types";
import { checkInVertex, getMousePos } from "./useHelpers";
import { calculateOffset, calculateArrow } from "./useGeometryCalc"

export const useMouseHandler = (
    vertices: Vertex[],
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    editing: boolean,
    inputing: boolean,
    addVertex: (x: number, y: number) => void,
    addEdge: (from: string, to: string) => void
    ) => {
    const [connectingStart, setConnectingStart] = useState<connectionStart | null>(null);
    const [tempEdge, setTempEdge] = useState<tempEdge | null>(null);
    const [tempArrow, setTempArrow] = useState<Arrow | null>({ v1: {x: 0, y: 0}, v2: {x: 0,y: 0}, v3: {x: 0, y: 0} });
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [offset, setOffset] = useState<Coordinate>({ x: 0, y: 0 });
    const [mouseLoc, setMouseLoc] = useState<Coordinate>({x: 0, y: 0});

    const canvas = canvasRef.current;
    if (!canvas) {
        console.log("Canvas not found.");
        const noop = (_e?: React.MouseEvent<HTMLCanvasElement>): void => {};
        return {
            handleMouseDown: noop,
            handleMouseMove: noop,
            handleMouseUp: noop,
            tempArrow,
            tempEdge,
            mouseLoc
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        const pos = getMousePos(e, canvas);
        if (editing) { // add new vertex
            for (let v of vertices) {
                if (checkInVertex(v, pos.x, pos.y)) {
                    setConnectingStart({
                        edgeId: v.id,
                        startX: v.x,
                        startY: v.y
                    });
                    return;
                };
            };
            addVertex(pos.x, pos.y);
        }
        if (!inputing) {
            for (let v of vertices) { // move vertex
                if (checkInVertex(v, pos.x, pos.y)) {
                    setDraggedNode(v.id);
                    setOffset({ x: v.x - pos.x, y: v.y - pos.y });
                    return;
                };
            };
        };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (connectingStart) { // see if it is in a connecting state
            const pos = getMousePos(e, canvas);
            for (let v of vertices) {
                if (checkInVertex(v, pos.x, pos.y)) {
                    setTempEdge({
                        startX: connectingStart.startX,
                        startY: connectingStart.startY,
                        endX: v.x,
                        endY: v.y
                    });
                    // add calculate arrow at edge of node
                    const vertexEdge = calculateOffset(connectingStart.startX, connectingStart.startY, v.x, v.y, NODESIZE, ARROWHEIGHT);
                    if (vertexEdge) {
                        const arrow = calculateArrow(connectingStart.startX, connectingStart.startY, vertexEdge.x, vertexEdge.y);
                        if (arrow) {
                            setTempArrow(arrow);
                        };
                    };
                    return;
                };
            };
            
            // dragging state
            setTempEdge({
                startX: connectingStart.startX,
                startY: connectingStart.startY,
                endX: pos.x,
                endY: pos.y
            });
            const arrow = calculateArrow(connectingStart.startX, connectingStart.startY, pos.x, pos.y);
            if (arrow) {
                setTempArrow(arrow);
            }
        }
        else if (draggedNode) { // see if it is in a moving state
            const pos = getMousePos(e, canvas);
            setMouseLoc({ x: pos.x, y: pos.y });
            vertices.forEach((v) => {
                if (v.id === draggedNode) {
                    v.x = pos.x - offset.x;
                    v.y = pos.y - offset.y;
                };
            });
        };
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (connectingStart) {   
            const pos = getMousePos(e, canvas);
            for (let i = 0; i < vertices.length; i++) {
                if (vertices[i].id != connectingStart.edgeId && checkInVertex(vertices[i], pos.x, pos.y)) {
                    addEdge(connectingStart.edgeId, vertices[i].id); // add edge
                    break;
                };
            };
            setTempArrow(null);
            setConnectingStart(null);
            setTempEdge(null);
            return;
            };

        setDraggedNode(null);
        setOffset({ x: 0, y: 0 });
        setMouseLoc({ x: 0, y: 0});
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        tempArrow,
        tempEdge,
        mouseLoc
    };
};