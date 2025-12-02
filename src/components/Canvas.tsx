import React, { useEffect, useRef, useState } from "react";
import EditGraph from "./pop-ups/edit";

type Vertex = {
    id: string;
    x: number;
    y: number;
    visited?: boolean;
    neighbours?: string[];
}

type Edge = {
    from: string;
    to: string;
}

type canvasProps = {
    editing: boolean;
    setEdit: () => void;
    
}

// Canvas Functions

function zoomCamera() {
    // to implement
}

// Canvas Component

export default function Canvas( {editing, setEdit}: canvasProps ) {
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [drawingEdge, setDrawingEdge] = useState(false);
    const [drawFromPos, setDrawFromPos] = useState({x: 0, y: 0})


    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // const draw = (ctx: CanvasRenderingContext2D) => { // DEBUG TEST FUNCTION
    //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //     ctx.fillStyle = '#000000ff';
    //     ctx.beginPath()
    //     ctx.arc(50, 100, 20, 0, 2*Math.PI)
    //     ctx.fill()
    // }

    const drawVertex = (ctx: CanvasRenderingContext2D, v: Vertex) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = v.visited ? "#ba1212ff" : "#000000ff";
        ctx.fill();
        ctx.strokeStyle = "#1e3a8a";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v.id, v.x, v.y);
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
        setVertices([]);
        console.log("Cleared Canvas");
    }

    /* ------------------------------ Edges and Vertices ------------------------------ */

    // function Edge(x: number, y: number) {
    //     this.x = x;
    //     this.y = y;

    // }

    const getCanvasPos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvas.left;
        const y = e.clientY - canvas.top;
        return {
            xPos: x, 
            yPos: y
        };
    };
    
    const getCanvasContext = () => {
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
        return {
            context
        }
    }

    const drawEdgeFollowMouse = (x: number, y: number) => { // IN PROGRESS
        console.log(drawingEdge);
        if (!drawingEdge || !editing) {
            return;
        }
        const canvas = canvasRef.current; // get this from function
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            console.log("Error: Not Able to get Canvas Context.");
            return;
        }
    }

    function handleMouseMove(info: MouseEvent) {
        const canvas = canvasRef.current; // get this from function
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            console.log("Error: Not Able to get Canvas Context.");
            return;
        }
        const xPos = info.offsetX;
        const yPos = info.offsetY;
        context.beginPath();
        context.moveTo(drawFromPos.x, drawFromPos.y);
        context.lineTo(xPos, yPos);
        context.stroke();
    }

    const addItem = (e: React.MouseEvent, editing: boolean) => {
        if (!editing) {
            return;
        }

        const x = getCanvasPos(e).xPos
        const y = getCanvasPos(e).yPos

        for (let i = 0; i < vertices.length; i++) { // clicked on existing vertex
            if ((vertices[i].x - 20 <= x) && 
                (x <= vertices[i].x + 20) && 
                (vertices[i].y - 20 <= y) && 
                (y <= vertices[i].y + 20)) {
                setDrawingEdge(!drawingEdge);
                setDrawFromPos({x: vertices[i].x, y: vertices[i].y})
                // drawEdgeFollowMouse(vertices[i].x, vertices[i].y)
                // add edge to ds
                return;
            };
        }

        if (drawingEdge) {
            setDrawingEdge(false);
            return;
        }

        addVertex(x, y);
    }

    const addVertex = (x: number, y: number) => {
        setVertices(prev => [...prev, { id: `${prev.length + 1}`, x, y, neighbours: [] }]);
    }

    const addEdge = (x: number, y: number) => {
        // add to edge array and matrix
    }

    /* ------------------------------ Not in Use ------------------------------ */

    // const addVertex = (e: React.MouseEvent, editing: boolean) => { // deprecated
    //     if (!editing) {
    //         return;
    //     }
    //     const canvas = canvasRef.current!.getBoundingClientRect();
    //     const x = e.clientX - canvas.left;
    //     const y = e.clientY - canvas.top;
    //     for (let i = 0; i < vertices.length; i++) { // stop being able to place nodes above eachother
    //         if ((vertices[i].x - 20 <= x) && 
    //             (x <= vertices[i].x + 20) && 
    //             (vertices[i].y - 20 <= y) && 
    //             (y <= vertices[i].y + 20)) {
    //             return;
    //         };
    //     }
    //     setVertices(prev => [...prev, { id: `${prev.length + 1}`, x, y, neighbours: [] }]);
    // }

    // const addEdge = (e: React.MouseEvent, editing: boolean) => { // deprecated
    //     if (!editing) {
    //         return;
    //     }
    //     const canvas = canvasRef.current!.getBoundingClientRect();
    //     const x = e.clientX - canvas.left;
    //     const y = e.clientY - canvas.right;

    //     for (let i = 0; i < vertices.length; i++) {
    //         if ((vertices[i].x - 20 <= x) && 
    //             (x <= vertices[i].x + 20) && 
    //             (vertices[i].y - 20 <= y) && 
    //             (y <= vertices[i].y + 20)) {
    //             // change adjacency matrix or array
    //             break
    //         };
    //     }
    // }

    /* ------------------------------ Not in Use ------------------------------ */

    useEffect(() => {
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

        // draw vertices
        vertices.forEach(v => {
            drawVertex(context, v);
        });

        // draw edges

    }, [vertices]);

    useEffect(() => { // moved all draw edge to this useEffect
        // add / remove event listener.
        const canvas = canvasRef.current; // get this from function
        if (!canvas) {
            console.log("Error: Canvas Element not Found.");
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            console.log("Error: Not Able to get Canvas Context.");
            return;
        }
        if (!editing) {
            canvas.removeEventListener("mousemove", handleMouseMove);
            return;
        }
        if (!drawingEdge) {
            canvas.removeEventListener("mousemove", handleMouseMove);
            return;
        }
        else {
            canvas.addEventListener("mousemove", handleMouseMove)
        }
    }, [drawingEdge, editing]);

    return (
        <>
        {editing && (
            <EditGraph 
            closePopUp={ setEdit }
            clearCanvas={ clearCanvas }
            />
        )}
        <canvas 
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
            }}
            onClick={(e) => addItem(e, editing)}>
            Use a browser that can use HTML Canvas.
        </canvas>
        </>
    )
}