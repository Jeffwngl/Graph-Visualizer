import React from "react"
import { useState } from "react"
import "./ToggleMenuLeft.css"

export default function ToggleMenuLeft() {
    return (
        <>
            <button className="MenuButton" id="addGraph">Add New Graph</button>
            <button className="MenuButton" id="editGraph">Edit Graph</button>
            <button className="MenuButton" id="importGraph">Import Graph</button>
            <button className="MenuButton" id="dfs">DFS</button>
            <button className="MenuButton" id="bfs">BFS</button>
        </>
    )
}