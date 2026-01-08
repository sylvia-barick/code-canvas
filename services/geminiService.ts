
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult } from "../types";

const parseDataUrl = (dataUrl: string) => {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid image format provided.");
  return { mimeType: matches[1], data: matches[2] };
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: { 
      type: Type.BOOLEAN, 
      description: "True if both images are clearly website landing pages or software UI mockups." 
    },
    validationError: { 
      type: Type.STRING, 
      description: "Explanation if images are not landing pages." 
    },
    imageA: {
      type: Type.OBJECT,
      properties: {
        scores: {
          type: Type.OBJECT,
          properties: {
            visualHierarchy: { type: Type.NUMBER },
            clarityOfMessage: { type: Type.NUMBER },
            ctaStrength: { type: Type.NUMBER },
            layoutConsistency: { type: Type.NUMBER },
            aestheticAppeal: { type: Type.NUMBER },
          },
          required: ["visualHierarchy", "clarityOfMessage", "ctaStrength", "layoutConsistency", "aestheticAppeal"]
        },
        totalScore: { type: Type.NUMBER },
        summary: { type: Type.STRING }
      },
      required: ["scores", "totalScore", "summary"]
    },
    imageB: {
      type: Type.OBJECT,
      properties: {
        scores: {
          type: Type.OBJECT,
          properties: {
            visualHierarchy: { type: Type.NUMBER },
            clarityOfMessage: { type: Type.NUMBER },
            ctaStrength: { type: Type.NUMBER },
            layoutConsistency: { type: Type.NUMBER },
            aestheticAppeal: { type: Type.NUMBER },
          },
          required: ["visualHierarchy", "clarityOfMessage", "ctaStrength", "layoutConsistency", "aestheticAppeal"]
        },
        totalScore: { type: Type.NUMBER },
        summary: { type: Type.STRING }
      },
      required: ["scores", "totalScore", "summary"]
    },
    overallWinner: { 
      type: Type.STRING, 
      description: "Choose 'A', 'B', or 'Draw'."
    },
    visualDifferences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A detailed list of 4-6 specific visual differences found between Image A and Image B."
    }
  },
  required: ["isValid", "imageA", "imageB", "overallWinner", "visualDifferences"]
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error.message?.includes("429") || error.message?.includes("Too Many Requests");
      const isServerError = error.message?.includes("500") || error.message?.includes("503");
      
      if (isRateLimit || isServerError) {
        const waitTime = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await sleep(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const evaluateLandingPages = async (
  imageADataUrl: string, 
  imageBDataUrl: string
): Promise<ComparisonResult> => {
  return fetchWithRetry(async () => {
    // Explicitly check for API_KEY presence to provide better error messaging
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is missing. Please set it in Vercel settings.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const imgA = parseDataUrl(imageADataUrl);
    const imgB = parseDataUrl(imageBDataUrl);

    // Using gemini-3-flash-preview as per mandated guidelines for vision/content tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Perform a design audit of these two landing page variants. Image A is the original, Image B is the variant. Use the specified JSON schema." },
            { inlineData: { mimeType: imgA.mimeType, data: imgA.data } },
            { inlineData: { mimeType: imgB.mimeType, data: imgB.data } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("The AI returned an empty response.");
    
    try {
      const parsed = JSON.parse(resultText);
      if (parsed.isValid === false) {
        return { isValid: false, validationError: parsed.validationError };
      }
      return parsed as ComparisonResult;
    } catch (e) {
      console.error("JSON Parse Error:", resultText);
      throw new Error("Failed to parse AI response. Try again.");
    }
  });
};