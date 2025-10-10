import './import.css'

export default function ImportGraph({showPopUp, closePopUp} : {showPopUp: boolean, closePopUp: () => void}) {
    if (!showPopUp) {
        return null;
    }
    
    return (
        <div className="ImportGraph">
            <button onClick={closePopUp}>Close</button>
            <p>Import Graph</p>
        </div>
    )
}