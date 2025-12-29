import "./RightMenu.css"
import { RightArrowIcon, LeftArrowIcon } from "../assets/Icons"
import { useState } from "react"

type rightMenuProps = {
    displayedAlgo: string;
}

export default function RightMenu({ displayedAlgo }: rightMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    const dfsRecDisplay = () => {
        return (
            <div className="codeDisplay">
                <p>dfsRec(v):</p>
                <p>if (visited has current v):</p>
                <p>   return</p>
                <p>visited.add(v)</p>
                <p>for (neighbours in v):</p>
                <p>   if (neighbour not visited):</p>
                <p>      dfs(neighbour)</p>
            </div>
        )
    };

    const dfsIterDisplay = () => {
        return (
            <div className="codeDisplay">
                <p>dfsIter(v):</p>
                <p>while (stack.length {'>'} 0):</p>
                <p>  v = stack.pop()</p>
                <p>  if (v not in visited):</p>
                <p>     visited.add(v)</p>
                <p>     for (neighbours in v):</p>
                <p>         if (neighbour not in visited):</p>
                <p>             stack.append(neighbour)</p>
            </div>
        )
    }

    const bfsDisplay = () => {
        return (
            <div className="codeDisplay">
                <p>bfs(startingV):</p>
                <p>while (queue.length {'>'} 0):</p>
                <p>   node = queue.push()</p>
                <p>   for (neighbours in v):</p>
                <p>     if (neighbour not in visited):</p>
                <p>         visited.add(neighbour)</p>
                <p>         queue.push(neighbour)</p>
            </div>
        )
    }

    return (
        <div className={`RightMenu ${isOpen ? "open" : "closed"}`}>
            <button className="ToggleRight" id="toggleRight" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <RightArrowIcon /> : <LeftArrowIcon /> }</button>
            {isOpen && (
                <div className="StepsMenu">
                    {displayedAlgo === "DFSrecursive" && (
                        dfsRecDisplay()
                    )}
                    {displayedAlgo === "DFSiterative" && (
                        dfsIterDisplay()
                    )}
                    {displayedAlgo === "BFS" && (
                        bfsDisplay()
                    )}
                </div>
            )}
        </div>
    )
}
