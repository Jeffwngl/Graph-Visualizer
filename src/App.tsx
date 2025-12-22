import { useState, useEffect } from 'react'
import './App.css'
import HeroMenu from './components/HeroMenu'
import BottomMenu from './components/BottomMenu'
import LeftMenu from './components/LeftMenu'
import RightMenu from './components/RightMenu'
import Canvas from './components/Canvas'

function App() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isInputing, setIsInputing] = useState<boolean>(false);

  useEffect(() => {
    console.log("isEditing:", isEditing);
  }, [isEditing]);

  return (
    <>
      <HeroMenu />
      <div className='Main'>

        <LeftMenu 
            editOnToggle={ () => setIsEditing(true) }
            inputOnToggle={ () => setIsInputing(true) }
        />

        <Canvas 
          editing={ isEditing }
          inputing={ isInputing }
          setEditFalse={ () => setIsEditing(false) }
          setInputFalse={ () => setIsInputing(false) }
        />

        <RightMenu />

      </div>
      <BottomMenu />
    </>
  )
}

export default App
