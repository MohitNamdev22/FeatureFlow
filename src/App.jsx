import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UXWireframeGenerator from './UXWireframeGenerator' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UXWireframeGenerator />
    </>
  )
}

export default App
