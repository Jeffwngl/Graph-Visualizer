import type { Coordinate, Vertex } from "../types/graphs.types";

export type Animation = {
    cancel: () => void;
    run: () => Promise<void>;
};

const circleAnimation = (
    location: Coordinate,
    delay: number,
    color: string
) => {
    // placeholder: implement if needed
    let cancelled = false;
    let raf = 0;
    return {
        run: () => new Promise<void>(resolve => {
            const start = performance.now();
            function step(now: number) {
                if (cancelled) { resolve(); return; }
                const t = Math.min(1, (now - start) / delay);
                // could call a render callback here
                if (t < 1) raf = requestAnimationFrame(step);
                else resolve();
            }
            raf = requestAnimationFrame(step);
        }),
        cancel: () => { cancelled = true; cancelAnimationFrame(raf); }
    } as Animation;
};

/**
 * Animate a point moving along the line from `fromVertex` to `toVertex`.
 * - `delay` is total animation duration in ms.
 * - `color` is provided for the caller to use when drawing.
 * - `startProgress` is optional initial progress [0..1].
 * - `onFrame` is an optional callback called each frame with the current position and progress.
 */
export function lineAnimation(
    fromVertex: Vertex,
    toVertex: Vertex,
    delay: number,
    color: string,
    startProgress: number = 0,
    onFrame?: (x: number, y: number, progress: number, color?: string) => void
): Animation {
    let cancelled = false;
    let raf = 0;

    const run = () => new Promise<void>(resolve => {
        const startTime = performance.now();
        function step(now: number) {
            if (cancelled) { resolve(); return; }
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / Math.max(1, delay));
            const progress = startProgress + (1 - startProgress) * t;
            const x = fromVertex.x + (toVertex.x - fromVertex.x) * progress;
            const y = fromVertex.y + (toVertex.y - fromVertex.y) * progress;
            onFrame?.(x, y, progress, color);
            if (t < 1) {
                raf = requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        raf = requestAnimationFrame(step);
    });

    const cancel = () => { cancelled = true; cancelAnimationFrame(raf); };

    return { run, cancel };
}

export default {
    lineAnimation,
    circleAnimation
};