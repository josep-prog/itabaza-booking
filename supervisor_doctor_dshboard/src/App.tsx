import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import CompletedDocs from './pages/CompletedDocs'
import Messaging from './pages/Messaging'
import Profile from './pages/Profile'
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'
import SupervisorAppointments from './pages/supervisor/SupervisorAppointments'
import Doctors from './pages/supervisor/Doctors'
import Comments from './pages/supervisor/Comments'
import SupervisorMessaging from './pages/supervisor/SupervisorMessaging'
import SupportSMS from './pages/supervisor/SupportSMS'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { useAuth } from './contexts/AuthContext'

function AppRoutes() {
  const { user } = useAuth()

  if (user?.role === 'supervisor') {
    return (
      <Routes>
        <Route path="/" element={<SupervisorDashboard />} />
        <Route path="/appointments" element={<SupervisorAppointments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/messaging" element={<SupervisorMessaging />} />
        <Route path="/support-sms" element={<SupportSMS />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/completed" element={<CompletedDocs />} />
      <Route path="/messaging" element={<Messaging />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Layout>
              <AppRoutes />
            </Layout>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#374151',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App