import { useState } from 'react'
import './LeftMenu.css'
import { RightArrowIcon, LeftArrowIcon } from '../assets/Icons';

export default function LeftMenu({ editOnToggle }: { editOnToggle: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    return (
        <div className={`LeftMenu ${isOpen ? "open" : "closed"}`}>
            <button className='ToggleLeft' id='toggleleft' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <LeftArrowIcon /> : <RightArrowIcon /> }</button>
            {isOpen && (
                <div className={`ToggleContainer`}>
                    <button className="MenuButton" id="editGraph" onClick={() => {
                        editOnToggle();
                    }}>Edit Graph</button>

                    <button className="MenuButton" id="importGraph" onClick={() => 
                        setImportOpen(true)
                    }>Import Graph</button>

                    <button className="MenuButton" id="dfs">DFS</button>
                    <button className="MenuButton" id="bfs">BFS</button>
                    <button className="MenuButton" id="bfs">Djikstra's</button>
                    <button className="MenuButton" id="stopAnimation">Stop Animation</button>
                </div>
            )}
        </div>
    )
}