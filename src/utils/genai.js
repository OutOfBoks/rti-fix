import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const draftRTIRequest = async ({ userProblem, departmentsList }) => {
  /* const systemInstruction = `
You are an expert Indian RTI Draft Writer. Follow these STRICT formatting rules:
1. CHAR LIMIT: The generated RTI application text MUST be strictly UNDER 2800 characters (to safely fit within the official portal's 3000 character limit).
2. ALLOWED CHARACTERS ONLY: Use ONLY standard alphabets (A-Z, a-z), numbers (0-9), and these allowed special characters: . - _ ( ) / @ : & ? %
3. DO NOT use any unallowed symbols, emojis, bullet points like '•' or special quotes.`;

  const userPrompt = `
User Problem Description: ${userProblem}
Available Departments: ${JSON.stringify(departmentsList)}

Based on this, generate:
1. Selected Department Name
2. Precise RTI Application Text
`; */
  const systemInstruction = `
You are an expert Indian RTI Application Writer. Return a JSON object with strictly these 3 keys:
1. "selectedMinistry"
2. "selectedAuthority"
3. "draftedText"

STRICT RULES FOR "draftedText":
- CHAR LIMIT: MUST be strictly under 2800 characters (max limit of official RTI portal is 3000).
- ALLOWED CHARS ONLY: Use ONLY alphabets (A-Z, a-z), numbers (0-9), and these allowed special characters: . - _ ( ) / @ : & ? %
- NO UNALLOWED CHARS: Do NOT use bullet points (•), asterisks (*), hash (#), emojis, or complex quotes.
`;

  const userPrompt = `
User Problem Description: ${userProblem}
Available Departments List: ${JSON.stringify(departmentsList)}

Instructions:
1. Select the most appropriate Ministry and Public Authority.
2. Generate ONLY the Subject Line and the specific numbered points/questions asking for information.
3. DO NOT include salutations (like "To PIO", "Sir/Madam"), fee details, or applicant address placeholders.
`;

  const prompt = `${systemInstruction}\n\n${userPrompt}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text || "Anda le";
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
