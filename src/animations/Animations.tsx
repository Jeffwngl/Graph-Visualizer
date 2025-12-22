import type { Vertex } from "../types/graphs.types";
import type { Dispatch, SetStateAction } from "react";

export abstract class Animation {
    abstract cancel(): void;
    abstract run(): Promise<void>;
}

/**
 * Animate a traversal by marking vertices visited in the given order.
 * - `order` is an array of vertex ids in visit order.
 * - `setVertices` is the React state setter for vertices.
 * - `delay` is milliseconds between steps.
 * - `signal` is an optional AbortSignal to cancel the animation early.
 */
export async function animateTraversal(
    order: string[],
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
    delay: number = 500,
    signal?: AbortSignal
) {
    for (const id of order) {
        if (signal?.aborted) break;
        setVertices(prev => prev.map(v => v.id === id ? { ...v, visited: true } : v));

        // wait for delay or until aborted
        await new Promise<void>(resolve => {
            const t = setTimeout(() => resolve(), delay);
            if (signal) {
                const onAbort = () => {
                    clearTimeout(t);
                    resolve();
                    signal.removeEventListener('abort', onAbort);
                };
                if (signal.aborted) onAbort();
                else signal.addEventListener('abort', onAbort);
            }
        });
    }
}

export const animateDFS = animateTraversal;
export const animateBFS = animateTraversal;

export function clearVisited(setVertices: Dispatch<SetStateAction<Vertex[]>>) {
    setVertices(prev => prev.map(v => ({ ...v, visited: false })));
}