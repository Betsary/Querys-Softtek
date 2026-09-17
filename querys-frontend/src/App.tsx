import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Tienda from './Pages/Tienda'
import Dashboard from './Pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
