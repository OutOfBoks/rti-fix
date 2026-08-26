import { useState } from "react";
import mockDepartments from "../data/mockDepartments.json";
import { draftRTIRequest } from "../utils/genai";

export default function RTIForm() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [draftedText, setDraftedText] = useState("");
  // Fix: QA 5 & 6 (Error feedback state & async copy state)
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAutoFill = async (e) => {
    if (e) e.preventDefault();
    if (!problem.trim()) {
      setError("Please describe your problem or query first.");
      return;
    }
    setError("");
    setSelectedMinistry("");
    setSelectedAuthority("");
    setDraftedText("");
    setLoading(true);

    try {
      const result = await draftRTIRequest({
        userProblem: problem,
        departmentsList: mockDepartments,
      });

      // Fix: QA 9 (Validate full schema - do not put error strings inside draftedText)
      if (!result ||typeof result.draftedText !== "string" ||!result.draftedText.trim()) {
        throw new Error("Unable to generate a valid RTI draft. Please try again.",);
      }

      const safeMinistry = typeof result?.selectedMinistry === "string" ? result.selectedMinistry : "";
      const safeAuthority = typeof result?.selectedAuthority === "string" ? result.selectedAuthority : "";

      setSelectedMinistry(safeMinistry);
      setSelectedAuthority(safeAuthority);
      setDraftedText(result.draftedText.slice(0, 3000));
    } catch (err) {
      console.error(err);
      // Fix: QA 10 (User-friendly error message instead of developer guidance)
      setError("Failed to generate RTI draft. Please try again or check your network.",);
    } finally {
      setLoading(false);
    }
  };
  // Fix: QA 5 (Async/await clipboard handling with error fallback)
  const handleCopy = async () => {
    if (!draftedText) return;
    try {
      await navigator.clipboard.writeText(draftedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Could not auto-copy. Please select and copy the text manually.",err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800"> File RTI Application</h2>

      <form onSubmit={handleAutoFill} className="space-y-4 print:hidden">
        <div> {/* Fix: QA 6 (htmlFor added) */}
          <label
            htmlFor="rti-problem-input"
            className="block text-sm font-medium text-gray-700 mb-1">
            Describe Your Problem (Hindi / Hinglish / English)
          </label>
          {/* Fix: QA 6 (id added) */}
          <textarea id="rti-problem-input" rows="3"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="e.g. Mere ghar ke paas ki sadak 6 mahine se tooti hai, koi action nahi le raha (Max 1000 characters)..."
            value={problem}
            maxLength={1000}
            onChange={(e) => setProblem(e.target.value)}
          />
          <div className="text-xs text-gray-500 text-right">
            {problem.length}/1000 characters
          </div>
          {/* Fix: QA 3 (Privacy disclaimer) */}
          <p className="text-xs text-gray-500 mt-1">
            🔒 Privacy Note: Do not include sensitive personal IDs, passwords,or financial credentials.
          </p>
        </div>

        {/* Fix: QA 6 (Visible Error message) */}
        {error && (
          <div role="alert"
            className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <button  type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "AI Auto-Selecting Ministry & Drafting..." : "Auto-Fill Ministry & Generate Draft"}
        </button>
      </form>
      {/* Fix: QA 11 (Render output strictly when valid draftedText exists) */}
      {draftedText && draftedText.trim().length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Fix: QA 11 (Unresolved Authority Handling with One-Click Auto-Resolve) */}
          {(!selectedAuthority || selectedAuthority.trim().toUpperCase() === "N/A") && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-center justify-between print:hidden">
              <span>
                ⚠️ <strong>Authority Unresolved:</strong> Public Authority field contains "N/A".
              </span>
              <button  type="button"
                onClick={handleAutoFill}
                className="ml-2 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded transition">
                🔄 Auto-Resolve Authority
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
            <div>  {/* Fix: QA 6 (htmlFor & id added) */}
              <label htmlFor="ministry-input"
                className="block text-sm font-medium text-gray-700 mb-1">
                Selected Ministry
              </label>
              <input  id="ministry-input" type="text"
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-medium text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              {/* Fix: QA 6 (htmlFor & id added) */}
              <label  htmlFor="authority-input"
                className="block text-sm font-medium text-gray-700 mb-1">
                Public Authority
              </label>
              <input  id="authority-input"  type="text"
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-medium text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div> {/* Fix: QA 6 (htmlFor & id added) */}
            <label  htmlFor="draft-textarea"
              className="block text-sm font-medium text-gray-700 mb-1 print:hidden flex justify-between">
              <span>Generated Legal RTI Text</span>
              <span>{draftedText.length}/3000 Chars</span>
            </label>
            <textarea  id="draft-textarea"  rows="12"
              value={draftedText}
              maxLength={3000}
              onChange={(e) => setDraftedText(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md font-mono text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 print:hidden"
            />

            {/* Print Only Heading + Text */}
            <div className="hidden print:block whitespace-pre-wrap font-mono text-sm text-gray-900 leading-relaxed p-1">
              <div className="mb-4">
                <strong>Ministry:</strong> {selectedMinistry || "N/A"}
                <br />
                <strong>Public Authority:</strong> {selectedAuthority || "N/A"}
              </div>
              {draftedText}
            </div>
          </div>

          {/* Fix: QA 4 & 5 (State RTI Notice Badge + Disclaimer) */} {/* State/Central Submission Guidance Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 print:hidden shadow-sm">
              <span className="text-base leading-none">📌</span>
              <div>
                <strong className="font-semibold text-amber-950">
                  Important:
                </strong>
                Central authorities ke liye
                <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-mono">
                  rtionline.gov.in
                </code>
                use karein. State/Local issues (jaise State Police, Nagar Nigam)
                ke liye respective State Portal par submit karein.
              </div>
            </div>          

          {/* Buttons Container: Equal Size & Uniform Height */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 print:hidden">
            {/* 1. Copy Button */}
            <button  type="button"  onClick={handleCopy}
              className="flex-1 w-full py-2.5 px-4 text-xs font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 cursor-pointer">
              <span>{copied ? "✓ Copied!" : "📋 Copy Text"}</span>
            </button>

            {/* 2. PDF / Print Draft Button */}
            <button  type="button"  onClick={() => window.print()}
              className="flex-1 w-full py-2.5 px-4 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Download PDF / Print
            </button>

            {/* 3. Direct RTI Online Portal Button */}
            <a  href="https://rtionline.gov.in"  target="_blank"  rel="noreferrer"
              className="flex-1 w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-all text-center"
            >
              <span>Open RTI Portal</span>
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
