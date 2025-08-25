import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, LogOut, User, BarChart, Settings, Play, 
  Clock, Award, TrendingUp, Target, Calendar, Bell 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          textAlign: 'center'
        }}>
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <BookOpen size={32} style={{ color: '#F18F01' }} />
          <div>
            <h1 style={{ color: '#2E86AB', margin: 0, fontSize: '28px' }}>GyaanGuru</h1>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Welcome back, {userData?.name || user?.email?.split('@')[0]}!
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: '#f8f9fa',
            padding: '8px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Bell size={16} style={{ color: '#666' }} />
            <span style={{ fontSize: '12px', color: '#666' }}>7 days free trial</span>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Child Info Card */}
      {userData?.child && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '2px solid #E8F4FD'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <User size={24} style={{ color: '#2E86AB' }} />
            <h3 style={{ color: '#2E86AB', margin: 0 }}>Student Profile</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>Name</p>
              <p style={{ color: '#333', margin: 0, fontWeight: '600', fontSize: '16px' }}>
                {userData.child.name}
              </p>
            </div>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>Class & Age</p>
              <p style={{ color: '#333', margin: 0, fontWeight: '600', fontSize: '16px' }}>
                Class {userData.child.class}, Age {userData.child.age}
              </p>
            </div>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>Language</p>
              <p style={{ color: '#333', margin: 0, fontWeight: '600', fontSize: '16px' }}>
                {userData.child.language}
              </p>
            </div>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>Focus Subjects</p>
              <p style={{ color: '#333', margin: 0, fontWeight: '600', fontSize: '16px' }}>
                {userData.child.subjects?.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div 
          onClick={() => navigate('/student-session')}
          style={{
            background: 'linear-gradient(135deg, #2E86AB, #A23B72)',
            color: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <Play size={40} style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Start Learning Session</h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
            Begin AI-powered tutoring with {userData?.child?.name || 'your child'}
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}>
          <BarChart size={40} style={{ color: '#28a745', marginBottom: '15px' }} />
          <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '18px' }}>View Progress</h3>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            Track learning achievements and improvements
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}>
          <Settings size={40} style={{ color: '#6f42c1', marginBottom: '15px' }} />
          <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '18px' }}>Settings</h3>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            Customize learning preferences and goals
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Clock size={30} style={{ color: '#F18F01', marginBottom: '10px' }} />
          <h4 style={{ color: '#333', margin: '0 0 5px 0' }}>Study Time</h4>
          <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>0 hrs</p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>This week</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Award size={30} style={{ color: '#28a745', marginBottom: '10px' }} />
          <h4 style={{ color: '#333', margin: '0 0 5px 0' }}>Achievements</h4>
          <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>0</p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>Badges earned</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <TrendingUp size={30} style={{ color: '#2E86AB', marginBottom: '10px' }} />
          <h4 style={{ color: '#333', margin: '0 0 5px 0' }}>Progress</h4>
          <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>0%</p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>Weekly goals</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Target size={30} style={{ color: '#dc3545', marginBottom: '10px' }} />
          <h4 style={{ color: '#333', margin: '0 0 5px 0' }}>Streak</h4>
          <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>0</p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>Days active</p>
        </div>
      </div>

      {/* Development Status */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '2px solid #28a745'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Calendar size={24} style={{ color: '#28a745' }} />
          <h4 style={{ color: '#28a745', margin: 0 }}>🚀 Development Progress</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>✅ Completed</p>
            <ul style={{ color: '#28a745', fontSize: '13px', marginLeft: '15px' }}>
              <li>User Authentication</li>
              <li>Parent Onboarding</li>
              <li>Dashboard Setup</li>
            </ul>
          </div>
          <div>
            <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>🔄 Coming Next</p>
            <ul style={{ color: '#2E86AB', fontSize: '13px', marginLeft: '15px' }}>
              <li>AI Tutoring System</li>
              <li>File Upload & Processing</li>
              <li>Multilingual Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;