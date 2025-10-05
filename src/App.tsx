import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HeroMenu from './components/HeroMenu'
import BottomMenu from './components/BottomMenu'
import LeftMenu from './components/LeftMenu'
// import Vertex from './components/Vertex'
// import Edge from './components/Edge'

function App() {

  return (
    <>
      <HeroMenu />
      <div className='Main'>
        <LeftMenu />
      </div>
      <BottomMenu />
    </>
  )
}

export default App
