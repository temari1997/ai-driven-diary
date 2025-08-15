
import { GoogleGenAI } from "@google/genai";
import { AI_SYSTEM_PROMPT } from "../constants";

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // In a real app, you'd have a more robust way to handle this.
    // For this environment, we'll alert the user.
    console.error("API_KEY environment variable not set.");
    throw new Error("API_KEY is not configured.");
  }
  return apiKey;
};

// We initialize this once and reuse it.
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: getApiKey() });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI:", e);
  // The UI will handle this state.
}


export const getAIFeedback = async (diaryContent: string): Promise<string> => {
  if (!ai) {
    // This provides a user-facing error if the API key was missing on startup.
    return Promise.reject("The AI service is not available. Please check the API key configuration.");
  }

  if (!diaryContent.trim()) {
    return "It looks like your entry is empty. Write something about your day!";
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: diaryContent,
        config: {
            systemInstruction: AI_SYSTEM_PROMPT,
        }
    });
    
    // Using the recommended way to get text
    const text = response.text;
    if (!text) {
        throw new Error("Received an empty response from the AI.");
    }
    return text;
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    // Provide a more user-friendly error message
    return "Sorry, I'm having a little trouble thinking right now. Please try again in a bit.";
  }
};
   