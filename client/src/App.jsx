import { Routes, Route, Navigate } from "react-router-dom"
import DocumentManager from './features/admin/DocumentManager';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ChatView from './features/chat/ChatView';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Guest Only Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/chat" element={<ChatView />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/documents" element={<DocumentManager />} />
          <Route path="/admin" element={<Navigate to="/admin/documents" replace />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
