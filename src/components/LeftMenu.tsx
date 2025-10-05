import { useState } from 'react'
import './LeftMenu.css'
import ToggleMenuLeft from './ToggleMenuLeft';

export default function LeftMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleLeftMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='LeftMenu'>
            <button className='Toggle' id='toggle' onClick={toggleLeftMenu}>{isOpen ? "-" : "+" }</button>
            {isOpen ? 
            <div className={`ToggleContainer`}>
                <ToggleMenuLeft />
            </div> 
            : <></>
            }
        </div>
    )
}