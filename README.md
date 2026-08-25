# RTI-Fix 🏛️

An AI-powered tool that automatically drafts legally precise RTI (Right to Information) applications and identifies the correct Public Authority/Ministry under the Indian RTI Act, 2005.

## Features
- **Smart Department Matching**: Matches user queries to the right Public Authority.
- **Print & PDF Support**: Generates clean, print-ready legal document drafts.
- **Multilingual Support**: Accepts Hindi, English, and Hinglish inputs.
- **Instant Portal Guidance**: Formats text for direct copy-pasting to official RTI filing portals.

## Tech Stack & Development
- **Frontend**: React (Vite), Tailwind CSS
- **AI Engine**: Gemini API (`@google/genai`) Integration
- **Hosting**: Vercel
- **AI Assistance & Quality Assurance**: Built & QA-audited with Codex / AI Engineering workflows to ensure strict adherence to hackathon POC guidelines and UX accessibility.

## Local Setup
1. Clone repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Add `.env` file in root directory: `VITE_GEMINI_API_KEY=your_key_here`
4. Run project: `npm run dev`