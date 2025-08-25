import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Upload, Send, ArrowLeft, FileText, Image, 
  MessageCircle, Bot, User, Mic, Volume2, Download 
} from 'lucide-react';

const StudentSession = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionStep, setSessionStep] = useState('setup'); // setup, learning, summary
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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

  const subjects = userData?.child?.subjects || [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'
  ];

  const topicsBySubject = {
    'Mathematics': ['Arithmetic', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry'],
    'Science': ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
    'English': ['Grammar', 'Literature', 'Writing', 'Reading Comprehension'],
    'Hindi': ['Grammar', 'Literature', 'Poetry', 'Essay Writing'],
    'Social Studies': ['History', 'Geography', 'Civics', 'Economics']
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `sessions/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        name: file.name,
        type: file.type,
        url: downloadURL,
        size: file.size
      };
    });

    const uploadedFileUrls = await Promise.all(uploadPromises);
    setUploadedFiles(prev => [...prev, ...uploadedFileUrls]);
  };

  const startLearningSession = () => {
    const topic = customTopic || selectedTopic;
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `Hello ${userData?.child?.name || 'there'}! 🌟 I'm your AI teacher and I'm excited to help you learn ${selectedSubject}${topic ? ` - ${topic}` : ''}! 

${uploadedFiles.length > 0 ? "I can see you've uploaded some materials. I'll use them to make our lesson more personalized." : ''}

${userData?.child?.teachingStyle ? `I'll teach in a ${userData.child.teachingStyle.toLowerCase()} way, just like you prefer.` : ''}

What would you like to start with? You can:
📚 Ask me to explain a concept
❓ Ask questions about anything you're confused about
📝 Get help with homework
🔍 Explore new topics

What's on your mind today?`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setSessionStep('learning');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAiLoading(true);

    // Simulate AI response (we'll integrate real AI later)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Great question! Let me help you understand this better.

This is a simulated AI response. In the next phase, we'll integrate real AI that can:
🎯 Explain concepts in your preferred language (${userData?.child?.language || 'English'})
📖 Read and analyze your uploaded files
🗣️ Adapt explanations to your learning style
✨ Provide personalized examples and practice problems

For now, I can see you're learning ${selectedSubject} and you asked: "${inputMessage}"

Would you like me to explain this step by step?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setAiLoading(false);
    }, 2000);
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
          Loading Session...
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
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#f8f9fa',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <BookOpen size={32} style={{ color: '#F18F01' }} />
          <div>
            <h1 style={{ color: '#2E86AB', margin: 0, fontSize: '24px' }}>AI Learning Session</h1>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              {userData?.child?.name && `Learning with ${userData.child.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Session Setup */}
      {sessionStep === 'setup' && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#2E86AB', marginBottom: '25px', textAlign: 'center' }}>
            Let's Start Learning! 🚀
          </h2>

          {/* Subject Selection */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
              Choose Subject:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              {subjects.map(subject => (
                <div
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  style={{
                    padding: '15px',
                    border: `2px solid ${selectedSubject === subject ? '#2E86AB' : '#e1e5e9'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: selectedSubject === subject ? '#f0f8ff' : 'white',
                    fontWeight: '600',
                    color: selectedSubject === subject ? '#2E86AB' : '#333',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {subject}
                </div>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          {selectedSubject && (
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
                Choose Topic (Optional):
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px',
                marginBottom: '15px'
              }}>
                {topicsBySubject[selectedSubject]?.map(topic => (
                  <div
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    style={{
                      padding: '10px 12px',
                      border: `2px solid ${selectedTopic === topic ? '#2E86AB' : '#e1e5e9'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: selectedTopic === topic ? '#f0f8ff' : 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: selectedTopic === topic ? '#2E86AB' : '#333'
                    }}
                  >
                    {topic}
                  </div>
                ))}
              </div>

              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Or enter your own topic..."
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          {/* File Upload */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
              Upload Study Materials (Optional):
            </label>
            <div style={{
              border: '2px dashed #ccc',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f9f9f9'
            }}>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <Upload size={30} style={{ color: '#666', marginBottom: '10px' }} />
                <p style={{ color: '#666', margin: 0 }}>
                  Click to upload PDFs, images, or documents
                </p>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                  Uploaded Files:
                </p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: '#f0f8ff',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    {file.type.includes('image') ? <Image size={16} /> : <FileText size={16} />}
                    <span style={{ fontSize: '14px', flex: 1 }}>{file.name}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={startLearningSession}
              disabled={!selectedSubject}
              style={{
                background: selectedSubject ? 'linear-gradient(135deg, #2E86AB, #A23B72)' : '#ccc',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: selectedSubject ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
            >
              <Bot size={20} />
              Start Learning with AI
            </button>
          </div>
        </div>
      )}

      {/* Learning Session */}
      {sessionStep === 'learning' && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #eee',
            background: 'linear-gradient(135deg, #2E86AB, #A23B72)',
            color: 'white',
            borderRadius: '15px 15px 0 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={24} />
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>AI Teacher</h3>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                  Learning {selectedSubject} • {userData?.child?.language || 'English'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: message.type === 'ai' ? 'linear-gradient(135deg, #2E86AB, #A23B72)' : '#28a745',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  {message.type === 'ai' ? '🤖' : '👨‍🎓'}
                </div>
                <div style={{
                  background: message.type === 'ai' ? '#f0f8ff' : '#e8f5e8',
                  padding: '15px',
                  borderRadius: '15px',
                  maxWidth: '70%',
                  whiteSpace: 'pre-line'
                }}>
                  <p style={{ margin: 0, color: '#333' }}>{message.content}</p>
                </div>
              </div>
            ))}

            {aiLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2E86AB, #A23B72)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  🤖
                </div>
                <div style={{
                  background: '#f0f8ff',
                  padding: '15px',
                  borderRadius: '15px'
                }}>
                  <p style={{ margin: 0, color: '#666' }}>AI is thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1,
                padding: '12px 15px',
                border: '2px solid #e1e5e9',
                borderRadius: '25px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || aiLoading}
              style={{
                background: 'linear-gradient(135deg, #2E86AB, #A23B72)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSession;