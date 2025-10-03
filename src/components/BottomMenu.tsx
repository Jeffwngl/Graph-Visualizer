import { useState } from "react"
import "./BottomMenu.css"
import { PlayIcon, PauseIcon, SkipIcon, RewindIcon } from "../assets/Icons";

export default function BottomMenu() {
    const [isPlaying, setIsPlaying] = useState(false);

    function playPause() {
        setIsPlaying(!isPlaying);
    }

    function switchIcon() {

    }

    return (
        <div className="BottomBar">
            <div className="BottomSpeed">
                <p>Speed: </p>
                <select name="speed" id="speed">
                    <option value="1x">1x</option>
                    <option value="2x">2x</option>
                    <option value="3x">3x</option>
                    <option value="4x">4x</option>
                </select>
            </div>
            <div className="BottomControls">
                <button id="rewind">
                    <RewindIcon />
                </button>
                <button id="play"
                onClick={() => {
                    playPause();
                    console.log("isPlaying: " + isPlaying);
                }}
                >
                    {isPlaying ? <PlayIcon /> : <PauseIcon />}
                </button>
                <button id="skip">
                    <SkipIcon />
                </button>
            </div>
            <div className="BottomLinks">
                <a href="https://github.com/Jeffwngl/Graph-Visualizer">Contribute</a>
            </div>
        </div>
    );
}
