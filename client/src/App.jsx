import { Routes, Route, Link } from "react-router-dom"
import DocumentManager from './features/admin/DocumentManager';
import Login from './features/auth/Login';
import ChatInterface from './features/chat/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm p-4 flex gap-6 justify-center border-b border-gray-200">
         <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-800 transition">Home / Login</Link>
         <Link to="/chat" className="text-indigo-600 font-medium hover:text-indigo-800 transition">Student Chat</Link>
         <Link to="/admin" className="text-indigo-600 font-medium hover:text-indigo-800 transition">Admin Panel</Link>
      </nav>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/admin" element={<DocumentManager />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
