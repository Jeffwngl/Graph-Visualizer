import { useState, useEffect, use } from 'react'
import './App.css'
import HeroMenu from './components/HeroMenu'
import BottomMenu from './components/BottomMenu'
import LeftMenu from './components/LeftMenu'
import RightMenu from './components/RightMenu'
import Canvas from './components/Canvas'

function App() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isInputing, setIsInputing] = useState<boolean>(false);
  const [useAlgo, setAlgo] = useState<string>("DFSrecursive");
  const [currentCall, setCurrentCall] = useState<string>("");
 
  useEffect(() => {
    console.log("isEditing:", isEditing);
  }, [isEditing]);

  useEffect(() => {
    console.log(useAlgo);
  }, [useAlgo]);

  return (
    <>
      <HeroMenu />
      <div className='Main'>

        <LeftMenu
            editOnToggle={ () => {
              if (!isInputing) {
                setIsEditing(true);
              }
            }}
            inputOnToggle={ () => {
              if (!isEditing) {
                setIsInputing(true);
              }
            }}
        />

        <Canvas 
          editing={ isEditing }
          inputing={ isInputing }
          setEditFalse={ () => setIsEditing(false) }
          setInputFalse={ () => setIsInputing(false) }
          setAlgo={ setAlgo }
          setCurrentCall={ setCurrentCall }
        />

        <RightMenu 
            displayedAlgo={ useAlgo }
            displayedCall={ currentCall }
        />

      </div>
      <BottomMenu />
    </>
  )
}

export default App
