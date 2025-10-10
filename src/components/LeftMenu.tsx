import { useState } from 'react'
import './LeftMenu.css'
import ToggleMenuLeft from './ToggleMenuLeft';
import { RightArrowIcon, LeftArrowIcon } from '../assets/Icons';

export default function LeftMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`LeftMenu ${isOpen ? "open" : "closed"}`}>
            <button className='ToggleLeft' id='toggleleft' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <LeftArrowIcon /> : <RightArrowIcon /> }</button>
            {isOpen && (
                <div className={`ToggleContainer`}>
                    <ToggleMenuLeft />
                </div> 
            )}
        </div>
    )
}