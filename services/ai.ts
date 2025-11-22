import { GoogleGenAI } from "@google/genai";

// Singleton instance variable
let ai: GoogleGenAI | null = null;

const getClient = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will not work.");
      throw new Error("API Key is missing. Please check your settings.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

interface AIConfig {
  useSearch?: boolean;
  systemInstruction?: string;
}

interface ImageGenConfig {
  aspectRatio?: string;
  imageSize?: string; // '1K', '2K', '4K'
}

/**
 * Generates text response using Gemini 2.5 Flash (fast & efficient).
 * Supports Google Search Grounding.
 */
export const generateAIResponse = async (prompt: string, config: AIConfig = {}) => {
  try {
    const client = getClient();
    const modelId = 'gemini-2.5-flash';
    
    const tools = config.useSearch ? [{ googleSearch: {} }] : undefined;

    const response = await client.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: config.systemInstruction,
        tools: tools,
        temperature: 0.7,
      }
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("AI Text Gen Error:", error);
    throw error;
  }
};

/**
 * Generates images using Gemini 3 Pro Image Preview.
 */
export const generateMarketingImage = async (prompt: string, config: ImageGenConfig = {}) => {
  try {
    const client = getClient();
    // Ensure valid aspect ratio for the config
    const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    const aspectRatio = validRatios.includes(config.aspectRatio || "") ? config.aspectRatio : "1:1";

    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: config.imageSize || '1K'
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data received from Gemini.");

  } catch (error) {
    console.error("AI Image Gen Error:", error);
    throw error;
  }
};