import { useEffect, useState } from 'react';
import type { Step } from '../../types/graphs.types';
import './input.css'

type inputProps = {
    closePopUp: () => void;
    generateDfsSteps: (startVertex: string) => void;
    executeTraversal: () => void;
    // dfsIter: (startVertex: string) => void;
    // bfs: () => void;
    // djikstras: () => void;
    reset: () => void;
    setAlgo: React.Dispatch<React.SetStateAction<string>>;
    setCurrStep: React.RefObject<number>;
}

export default function InputSearch( {
        closePopUp, 
        generateDfsSteps,
        executeTraversal, 
        reset, 
        setAlgo,
        setCurrStep
    }: inputProps ) {
    const [algorithm, setAlgorithm] = useState<string>("DFSrecursive");
    const [startVertex, setStartVertex] = useState<string>("")

    function isNumber(value?: string): boolean {
        return ((value != null) &&
        (value !== '') &&
        !isNaN(Number(value)));
    };

    const resetCurrStep = () => {
        setCurrStep.current = 0;
    }

    const runSearch = () => {
        if (!algorithm || !isNumber(startVertex)) {
            return;
        };
        if (algorithm === "DFSrecursive") {
            generateDfsSteps(startVertex.trim());
            executeTraversal();
        } else if (algorithm === "DFSiterative") {
            // TODO: implement iterative version
            return;
        } else if (algorithm === "BFS") {
            // TODO: implement BFS
            return;
        }
    };

    useEffect(() => {
        setAlgo(algorithm);
        console.log(algorithm);
    }, [algorithm]);

    return (
        <div className="InputSearch">
            <button className="inputButton" id="inputCloseButton" onClick={ () => {
                closePopUp();
                reset();
                resetCurrStep();
            }}>Close</button>
            <p>Search Algorithm:</p>
            <select name="algorithm" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
                <option value="DFSrecursive">DFS Recursive</option>
                <option value="DFSiterative">DFS Iterative</option>
                <option value="BFS">BFS</option>
            </select>
            <p>Select Starting Vertex:</p>
            <input value={startVertex} placeholder="Vertex Number" onChange={e => setStartVertex(e.target.value)}></input>
            <button className="inputButton" onClick={ () => {
                reset();
                runSearch();
            }}>Search</button>
        </div>
    )
};