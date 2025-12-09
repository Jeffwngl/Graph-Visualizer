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
    const [arrow, setArrow] = useState<Arrow | null>({ v1: {x: 0, y: 0}, v2: {x: 0,y: 0}, v3: {x: 0, y: 0} });

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

        if (arrow) {
            drawArrow(
                context,
                arrow.v1,
                arrow.v2,
                arrow.v3
            );
        };

        // draw vertices
        vertices.forEach(vertex => {
            drawVertex(context, vertex);
        });
    };

    /* ------------------------------ Get arrow coordinates ------------------------------ */

    const calculateArrow = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);
        const c1 = 10;
        const c2 = 5;
        let v1: Coordinate = {x: pos.x, y: pos.y};
        let v2: Coordinate = {x: pos.x, y: pos.y};
        let v3: Coordinate = {x: pos.x, y: pos.y};

        if (connectingStart) {
            const a = Math.abs(connectingStart.startX - pos.x);
            const b = Math.abs(pos.y - connectingStart.startY);
            const alpha = Math.atan(b / a);
            // quadrant 1
            if (pos.x < connectingStart.startX && pos.y > connectingStart.startY) {
                v2 = {
                    x: pos.x - Math.cos(alpha) * c1,
                    y: pos.y + Math.sin(alpha) * c1
                };
                v1 = {
                    x: pos.x - Math.sin(alpha) * c2,
                    y: pos.y - Math.cos(alpha) * c2
                };
                v3 = {
                    x: pos.x + Math.sin(alpha) * c2,
                    y: pos.y + Math.cos(alpha) * c2
                };
            }
            // quadrant 2
            else if (pos.x > connectingStart.startX && pos.y > connectingStart.startY) {
                v2 = {
                    x: pos.x + Math.cos(alpha) * c1,
                    y: pos.y + Math.sin(alpha) * c1
                };
                v1 = {
                    x: pos.x - Math.sin(alpha) * c2,
                    y: pos.y + Math.cos(alpha) * c2
                };
                v3 = {
                    x: pos.x + Math.sin(alpha) * c2,
                    y: pos.y - Math.cos(alpha) * c2
                };
            }
            // quadrant 3
            else if (pos.x < connectingStart.startX && pos.y < connectingStart.startY) {
                v2 = {
                    x: pos.x - Math.cos(alpha) * c1,
                    y: pos.y - Math.sin(alpha) * c1
                };
                v1 = {
                    x: pos.x + Math.sin(alpha) * c2,
                    y: pos.y - Math.cos(alpha) * c2
                };
                v3 = {
                    x: pos.x - Math.sin(alpha) * c2,
                    y: pos.y + Math.cos(alpha) * c2
                };
            }
            // quadrant 4
            else if (pos.x > connectingStart.startX && pos.y < connectingStart.startY) {
                v2 = {
                    x: pos.x + Math.cos(alpha) * c1,
                    y: pos.y - Math.sin(alpha) * c1
                };
                v1 = {
                    x: pos.x + Math.sin(alpha) * c2,
                    y: pos.y + Math.cos(alpha) * c2
                };
                v3 = {
                    x: pos.x - Math.sin(alpha) * c2,
                    y: pos.y - Math.cos(alpha) * c2
                };
            }
            // parallel cases
            else if (pos.x == connectingStart.startX && pos.y == connectingStart.startY) {

            }
            else if (pos.x == connectingStart.startX && pos.y > connectingStart.startY) {
                v2 = {
                    x: pos.x,
                    y: pos.y + c1
                };
                v1 = {
                    x: pos.x - c2,
                    y: pos.y
                };
                v3 = {
                    x: pos.x + c2,
                    y: pos.y
                }; 
            }
            else if (pos.x == connectingStart.startX && pos.y < connectingStart.startY) {
                v2 = {
                    x: pos.x,
                    y: pos.y - c1
                };
                v1 = {
                    x: pos.x - c2,
                    y: pos.y
                };
                v3 = {
                    x: pos.x + c2,
                    y: pos.y
                }; 
            }
            else if (pos.y == connectingStart.startY && pos.x > connectingStart.startX) {
                v2 = {
                    x: pos.x + c1,
                    y: pos.y
                };
                v1 = {
                    x: pos.x,
                    y: pos.y + c2
                };
                v3 = {
                    x: pos.x,
                    y: pos.y - c2
                }; 
            }
            else if (pos.y == connectingStart.startY && pos.x < connectingStart.startX) {
                v2 = {
                    x: pos.x - c1,
                    y: pos.y
                };
                v1 = {
                    x: pos.x,
                    y: pos.y + c2
                };
                v3 = {
                    x: pos.x,
                    y: pos.y - c2
                }; 
            }
            setArrow({
                v1: v1,
                v2: v2,
                v3: v3
            });
        };
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
        const pos = getMousePos(e);
        if (editing) { // add new vertex
            for (let i = 0; i < vertices.length; i++) {
                if (checkInVertex(vertices[i], pos.x, pos.y)) {
                    console.log("first")
                    setConnectingStart({
                        edgeId: vertices[i].id,
                        startX: vertices[i].x,
                        startY: vertices[i].y
                    });
                    return;
                };
            };
            addVertex(pos.x, pos.y);
        }
        for (let i = 0; i < vertices.length; i++) { // move vertex
            if (checkInVertex(vertices[i], pos.x, pos.y)) {
                setDraggedNode(vertices[i].id);
                setOffset({ x: vertices[i].x - pos.x, y: vertices[i].y - pos.y });
                return;
            };
        };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (connectingStart) { // see if it is in a connecting state
            const pos = getMousePos(e);
            setTempEdge({
                startX: connectingStart.startX,
                startY: connectingStart.startY,
                endX: pos.x,
                endY: pos.y
            });
            calculateArrow(e);
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
                    addEdge(connectingStart.edgeId, vertices[i].id);
                    break;
                    };
            };
            setArrow(null);
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
            width: 20,
            x: x,
            y: y,
            visited: false,
            neighbours: []
        };
        setVertices([...vertices, newVertex]);
        // console.log("vertex added: " + vertices[vertices.length - 1].id);
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