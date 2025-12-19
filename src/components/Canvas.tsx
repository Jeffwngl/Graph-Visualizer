import React, { useEffect, useRef, useState } from "react";
import EditGraph from "./pop-ups/edit";
import Vertex from "./graph-components/Vertex";

const NODESIZE = 20;
const ARROWHEIGHT = 10;
const ARROWWIDTH = 5;

type Vertex = {
    id: string;
    width: number;
    x: number;
    y: number;
    visited: boolean;
    neighbours: Vertex[];
}

type Edge = {
    from: string;
    to: string;
}

type Coordinate = {
    x: number;
    y: number;
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

interface Dimensions {
    height: number;
    width: number;
}

interface Offset {
    x: number;
    y: number;
}

interface Arrow {
    v1: Coordinate;
    v2: Coordinate;
    v3: Coordinate;
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
    const [mouseLoc, setMouseLoc] = useState<MousePosition>({x: 0, y: 0});
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<Dimensions>({ height: window.innerHeight, width: window.innerWidth});
    const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
    const [tempArrow, setTempArrow] = useState<Arrow | null>({ v1: {x: 0, y: 0}, v2: {x: 0,y: 0}, v3: {x: 0, y: 0} });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const drawVertex = (ctx: CanvasRenderingContext2D, v: Vertex) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, NODESIZE, 0, 2 * Math.PI);
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

    const drawArrow = (
        ctx: CanvasRenderingContext2D,
        v1: Coordinate,
        v2: Coordinate,
        v3: Coordinate
    ) => {
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
    }

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

    useEffect(() => {
        drawCanvas();
    }, [vertices, edges, tempEdge, mouseLoc]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    });

    const handleResize = () => {
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        })
        drawCanvas();
    }

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
                const edgePos = calculateOffset(fromVertex.x, fromVertex.y, toVertex.x, toVertex.y)
                // calculate arrow vertices
                if (edgePos) {
                    const arrow = calculateArrow(fromVertex.x, fromVertex.y, edgePos.x, edgePos.y);
                    console.log("vx: " + toVertex.x)
                    console.log("vy: " + toVertex.y)
                    console.log("edgex: " + edgePos.x)
                    console.log("edgey: " + edgePos.y)
                    if (arrow) {
                        drawArrow(context, arrow.v1, arrow.v2, arrow.v3);
                    }
                }
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

        if (tempArrow) {
            drawArrow(
                context,
                tempArrow.v1,
                tempArrow.v2,
                tempArrow.v3
            );
        };

        // draw vertices
        vertices.forEach(vertex => {
            drawVertex(context, vertex);
        });
    };

    /* ------------------------------ Get arrow coordinates ------------------------------ */

    const calculateArrow = (x1: number, y1: number, x2: number, y2: number) => { // change input argument to a location instead of a mouse event
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const tipX = x2 + Math.cos(angle) * ARROWHEIGHT;
        const tipY = y2 + Math.sin(angle) * ARROWHEIGHT;

        const perpAngle = angle + Math.PI / 2;
        const edge1X = x2 + Math.cos(perpAngle) * ARROWWIDTH;
        const edge1Y = x2 + Math.sin(perpAngle) * ARROWWIDTH;
        const edge2X = x2 - Math.cos(perpAngle) * ARROWWIDTH;
        const edge2Y = x2 - Math.sin(perpAngle) * ARROWWIDTH;

        return {
            v1: { x: edge1X, y: edge1Y },
            v2: { x: tipX, y: tipY },
            v3: { x: edge2X, y: edge2Y }

        };
    };

    const calculateOffset = ( x1: number, y1: number, x2: number, y2: number ) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const d = Math.sqrt(dx * dx + dy *dy);
        const unitX = dx / d; // unit vectors in x and y direction
        const unitY = dy / d;
        const edgeX = x2 - (NODESIZE + ARROWHEIGHT) * unitX;
        const edgeY = y2 - (NODESIZE + ARROWHEIGHT) * unitY;
        return {
            x: edgeX,
            y: edgeY
        }
    }

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
        const pos = getMousePos(e);
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
        for (let v of vertices) { // move vertex
            if (checkInVertex(v, pos.x, pos.y)) {
                setDraggedNode(v.id);
                setOffset({ x: v.x - pos.x, y: v.y - pos.y });
                return;
            };
        };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (connectingStart) { // see if it is in a connecting state
            const pos = getMousePos(e);
            for (let v of vertices) {
                if (checkInVertex(v, pos.x, pos.y)) {
                    setTempEdge({
                        startX: connectingStart.startX,
                        startY: connectingStart.startY,
                        endX: v.x,
                        endY: v.y
                    });
                    // add calculate arrow at edge of node
                    const vertexEdge = calculateOffset(connectingStart.startX, connectingStart.startY, v.x, v.y);
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
            const pos = getMousePos(e);
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
            const pos = getMousePos(e);
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

    const addVertex = (x: number, y: number) => {
        const newVertex: Vertex = {
            id: (vertices.length + 1).toString(),
            width: NODESIZE,
            x: x,
            y: y,
            visited: false,
            neighbours: []
        };
        setVertices([...vertices, newVertex]);
        // console.log("vertex added: " + vertices[vertices.length - 1].id);
    };

    const addEdge = (fromId: string, toId: string) => { // maybe change this to take in a vertex object
        setEdges(prev => [...prev, { from: fromId, to: toId }]);
        console.log("edge from: " + fromId)
        console.log("edge to: " + toId)
        // find to vertex
        let toVertex;
        for (let v of vertices) {
            if (v.id == toId) {
                toVertex = v;
            }
        }
        // find from vertex and append to vertex to neighbours
        for (let v of vertices) {
            if (v.id == fromId) {
                if (toVertex) {
                    v.neighbours.push(toVertex);
                }
                break;
            }
        }
    };

    const dfs = async (fromVertex: string, delay: number = 1000) => {

        setVertices(prev => prev.map(v => ({ ...v, visited: false })));

        let startingVertex = vertices.find(v => v.id === fromVertex);
        if (!startingVertex) {
            console.log("Node not found.");
        };

        const dfsRec = async (currentId: string) => {
            setVertices(prev => prev.map(v => v.id === currentId ? {...v, visited: true} : v));
            await new Promise(resolve => setTimeout(resolve, delay));
            const currentVertex = vertices.find(v => v.id === currentId);
            if (currentVertex) {
                for (let v of currentVertex.neighbours) {
                    await dfsRec(v.id);
                };
            };
        };

        await dfsRec(fromVertex);
    }

    const bfs = (fromVertex: string) => {
        setVertices(prev => prev.map(v => ({ ...v, visited: false })));
    }

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