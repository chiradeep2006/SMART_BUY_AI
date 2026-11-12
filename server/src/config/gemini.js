import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

export const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[Gemini AI] GEMINI_API_KEY is not configured or using placeholder. Running in deterministic local AI mode.');
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    model = genAI.getGenerativeModel({ model: modelName });
    console.log(`[Gemini AI] Initialized with model: ${modelName}`);
    return model;
  } catch (error) {
    console.error('[Gemini AI] Failed to initialize Gemini client:', error.message);
    return null;
  }
};

export const getGeminiModel = () => {
  if (!model) {
    return initGemini();
  }
  return model;
};
