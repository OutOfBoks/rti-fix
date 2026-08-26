# RTI-Fix 🏛️

An AI-powered tool that automatically drafts legally precise RTI (Right to Information) applications and identifies the correct Public Authority/Ministry under the Indian RTI Act, 2005.

## Features
- **Smart Department Matching**: Matches user queries to the right Public Authority.
- **Print & PDF Support**: Generates clean, print-ready legal document drafts.
- **Multilingual Support**: Accepts Hindi, English, and Hinglish inputs.
- **Instant Portal Guidance**: Formats text for direct copy-pasting to official RTI filing portals.
- **State vs. Central Guidance**: Clear submission guidance for Central (`rtionline.gov.in`) and State/Local public authorities.

## 🛡️ Security, Reliability & Quality Guardrails
- **Structured JSON Engine**: Powered by Gemini API with structured JSON output for precise Ministry and Public Authority mapping.
- **Prompt Injection Protection**: Input boundary isolation (`<USER_PROBLEM>`) to prevent jailbreaks or instruction manipulation.
- **Portal Compliance Enforced**: Strict character set filtering and length limits (max 3,000 characters) matching official government filing portals.
- **Non-Blocking Fault Tolerance**: Safe error handling and non-blocking inline feedback for seamless user experience.

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