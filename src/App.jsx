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
        <Route path="/login" element={<Login />} />
        <Route element={<LayoutMain />}>
          <Route path="/" element={<Home />} />
        </Route>
    </Routes>
    </>
  )
}

export default App
