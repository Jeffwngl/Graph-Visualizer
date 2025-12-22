export const NODESIZE = 20;
export const ARROWHEIGHT = 10;
export const ARROWWIDTH = 5;

export type Vertex = {
    id: string;
    width: number;
    x: number;
    y: number;
    visited: boolean;
    neighbours: Vertex[];
}

export type Edge = {
    from: string;
    to: string;
}

export type Coordinate = {
    x: number;
    y: number;
}

export interface connectionStart {
    edgeId: string;
    startX: number;
    startY: number;
}

export interface tempEdge {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface Dimensions {
    height: number;
    width: number;
}

export interface Arrow {
    v1: Coordinate;
    v2: Coordinate;
    v3: Coordinate;
}

export type canvasProps = {
    editing: boolean;
    setEdit: () => void;
}