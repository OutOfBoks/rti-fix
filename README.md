# RTI-Fix 🏛️

An AI-powered tool that automatically drafts legally precise RTI (Right to Information) applications and identifies the correct Public Authority/Ministry under the Indian RTI Act, 2005.

## Features
- **Smart Department Matching**: Matches user queries to the right Public Authority.
- **BPL Fee Exemption Support**: Auto-includes Section 7(5) legal clause if BPL is selected.
- **Print & PDF Support**: Generates clean, print-ready legal document drafts.
- **Multilingual Support**: Accepts Hindi, English, and Hinglish inputs.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **AI**: Gemini API (`@google/genai`)
- **Hosting**: Vercel

## Local Setup
1. Clone repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Add `.env` file: `VITE_GEMINI_API_KEY=your_key_here`
4. Run project: `yarn dev`