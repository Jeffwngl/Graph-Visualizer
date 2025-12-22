import { useState } from 'react'
import './LeftMenu.css'
import { RightArrowIcon, LeftArrowIcon } from '../assets/Icons';

type leftMenuProps = {
    editOnToggle: () => void;
    inputOnToggle: () => void;
};

export default function LeftMenu({ editOnToggle, inputOnToggle }: leftMenuProps) {
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

                    <button className="MenuButton">Export Graph</button>

                    <button className="MenuButton" id="dfs" onClick={() => {
                        inputOnToggle();
                    }}>Traverse Graph</button>
                </div>
            )}
        </div>
    )
}