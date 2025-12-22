import { useState } from 'react';
import './input.css'

type inputProps = {
    closePopUp: () => void;
    dfs: (startVertex: string) => void;
    // bfs: () => void;
    // djikstras: () => void;
    reset: () => void;
}

export default function InputSearch( {closePopUp, dfs, reset}: inputProps ) {
    const [algorithm, setAlgorithm] = useState<string>("DFS");
    const [startVertex, setStartVertex] = useState<string>("")

    function isNumber(value?: string | number): boolean {
        return ((value != null) &&
        (value !== '') &&
        !isNaN(Number(value.toString())));
    };

    const runSearch = () => {
        if (!algorithm || !isNumber(startVertex)) {
            return;
        };
        
        if (algorithm === "DFS") {
            dfs(startVertex.trim());
        } else if (algorithm === "BFS") {
            // TODO: implement BFS
            return;
        } else if (algorithm === "Djikstras") {
            return;
        }
    };

    return (
        <div className="InputSearch">
            <button className="inputButton" id="inputCloseButton" onClick={ () => {
                closePopUp();
                reset();
            }}>Close</button>
            <p>Search Algorithm:</p>
            <select name="algorithm" id="algorithm" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
                <option value="DFS">DFS</option>
                <option value="BFS">BFS</option>
                <option value="Djikstra's">Djikstra</option>
            </select>
            <p>Select Starting Vertex:</p>
            <input value={startVertex} placeholder="Vertex Number" onChange={e => setStartVertex(e.target.value)}></input>
            <button className="inputButton" onClick={runSearch}>Search</button>
        </div>
    )
}