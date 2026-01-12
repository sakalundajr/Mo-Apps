
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePostCaption(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a catchy and engaging social media post caption about: ${topic}. Keep it friendly and use emojis. Max 2 sentences.`,
    });
    return response.text?.trim() || "Ready to share!";
  } catch (error) {
    console.error("AI Generation Error", error);
    return "Error generating caption.";
  }
}

export async function generateAdCopy(productName: string, productDesc: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling advertisement headline and body text for a product called "${productName}" with description: "${productDesc}". Format as: "Headline: ... \nBody: ..."`,
    });
    return response.text?.trim() || "Check this out!";
  } catch (error) {
    console.error("AI Ad Generation Error", error);
    return "Amazing deal!";
  }
}

export async function moderateContent(text: string) {
  // Simulate a moderation check
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Is the following social media post text safe and community-friendly? Respond only with YES or NO. Text: "${text}"`,
    });
    return response.text?.trim().toUpperCase() === "YES";
  } catch (error) {
    return true; // Default to allow if API fails
  }
}
