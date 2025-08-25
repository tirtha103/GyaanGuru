import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Target, Zap, Clock, Star } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [childData, setChildData] = useState({
    name: '',
    class: '',
    age: '',
    subjects: [],
    strengths: '',
    weaknesses: '',
    learningStyle: '',
    teachingStyle: '',
    pace: '',
    goals: '',
    studyTime: '',
    language: 'English'
  });
  
  const navigate = useNavigate();

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 
    'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 
    'Economics', 'Political Science', 'Computer Science'
  ];
  const languages = [
    'English', 'Hindi', 'Bengali', 'Tamil', 'Marathi', 'Gujarat', 
    'Telugu', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu'
  ];

  const handleInputChange = (field, value) => {
    setChildData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subject) => {
    setChildData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        child: childData,
        onboardingCompleted: true,
        updatedAt: new Date()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2E86AB, #A23B72)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            <BookOpen size={32} />
            <h1 style={{ margin: 0, fontSize: '28px' }}>GyaanGuru</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9 }}>Let's set up your child's personalized learning journey</p>
          
          {/* Progress Bar */}
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            height: '8px',
            borderRadius: '4px',
            marginTop: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#F18F01',
              height: '100%',
              width: `${(step / 4) * 100}%`,
              transition: 'width 0.3s ease',
              borderRadius: '4px'
            }} />
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>Step {step} of 4</p>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <User size={24} style={{ color: '#2E86AB' }} />
                <h2 style={{ color: '#2E86AB', margin: 0 }}>Tell us about your child</h2>
              </div>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={childData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your child's name"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Class
                    </label>
                    <select
                      value={childData.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Age
                    </label>
                    <input
                      type="number"
                      value={childData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Age"
                      min="5"
                      max="18"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Preferred Learning Language
                  </label>
                  <select
                    value={childData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '16px'
                    }}
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Subjects */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <BookOpen size={24} style={{ color: '#2E86AB' }} />
                <h2 style={{ color: '#2E86AB', margin: 0 }}>Which subjects need focus?</h2>
              </div>
              
              <p style={{ color: '#666', marginBottom: '25px' }}>
                Select the subjects your child needs help with:
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {subjects.map(subject => (
                  <div
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    style={{
                      padding: '15px 20px',
                      border: `2px solid ${childData.subjects.includes(subject) ? '#2E86AB' : '#e1e5e9'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: childData.subjects.includes(subject) ? '#f0f8ff' : 'white',
                      transition: 'all 0.3s ease',
                      fontWeight: '600',
                      color: childData.subjects.includes(subject) ? '#2E86AB' : '#333'
                    }}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Learning Preferences */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Zap size={24} style={{ color: '#2E86AB' }} />
                <h2 style={{ color: '#2E86AB', margin: 0 }}>Learning Preferences</h2>
              </div>
              
              <div style={{ display: 'grid', gap: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#333' }}>
                    Teaching Style
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {['Friendly & Encouraging', 'Strict & Focused', 'Patient & Slow', 'Fast & Challenging'].map(style => (
                      <div
                        key={style}
                        onClick={() => handleInputChange('teachingStyle', style)}
                        style={{
                          padding: '12px 15px',
                          border: `2px solid ${childData.teachingStyle === style ? '#2E86AB' : '#e1e5e9'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          background: childData.teachingStyle === style ? '#f0f8ff' : 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Child's Strengths
                  </label>
                  <textarea
                    value={childData.strengths}
                    onChange={(e) => handleInputChange('strengths', e.target.value)}
                    placeholder="What is your child good at? (e.g., quick learner, good memory, creative thinking)"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Areas for Improvement
                  </label>
                  <textarea
                    value={childData.weaknesses}
                    onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                    placeholder="What challenges does your child face? (e.g., concentration issues, math anxiety, handwriting)"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Target size={24} style={{ color: '#2E86AB' }} />
                <h2 style={{ color: '#2E86AB', margin: 0 }}>Learning Goals</h2>
              </div>
              
              <div style={{ display: 'grid', gap: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Primary Learning Goals
                  </label>
                  <textarea
                    value={childData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    placeholder="What do you want your child to achieve? (e.g., improve grades, prepare for exams, build confidence)"
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#333' }}>
                    Daily Study Time
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {['30 minutes', '1 hour', '1.5 hours', '2+ hours'].map(time => (
                      <div
                        key={time}
                        onClick={() => handleInputChange('studyTime', time)}
                        style={{
                          padding: '12px 15px',
                          border: `2px solid ${childData.studyTime === time ? '#2E86AB' : '#e1e5e9'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          background: childData.studyTime === time ? '#f0f8ff' : 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px',
            paddingTop: '30px',
            borderTop: '1px solid #eee'
          }}>
            <button
              onClick={prevStep}
              disabled={step === 1}
              style={{
                padding: '12px 25px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                background: 'white',
                color: '#666',
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: step === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={
                  (step === 1 && (!childData.name || !childData.class || !childData.age)) ||
                  (step === 2 && childData.subjects.length === 0)
                }
                style={{
                  padding: '12px 25px',
                  background: 'linear-gradient(135deg, #2E86AB, #A23B72)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '12px 25px',
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Star size={16} />
                {loading ? 'Setting Up...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;