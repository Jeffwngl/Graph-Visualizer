import React, { useEffect, useRef, useState } from "react";
import EditGraph from "./pop-ups/edit";
import Vertex from "./graph-components/Vertex";

type Vertex = {
    id: string;
    width: number;
    x: number;
    y: number;
    visited?: boolean;
    neighbours?: string[];
}

type Edge = {
    from: string;
    to: string;
}

interface connectionStart {
    edgeId: string;
    startX: number;
    startY: number;
}

interface MousePosition {
    x: number;
    y: number;
}

interface tempEdge {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

type canvasProps = {
    editing: boolean;
    setEdit: () => void;
}

export default function Canvas( {editing, setEdit}: canvasProps ) {
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [connectingStart, setConnectingStart] = useState<connectionStart | null>(null);
    const [tempEdge, setTempEdge] = useState<tempEdge | null>(null);
    // const [mouseLoc, setMouseLoc] = useState<MousePosition>({x: 0, y: 0})
    // const [draggedNode, setDraggedNode] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const drawVertex = (ctx: CanvasRenderingContext2D, v: Vertex) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = v.visited ? "#ba1212ff" : "#000000ff";
        ctx.fill();
        ctx.strokeStyle = "#1e3a8a";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v.id, v.x, v.y);
    }

    const drawEdge = (
            ctx: CanvasRenderingContext2D,
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            console.log("Error: Not Able to get Canvas Context.");
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    /* ------------------------------ Not in use ------------------------------ */

    const getCanvasPos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvas.left;
        const y = e.clientY - canvas.top;
        return {
            xPos: x, 
            yPos: y
        };
    };
    
    const getCanvasContext = () => { // not in use
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return;
        };

        const context = canvas.getContext('2d');
        if (!context) {
            console.log("Error: Not Able to get Canvas Context.");
            return;
        };
        return {
            context
        };
    };

    /* ------------------------------ Main canvas inputs ------------------------------ */

    // const canvas = canvasRef.current;
    // if (!canvas) {
    //     console.log("Error: Canvas Element not Found.");
    //     return;
    // };
    // const ctx = canvas.getContext('2d');
    // if (!ctx) {
    //     console.log("Error: Not Able to get Canvas Context.");
    //     return;
    // };

    useEffect(() => {
        drawCanvas();
    }, [vertices, edges, tempEdge]);

    const eraseNodes = () => {
        setEdges([]);
        setVertices([]);
    }

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return;
        };
        const context = canvas.getContext('2d');
        if (!context) {
            console.log("Error: Not Able to get Canvas Context.");
            return;
        };
        clearCanvas();

        // draw edges
        edges.forEach(edge => {
            const fromVertex = vertices.find(v => v.id === edge.from);
            const toVertex = vertices.find(v => v.id === edge.to);
            if (fromVertex && toVertex) {
                drawEdge(
                    context,
                    fromVertex.x,
                    fromVertex.y,
                    toVertex.x,
                    toVertex.y
                );
            };
        });

        // draw dragging connection
        if (tempEdge) {
            drawEdge(
                context,
                tempEdge.startX,
                tempEdge.startY,
                tempEdge.endX,
                tempEdge.endY
            );
        };

        // draw vertices
        vertices.forEach(vertex => {
            drawVertex(context, vertex);
        });
    };

    /* ------------------------------ Mouse handle inputs ------------------------------ */

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): MousePosition => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return {
                x: 0,
                y: 0
            };
        };

        const rec = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rec.left,
            y: e.clientY - rec.top
        };
    };

    // make checks for if mouse in node location
    const checkInVertex = (v: Vertex, x: number, y: number): boolean => {
        if (v.x - v.width <= x && 
            x <= v.x + v.width && 
            v.y - v.width <= y && 
            y <= v.y + v.width) {
                return true;
            };
            return false;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!editing) {
            return;
        }
        const pos = getMousePos(e);
        // check if click location is in vertex to start connection
        for (let i = 0; i < vertices.length; i++) {
            if (checkInVertex(vertices[i], pos.x, pos.y)) {
                setConnectingStart({
                    edgeId: vertices[i].id,
                    startX: vertices[i].x,
                    startY: vertices[i].y

                });
                return;
            } 
            // check for if move mode is toggled and set dragged node (TOADD)
        };
        addVertex(pos.x, pos.y);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);

        if (connectingStart) { // see if it is in a connecting state
            setTempEdge({
                startX: connectingStart.startX,
                startY: connectingStart.startY,
                endX: pos.x,
                endY: pos.y
            });
        };

        return;
    };

    // check for mouse lifted up
    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (connectingStart) {   
            const pos = getMousePos(e);
            for (let i = 0; i < vertices.length; i++) {
                if (vertices[i].id != connectingStart.edgeId && checkInVertex(vertices[i], pos.x, pos.y)) {
                    addEdge(connectingStart.edgeId, vertices[i].id);
                    break;
                    };
                };
        };

        setConnectingStart(null)
        setTempEdge(null);
    }

    // function to move node (TOADD)
    // if (isDragging) {
    //     drawEdge(
    //         ctx,
    //         isDragging.startX,
    //         isDragging.startY,
    //         isDragging.endX,
    //         isDragging.endY
    //     );
    // };

    // const addItem = (e: React.MouseEvent, editing: boolean) => {
    //     if (!editing) {
    //         return;
    //     };
    //     const x = getCanvasPos(e).xPos
    //     const y = getCanvasPos(e).yPos

    //     for (let i = 0; i < vertices.length; i++) { // clicked on existing vertex
    //         if ((vertices[i].x - 20 <= x) && 
    //             (x <= vertices[i].x + 20) && 
    //             (vertices[i].y - 20 <= y) && 
    //             (y <= vertices[i].y + 20)) {

    //             return;
    //         };
    //     };
    //     addVertex(x, y);
    // };

    const addVertex = (x: number, y: number) => {
        const newVertex: Vertex = {
            id: (vertices.length + 1).toString(),
            width: 20,
            x: x,
            y: y,
            visited: false,
            neighbours: []
        };
        setVertices([...vertices, newVertex]);
        console.log("vertex added: " + vertices[vertices.length - 1].id);
    };

    const addEdge = (fromId: string, toId: string) => {
        setEdges(prev => [...prev, { from: fromId, to: toId }]);
        console.log("edge from: " + fromId)
        console.log("edge to: " + toId)
    };

    return (
        <>
        {editing && (
            <EditGraph 
            closePopUp={ setEdit }
            clearCanvas={ eraseNodes }
            />
        )}
        <canvas 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={canvasRef} 
            width={window.innerWidth} 
            height={window.innerHeight - 190}
            style={{
                position: "absolute",
                top: 120,
                left: 0,
                width: "100%",
                height: "calc(100% - 190px)",
                zIndex: 0,
            }}>
            Use a browser that can use HTML Canvas.
        </canvas>
        </>
    )
}