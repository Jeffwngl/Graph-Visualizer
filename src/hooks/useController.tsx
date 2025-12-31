import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { Vertex, Edge, Step } from "../types/graphs.types";

export const useController = (
    setVertices: Dispatch<SetStateAction<Vertex[]>>,
    edgeRefs: React.RefObject<Edge[]>,
    setCurrentCall: Dispatch<SetStateAction<string>>,
) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<Step[]>([])

    const resetGraph = () => { // TODO: Move this to separate folder
        setVertices(prev => prev.map(v => ({ ...v, visited: false})));
        edgeRefs.current = [];
        setCurrentCall("");
    }

    const moveOneForward = (step: Step) => {
        switch (step.type) {
            case "visit":
                setVertices(prev => 
                    prev.map(v => 
                        v.id === step.id ? {...v, visited: true} : v
                    )
                );
                break;

            case "edge":
                edgeRefs.current.push({
                    from: step.from,
                    to: step.to
                });
                break;

            case "backtrack":
                break;

            case "finish":
                setCurrentCall(`Finished.`);
        }
    };

    const moveStepForward = () => {
        if (currentStep >= steps.length) return;

        moveOneForward(steps[currentStep]);
        setCurrentStep(prev => prev + 1);
    };

    const moveStepBackward = () => {
        if (currentStep == 0) return;

        resetGraph();

        for (let i = 0; i < currentStep - 1; i++) {
            moveOneForward(steps[i]);
        }

        setCurrentStep(currentStep - 1);
    }
}