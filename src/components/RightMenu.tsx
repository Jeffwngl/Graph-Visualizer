import './RightMenu.css'
import { RightArrowIcon, LeftArrowIcon } from '../assets/Icons'
import { useState } from 'react'


export default function RightMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const dfsDisplay = () => {
        return (
            <div className='codeDisplay'>
                <p>dfs(v):</p>
                <p>if (visited has current v):</p>
                <p>   return</p>
                <p>visited.add(v)</p>
                <p>for (neighbours in v):</p>
                <p>   if (neighbour not visited):</p>
                <p>      dfs(neighbour)</p>
            </div>
        )
    };

    const bfsDisplay = () => {
        return (
            <div className='codeDisplay'>
                <p>bfs(v):</p>
                <p>if (visited has current v):</p>
                <p>   return</p>
                <p>visited.add(v)</p>
                <p>for (neighbours in v):</p>
                <p>   if (neighbour not visited):</p>
                <p>      dfs(neighbour)</p>
            </div>
        )
    }

    return (
        <div className={`RightMenu ${isOpen ? "open" : "closed"}`}>
            <button className='ToggleRight' id='toggleRight' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <RightArrowIcon /> : <LeftArrowIcon /> }</button>
            {isOpen && (
                <div className="StepsMenu">
                    <p>Steps:</p>
                    {dfsDisplay()}
                </div>
            )}
        </div>
    )
}