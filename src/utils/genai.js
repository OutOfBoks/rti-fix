import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const draftRTIRequest = async ({ userProblem, departmentsList, isBpl }) => {  
  console.log("RECEIVED IS_BPL VALUE IN API:", isBpl); // Debugging line
const feeLine = isBpl
    ? "APPLICANT IS FROM BPL CATEGORY. FEE IS EXEMPTED UNDER SECTION 7(5) OF RTI ACT 2005. COPY OF BPL CARD ATTACHED."
    : "APPLICATION FEE OF RS. 10/- IS ATTACHED HEREWITH VIA IPO / COURT FEE STAMP / DD.";

  const prompt = `
    User Problem: "${userProblem}"
    Is BPL Applicant: ${isBpl ? "YES" : "NO"}
    Available Departments JSON: ${JSON.stringify(departmentsList)}

    Task:
    1. Match problem with the most relevant Ministry & Public Authority from JSON.
    2. Convert problem into a highly professional, legal RTI application following standard Indian RTI Format.

    DRAFTED TEXT TEMPLATE STRUCTURE:
    FORMAT FOR APPLICATION UNDER RTI ACT 2005

    To,
    The Public Information Officer (PIO),
    [Public Authority Name],
    [Department / Ministry Name],
    [State / District Office Address]

    1. Full Name of Applicant: [Insert Name]
    2. Complete Postal Address: [Insert Address, State, PIN]
    3. Contact Details: [Insert Mobile No / Email]

    SUBJECT: Application under Section 6(1) of the Right to Information Act, 2005 regarding [Short Subject Title].

    PARTICULARS OF INFORMATION REQUIRED:
    1. [Specific, numbered legal query requesting certified copies, inspection, or progress report]
    2. [Second specific query]
    3. [Third specific query regarding timeline or official responsible]

    APPLICATION FEE DETAILS:
    ${feeLine}

    DECLARATION & CLAUSES:
    - I am a Citizen of India.
    - If information falls under another authority, kindly transfer under Section 6(3) within 5 days.
    - Information requested is within 30 days limit under Section 7(1).

    Place: [Insert Place]
    Date: [Insert Date]
    Signature of Applicant: _____________

    Return ONLY raw JSON in this exact structure:
    {
      "selectedMinistry": "Ministry Name",
      "selectedAuthority": "Public Authority Name",
      "draftedText": "Full formatted RTI draft following above structure"
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