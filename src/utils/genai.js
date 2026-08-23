import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const draftRTIRequest = async (userProblem, departmentsList) => {
  const prompt = `
    User Problem: "${userProblem}"
    Available Departments JSON: ${JSON.stringify(departmentsList)}

    Task:
    1. Match problem with the most relevant Ministry & Public Authority from JSON.
    2. Convert problem into a formal, legal RTI Query string.

    Return ONLY raw JSON in this exact structure:
    {
      "selectedMinistry": "Ministry Name",
      "selectedAuthority": "Public Authority Name",
      "draftedText": "1. Provide certified copies of..."
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text);
};