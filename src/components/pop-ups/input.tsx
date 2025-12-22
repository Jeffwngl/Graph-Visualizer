import './input.css'

type inputProps = {
    closePopUp: () => void;
}

export default function InputSearch( {closePopUp}: inputProps ) {

    return (
        <div className="InputSearch">
            <button id="inputCloseButton" onClick={ () => {
                closePopUp();
            }}>Close</button>
            <p>Search Algorithm:</p>
            <select name="algorithm" id="algorithm">
                <option value="DFS">DFS</option>
                <option value="BFS">BFS</option>
                <option value="Djikstra's">Djikstra</option>
            </select>
            <p>Select Starting Vertex:</p>
            <input placeholder='Vertex Number'></input>
        </div>
    )
}