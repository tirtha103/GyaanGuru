import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import StudentSession from './pages/StudentSession';
import './styles/Auth.css';
import './App.css';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#2E86AB',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Loading GyaanGuru...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <Signup />} 
          />
          
          {/* Onboarding Route */}
          <Route 
            path="/onboarding" 
            element={user ? <Onboarding /> : <Navigate to="/login" />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/student-session" 
            element={user ? <StudentSession /> : <Navigate to="/login" />} 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;