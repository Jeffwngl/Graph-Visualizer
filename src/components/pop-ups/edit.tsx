import './edit.css'

type editProps = {
    closePopUp: () => void;
    clearCanvas: () => void;
}

export default function EditGraph( {closePopUp, clearCanvas}: editProps ) {

    return (
        <div className="EditGraph">
            <button id="editCloseButton" onClick={ () => {
                closePopUp();
            }}>Stop Editing</button>
            <button id="clearCanvasButton" onClick = { () => {
                clearCanvas();
            }}>Clear Canvas</button>
            <p>To Create - Click to place Vertices.</p>
            <p>To Join - Click and drag to create edges between vertices.</p>
        </div>
    )
}