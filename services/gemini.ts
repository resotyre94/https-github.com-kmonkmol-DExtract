import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const extractDataFromImage = async (
  base64Image: string,
  fieldsDescription: string
): Promise<Record<string, any>> => {
  const ai = getAiClient();
  
  // Clean base64 string if it has prefix
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  const prompt = `
    Analyze this document page image. 
    Extract the following information: ${fieldsDescription}.
    
    If the document contains a list or table, try to aggregate the main details. 
    If a specific field is not found, return null for that field.
    
    Return the result strictly as a valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        // We use loose schema definition here or just prompt for JSON to allow flexibility 
        // since user defines fields dynamically.
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};