import { useState, useEffect } from 'react'
import './App.css'
import HeroMenu from './components/HeroMenu'
import BottomMenu from './components/BottomMenu'
import LeftMenu from './components/LeftMenu'
import RightMenu from './components/RightMenu'
import Canvas from './components/Canvas'
import EditGraph from './components/pop-ups/edit'


function App() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    console.log("isEditing:", isEditing);
  }, [isEditing]);

  return (
    <>
      <HeroMenu />
      <div className='Main'>
        <LeftMenu 
          editOnToggle={ () => setIsEditing(true) }
        />
        <Canvas 
          editing={ isEditing }
          setEdit={ () => setIsEditing(false) }
        />
        <RightMenu />
      </div>
      <BottomMenu />
    </>
  )
}

export default App
