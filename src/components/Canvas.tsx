import React, { useEffect, useRef, useState } from "react";

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
}

// Canvas Functions

function zoomCamera() {
    // to implement
}

// Canvas Component

export default function Canvas({editing}: canvasProps) {
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);


    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const draw = (ctx: CanvasRenderingContext2D) => { // test function
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000ff';
        ctx.beginPath()
        ctx.arc(50, 100, 20, 0, 2*Math.PI)
        ctx.fill()
    }

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

    const drawEdgeFollowMouse = (ctx: CanvasRenderingContext2D, e: Edge, x: number, y: number) => {
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    const addEdge = (e: React.MouseEvent, editing: boolean) => {
        console.log(`Editing: ${editing}`);
        if (!editing) {
            return;
        }
        const canvas = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvas.left;
        const y = e.clientY - canvas.right;

        for (let i = 0; i < vertices.length; i++) {
                        if ((vertices[i].x - 20 <= x) && 
                (x <= vertices[i].x + 20) && 
                (vertices[i].y - 20 <= y) && 
                (y <= vertices[i].y + 20)) {
                // change adjacency matrix or array
                break
            };
        }
    }

    const addVertex = (e: React.MouseEvent, editing: boolean) => {
        console.log(`Editing: ${editing}`);
        if (!editing) {
            return;
        }
        const canvas = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvas.left;
        const y = e.clientY - canvas.top;
        for (let i = 0; i < vertices.length; i++) { // stop being able to place nodes above eachother
            if ((vertices[i].x - 20 <= x) && 
                (x <= vertices[i].x + 20) && 
                (vertices[i].y - 20 <= y) && 
                (y <= vertices[i].y + 20)) {
                return;
            };
        }
        setVertices(prev => [...prev, { id: `${prev.length + 1}`, x, y, neighbours: [] }]);
    }

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

    // make edges follow cursor before placed (Double check to use useEffect or not)
    useEffect(() => {

    })


    return (
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
            onClick={(e) => addVertex(e, editing)}>
            Use a browser that can use HTML Canvas.
        </canvas>
    )
}