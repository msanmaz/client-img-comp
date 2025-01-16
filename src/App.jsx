import { Routes, Route, Link } from 'react-router-dom'
import Home from '@routes/Home'
import About from '@routes/About'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-300">About</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}
