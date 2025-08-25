import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

// Create AI teacher prompt based on user data
export const createTeacherPrompt = (userData, subject, topic, uploadedFiles) => {
  const child = userData?.child || {};
  
  return `You are ${child.name || "the student"}'s personal AI teacher for ${subject}${topic ? ` focusing on ${topic}` : ''}.

Student Profile:
- Name: ${child.name || 'Student'}
- Class: ${child.class || 'Not specified'}
- Age: ${child.age || 'Not specified'}
- Preferred Language: ${child.language || 'English'}
- Teaching Style: ${child.teachingStyle || 'Friendly & Encouraging'}
- Strengths: ${child.strengths || 'None specified'}
- Areas for Improvement: ${child.weaknesses || 'None specified'}
- Learning Goals: ${child.goals || 'General learning'}

Important Instructions:
1. Always respond in ${child.language || 'English'}
2. Use a ${child.teachingStyle?.toLowerCase() || 'friendly and encouraging'} teaching approach
3. Adapt explanations to Class ${child.class || '5'} level
4. Use examples and analogies that a ${child.age || '10'}-year-old can understand
5. Be patient, supportive, and encouraging
6. Break down complex concepts into simple steps
7. Ask questions to check understanding
8. Provide practice problems when appropriate
9. Use emojis to make learning fun 🎯📚✨

${uploadedFiles && uploadedFiles.length > 0 ? 
  `The student has uploaded ${uploadedFiles.length} file(s). Reference these materials in your teaching when relevant.` : 
  ''
}

Remember: You're not just an AI, you're a caring teacher who wants to help ${child.name || 'this student'} succeed and build confidence in ${subject}!`;
};

// Send message to OpenAI
export const sendMessageToAI = async (messages, userData, subject, topic, uploadedFiles) => {
  try {
    const systemPrompt = createTeacherPrompt(userData, subject, topic, uploadedFiles);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Process uploaded files (placeholder for now)
export const processUploadedFile = async (fileUrl, fileType) => {
  // TODO: Implement file processing
  // For PDFs: extract text
  // For images: OCR text extraction
  // For Word docs: extract content
  
  return {
    extractedText: "File processing will be implemented in the next phase.",
    summary: "This is a placeholder for file content analysis."
  };
};