require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    console.log('Testing Gemini API...');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Say hello in one sentence.',
    });

    console.log('SUCCESS!');
    console.log(response.text);

  } catch (error) {
    console.error('GEMINI TEST FAILED:');
    console.error(error.message);
  }
}

testGemini();