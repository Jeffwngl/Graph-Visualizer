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
    visited?: boolean;
    neighbours: string[];
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
    const [arrows, setArrows] = useState<Arrow[]>([]);

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
        setArrows([]);
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

        // draw arrows
        arrows.forEach(arrow => {
            drawArrow(context, arrow.v1, arrow.v2, arrow.v3)
        })
    };

    /* ------------------------------ Get arrow coordinates ------------------------------ */

    const calculateArrow = (x: number, y: number) => { // change input argument to a location instead of a mouse event
        const c1 = ARROWHEIGHT;
        const c2 = ARROWWIDTH;
        let v1: Coordinate = {x: x, y: y};
        let v2: Coordinate = {x: x, y: y};
        let v3: Coordinate = {x: x, y: y};

        if (connectingStart) {
            const a = Math.abs(connectingStart.startX - x);
            const b = Math.abs(y - connectingStart.startY);
            const alpha = Math.atan(b / a);
            // quadrant 1
            if (x < connectingStart.startX && y > connectingStart.startY) {
                v2 = {
                    x: x - Math.cos(alpha) * c1,
                    y: y + Math.sin(alpha) * c1
                };
                v1 = {
                    x: x - Math.sin(alpha) * c2,
                    y: y - Math.cos(alpha) * c2
                };
                v3 = {
                    x: x + Math.sin(alpha) * c2,
                    y: y + Math.cos(alpha) * c2
                };
            }
            // quadrant 2
            else if (x > connectingStart.startX && y > connectingStart.startY) {
                v2 = {
                    x: x + Math.cos(alpha) * c1,
                    y: y + Math.sin(alpha) * c1
                };
                v1 = {
                    x: x - Math.sin(alpha) * c2,
                    y: y + Math.cos(alpha) * c2
                };
                v3 = {
                    x: x + Math.sin(alpha) * c2,
                    y: y - Math.cos(alpha) * c2
                };
            }
            // quadrant 3
            else if (x < connectingStart.startX && y < connectingStart.startY) {
                v2 = {
                    x: x - Math.cos(alpha) * c1,
                    y: y - Math.sin(alpha) * c1
                };
                v1 = {
                    x: x + Math.sin(alpha) * c2,
                    y: y - Math.cos(alpha) * c2
                };
                v3 = {
                    x: x - Math.sin(alpha) * c2,
                    y: y + Math.cos(alpha) * c2
                };
            }
            // quadrant 4
            else if (x > connectingStart.startX && y < connectingStart.startY) {
                v2 = {
                    x: x + Math.cos(alpha) * c1,
                    y: y - Math.sin(alpha) * c1
                };
                v1 = {
                    x: x + Math.sin(alpha) * c2,
                    y: y + Math.cos(alpha) * c2
                };
                v3 = {
                    x: x - Math.sin(alpha) * c2,
                    y: y - Math.cos(alpha) * c2
                };
            }
            // parallel cases
            else if (x == connectingStart.startX && y == connectingStart.startY) {

            }
            else if (x == connectingStart.startX && y > connectingStart.startY) {
                v2 = {
                    x: x,
                    y: y + c1
                };
                v1 = {
                    x: x - c2,
                    y: y
                };
                v3 = {
                    x: x + c2,
                    y: y
                }; 
            }
            else if (x == connectingStart.startX && y < connectingStart.startY) {
                v2 = {
                    x: x,
                    y: y - c1
                };
                v1 = {
                    x: x - c2,
                    y: y
                };
                v3 = {
                    x: x + c2,
                    y: y
                }; 
            }
            else if (y == connectingStart.startY && x > connectingStart.startX) {
                v2 = {
                    x: x + c1,
                    y: y
                };
                v1 = {
                    x: x,
                    y: y + c2
                };
                v3 = {
                    x: x,
                    y: y - c2
                }; 
            }
            else if (y == connectingStart.startY && x < connectingStart.startX) {
                v2 = {
                    x: x - c1,
                    y: y
                };
                v1 = {
                    x: x,
                    y: y + c2
                };
                v3 = {
                    x: x,
                    y: y - c2
                }; 
            }
            setTempArrow({
                v1: v1,
                v2: v2,
                v3: v3
            });
        };
    };

    const calculateOffset = ( x: number, y: number ) => {
        if (connectingStart) {
            const dx = x - connectingStart.startX;
            const dy = y - connectingStart.startY;
            const d = Math.sqrt(dx * dx + dy *dy);
            const unitX = dx / d; // unit vectors in x and y direction
            const unitY = dy / d;
            const edgeX = x - (NODESIZE + ARROWHEIGHT) * unitX;
            const edgeY = y - (NODESIZE + ARROWHEIGHT) * unitY;
            return {
                x: edgeX,
                y: edgeY
            }
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
            for (let v of vertices) {
                if (checkInVertex(v, pos.x, pos.y)) {
                    setTempEdge({
                        startX: connectingStart.startX,
                        startY: connectingStart.startY,
                        endX: v.x,
                        endY: v.y
                    });
                    // add calculate arrow at edge of node
                    const vertexEdge = calculateOffset(v.x, v.y);
                    if (vertexEdge) {
                        calculateArrow(vertexEdge.x, vertexEdge.y);
                    }
                    return;
                }
            }
        
            setTempEdge({
                startX: connectingStart.startX,
                startY: connectingStart.startY,
                endX: pos.x,
                endY: pos.y
            });

            calculateArrow(pos.x, pos.y);
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
                    const vertexEdge = calculateOffset(vertices[i].x, vertices[i].y); // add arrow
                    if (vertexEdge) {
                        calculateArrow(vertexEdge.x, vertexEdge.y);
                    }
                    if (tempArrow) {
                        addArrow(tempArrow);
                    }
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

    const addEdge = (fromId: string, toId: string) => {
        setEdges(prev => [...prev, { from: fromId, to: toId }]);
        console.log("edge from: " + fromId)
        console.log("edge to: " + toId)
        for (let v of vertices) {
            if (v.id == fromId) {
                v.neighbours.push(toId);
                break;
            }
        }
    };

    const addArrow = (a: Arrow) => {
        setArrows(prev => [...prev, a]);
    }

    const dfs = (fromVertex: string) => {
        // for (let v of vertices) {
        //     if (v.id === fromVertex) {
        //         fromNode = v;
        //     }
        // }
        // if (fromNode == null) {

        // }
    }

    const bfs = (fromVertex: string) => {

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