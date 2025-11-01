import './edit.css'

export default function EditGraph({closePopUp} : {closePopUp: () => void}) {

    return (
        <div className="EditGraph">
            <button id="editCloseButton" onClick={ () => {
                closePopUp();
            }}>Close</button>
            <p>To Create - Click to place Vertices.</p>
            <p>To Join - Click and drag to create edges between vertices.</p>
        </div>
    )
}