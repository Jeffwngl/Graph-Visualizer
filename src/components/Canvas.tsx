import { use, useEffect, useRef, useState } from "react";
import EditGraph from "./pop-ups/edit";
import type { Vertex, Edge, Dimensions } from "../types/graphs.types";
import { ARROWHEIGHT, NODESIZE } from "../types/graphs.types";
import { drawEdge, drawVertex, drawArrow } from "../hooks/useCanvasDraw";
import { calculateArrow, calculateOffset } from "../hooks/useGeometryCalc";
import { useMouseHandler } from "../hooks/useMouse";
import { useAlgos } from "../hooks/useGraphAlgos";
import InputSearch from "./pop-ups/input";

type canvasProps = {
    editing: boolean;
    inputing: boolean;
    setEditFalse: () => void;
    setInputFalse: () => void;
}

export default function Canvas( {editing, inputing, setEditFalse, setInputFalse}: canvasProps ) {
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [dimensions, setDimensions] = useState<Dimensions>({ height: window.innerHeight, width: window.innerWidth});

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const addVertex = (x: number, y: number) => { // TODO: MOVE TO SEPARATE FILE
        const newVertex: Vertex = {
            id: (vertices.length + 1).toString(),
            width: NODESIZE,
            x: x,
            y: y,
            visited: false,
            neighbours: []
        };
        setVertices(prev => [...prev, newVertex]);
    };

    const addEdge = (fromId: string, toId: string) => { // TODO: MOVE TO SEPARATE FILE
        setEdges(prev => [...prev, { from: fromId, to: toId }]);
        // console.log("edge from: " + fromId)
        // console.log("edge to: " + toId)

        let toVertex;
        for (let v of vertices) {
            if (v.id === toId) {
                toVertex = v;
            }
        }

        for (let v of vertices) {
            if (v.id === fromId) {
                if (toVertex) {
                    v.neighbours.push(toVertex);
                }
                break;
            }
        }
    };

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        tempArrow,
        tempEdge,
        mouseLoc
    } = useMouseHandler(vertices, canvasRef, editing, inputing, addVertex, addEdge);
    
    const {
        dfs,
        isAnimating,
        stopAnimation
    } = useAlgos(vertices, setVertices, canvasRef);

    const clearCanvas = () => { // TODO: MOVE TO SEPARATE FILE
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
    };

    const handleResize = () => { // TODO: MOVE TO SEPARATE FILE
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        })
        drawCanvas();
    }

    const eraseNodes = () => { // TODO: MOVE TO SEPARATE FILE
        setEdges([]);
        setVertices([]);
    }

    /* ------------------------------ Main canvas states ------------------------------ */

    useEffect(() => {
        drawCanvas();
    }, [vertices, edges, tempEdge, mouseLoc]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    });

    const drawCanvas = () => { // TODO: MOVE TO SEPARATE FILE
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
                const edgePos = calculateOffset(fromVertex.x, fromVertex.y, toVertex.x, toVertex.y, NODESIZE, ARROWHEIGHT)

                if (edgePos) {
                    const arrow = calculateArrow(fromVertex.x, fromVertex.y, edgePos.x, edgePos.y);
                    // console.log("vx: " + toVertex.x)
                    // console.log("vy: " + toVertex.y)
                    // console.log("edgex: " + edgePos.x)
                    // console.log("edgey: " + edgePos.y)
                    if (arrow) {
                        drawArrow(context, arrow.v1, arrow.v2, arrow.v3);
                    }
                }
            };
        });

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

    return (
        <>
        {editing && (
            <EditGraph 
            closePopUp={ setEditFalse }
            clearCanvas={ eraseNodes }
            />
        )}

        {inputing && (
            <InputSearch
            closePopUp={ setInputFalse }
            dfs={ dfs }
            reset={ stopAnimation }
            />
        )}

        <canvas 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={canvasRef} 
            width={dimensions.width} 
            height={dimensions.height - 190}
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