import { useEffect, useRef, useState } from "react";

type Vertex = {
    id: string;
    x: number;
    y: number;
    visited: boolean;
    neighbours: string[];
}

type Edge = {
    from: string;
    to: string;
}

const [vertices, setVertices] = useState<Vertex[]>([]);
const [edges, setEdges] = useState<Edge[]>([]);

// Canvas Functions

function zoomCamera() {

}

// Canvas Component

export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const draw = (ctx: CanvasRenderingContext2D) => {
        console.log("drawing")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000ff';
        ctx.beginPath()
        ctx.arc(50, 100, 20, 0, 2*Math.PI)
        ctx.fill()
    }

    const addVertex = (e: React.MouseEvent) => {
        const canvas = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvas.left;
        const y = e.clientY - canvas.top;
        setVertices(prev => )
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

        draw(context);
    }, [draw]);



    return (
        <canvas 
            ref={canvasRef} 
            width={window.innerWidth} 
            height={window.innerHeight}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}>
            Use a browser that can use HTML Canvas.
        </canvas>
    )
}