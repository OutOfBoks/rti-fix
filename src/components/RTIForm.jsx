import { useState } from "react";
import mockDepartments from "../data/mockDepartments.json";
import { draftRTIRequest } from "../utils/genai";

export default function RTIForm() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [draftedText, setDraftedText] = useState("");

  const handleAutoFill = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setLoading(true);
    try {
      const result = await draftRTIRequest({
        userProblem: problem,
        departmentsList: mockDepartments,
      });
      setSelectedMinistry(result.selectedMinistry || "");
      setSelectedAuthority(result.selectedAuthority || "");
      setDraftedText(result.draftedText || "");
    } catch (err) {
      console.error(err);
      alert("Error processing request. Check console/API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        File RTI Application
      </h2>

      <form onSubmit={handleAutoFill} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe Your Problem (Hindi / Hinglish / English)
          </label>
          <textarea
            rows="3"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="e.g. Mere ghar ke paas ki sadak 6 mahine se tooti hai, koi action nahi le raha..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading
            ? "AI Auto-Selecting Ministry & Drafting..."
            : "Auto-Fill Ministry & Generate Draft"}
        </button>
      </form>

      {(selectedMinistry || draftedText) && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Ministry
              </label>
              <input
                type="text"
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-medium text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public Authority
              </label>
              <input
                type="text"
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-medium text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 print:hidden">
              <span>Generated Legal RTI Text </span>
              <span>{draftedText.length}/3000 Chars</span>
            </label>

            <textarea
              rows="12"
              value={draftedText}
              maxLength={3000}
              onChange={(e) => setDraftedText(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md font-mono text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 print:hidden"
            />

            <div className="hidden print:block whitespace-pre-wrap font-mono text-sm text-gray-900 leading-relaxed p-1">
              {draftedText}
            </div>
          </div>
          {/* Buttons: Copy & PDF */}

          {/* Buttons Container: Equal Size & Uniform Height */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* 1. Copy Button */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(draftedText);
                alert("RTI Draft Copied!");
              }}
              className="flex-1 w-full py-2.5 px-4 text-xs font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📋 Copy Text</span>
            </button>

            {/* 2. PDF / Print Draft Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 w-full py-2.5 px-4 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
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
            <a
              href="https://rtionline.gov.in"
              target="_blank"
              rel="noreferrer"
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
