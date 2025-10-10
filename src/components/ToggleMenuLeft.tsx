import React from "react"
import { useState } from "react"
import "./ToggleMenuLeft.css"
import EditGraph from "./pop-ups/edit";
import ImportGraph from "./pop-ups/import";

export default function ToggleMenuLeft() {
    const [editOpen, setEditOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    return (
        <>
            <button className="MenuButton" id="addGraph">Add New Graph</button>
            <button className="MenuButton" id="editGraph" onClick={() => setEditOpen(true)}>Edit Graph</button>
            <EditGraph showPopUp={editOpen} closePopUp={() => setEditOpen(false)}></EditGraph>
            <button className="MenuButton" id="importGraph" onClick={() => setImportOpen(true)}>Import Graph</button>
            <ImportGraph showPopUp={importOpen} closePopUp={() => setImportOpen(false)}></ImportGraph>
            <button className="MenuButton" id="dfs">DFS</button>
            <button className="MenuButton" id="bfs">BFS</button>
        </>
    )
}