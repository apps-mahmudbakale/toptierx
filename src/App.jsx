import { Routes, Route, Navigate } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import Ticketing from './pages/Ticketing'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BookingProvider>
          <Routes>
            {/* Login - no navbar/footer */}
            <Route path="/login" element={<Login />} />
            
            {/* Public routes with regular navbar */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/event/:id" element={<><Navbar /><EventDetails /><Footer /></>} />
            <Route path="/event/:id/tickets" element={<><Navbar /><Ticketing /><Footer /></>} />
            
            {/* Protected dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookingProvider>
      </EventProvider>
    </AuthProvider>
  )
}
