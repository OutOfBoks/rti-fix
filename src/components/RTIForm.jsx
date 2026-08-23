import { useState } from "react";
import mockDepartments from "../data/mockDepartments.json";
import { draftRTIRequest } from "../utils/genai";

export default function RTIForm() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [draftedText, setDraftedText] = useState("");
  const [isBpl, setIsBpl] = useState(false);

  const handleAutoFill = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setLoading(true);
    try {
      const result = await draftRTIRequest({userProblem: problem,
      departmentsList: mockDepartments,
      isBpl: isBpl});
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
      {/* BPL Category Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <input
              type="checkbox"
              id="bplCheckbox"
              checked={isBpl}
              onChange={(e) => {setIsBpl(e.target.checked); console.log("CHECKBOX TOGGLED TO:", e.target.checked);}}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="bplCheckbox"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Applicant belongs to BPL Category (Fee Exempted under Sec 7(5))
            </label>
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
              Generated Legal RTI Text
            </label>

            <textarea
              rows="6"
              value={draftedText}
              onChange={(e) => setDraftedText(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md font-mono text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 print:hidden"
            />

            <div className="hidden print:block whitespace-pre-wrap font-mono text-sm text-gray-900 leading-relaxed p-1">
              {draftedText}
            </div>
          </div>          
          {/* Buttons: Copy & PDF */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(draftedText);
                alert("RTI Draft Copied!");
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-900 transition"
            >
              📋 Copy Text
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
            >
              🖨️ Save as PDF / Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
