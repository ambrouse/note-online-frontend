import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LayoutMain from './layout/LayoutMain';
import Login from './pages/Login';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<LayoutMain />}>
          <Route path="/home" element={<Home />} />
        </Route>
    </Routes>
    </>
  )
}

export default App
