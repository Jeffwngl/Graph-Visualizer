import './edit.css'

export default function EditGraph({showPopUp, closePopUp} : {showPopUp: boolean, closePopUp: () => void}) {
    if (!showPopUp) {
        return null;
    }

    return (
        <div className="EditGraph">
            <button onClick={closePopUp}>Close</button>
            <p>Edit Graph</p>
        </div>
    )
}