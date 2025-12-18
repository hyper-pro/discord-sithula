import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Initialize or get existing chat session
const getChatSession = () => {
  const client = getAIClient();
  if (!chatSession) {
    chatSession = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a helpful, witty, and concise AI assistant living inside a Discord-like chat application. Your name is Gemini. Use markdown for formatting code and emphasis.",
      },
    });
  }
  return chatSession;
};

export const streamGeminiResponse = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const chat = getChatSession();
  let fullText = "";

  try {
    const resultStream = await chat.sendMessageStream({ message });

    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      const text = c.text; 
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = "\n[System: Error communicating with Gemini API]";
    fullText += errorMessage;
    onChunk(fullText);
  }

  return fullText;
};
