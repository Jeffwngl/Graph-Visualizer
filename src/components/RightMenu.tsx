import './RightMenu.css'
import { RightArrowIcon, LeftArrowIcon } from '../assets/Icons'
import { useState } from 'react'


export default function RightMenu() {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className={`RightMenu ${isOpen ? "open" : "closed"}`}>
            <button className='ToggleRight' id='toggleRight' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <RightArrowIcon /> : <LeftArrowIcon /> }</button>
            {isOpen && (
                <div className="StepsMenu">
                    <p>Step 1</p>
                </div>
            )}
        </div>
    )
}