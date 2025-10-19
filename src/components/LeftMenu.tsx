import { useState } from 'react'
import './LeftMenu.css'
import ToggleMenuLeft from './ToggleMenuLeft';
import { RightArrowIcon, LeftArrowIcon } from '../assets/Icons';
import EditGraph from "./pop-ups/edit";
import ImportGraph from "./pop-ups/import";

export default function LeftMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    return (
        <div className={`LeftMenu ${isOpen ? "open" : "closed"}`}>
            <button className='ToggleLeft' id='toggleleft' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <LeftArrowIcon /> : <RightArrowIcon /> }</button>
            {isOpen && (
                <div className={`ToggleContainer`}>
                    <button className="MenuButton" id="addGraph">Add New Graph</button>
                    <button className="MenuButton" id="editGraph" onClick={() => {
                        setEditOpen(true);
                    }}>
                        Edit Graph
                    </button>

                    <EditGraph showPopUp={editOpen} closePopUp={() => {
                        setEditOpen(false);
                        }} 
                    />

                    <button className="MenuButton" id="importGraph" onClick={() => 
                        setImportOpen(true)
                    }>
                        Import Graph
                    </button>

                    <ImportGraph showPopUp={importOpen} closePopUp={() => setImportOpen(false)}></ImportGraph>
                    <button className="MenuButton" id="dfs">DFS</button>
                    <button className="MenuButton" id="bfs">BFS</button>
                </div> 
            )}
        </div>
    )
}