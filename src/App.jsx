import { Routes, Route } from 'react-router-dom'
import Home from '@routes/Home'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}
