import React, { useState } from 'react';
import { AssessmentResult } from '../types';

interface ResearchAssessmentWordingProps {
  assessment: AssessmentResult;
}

export const ResearchAssessmentWording: React.FC<ResearchAssessmentWordingProps> = ({ assessment }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const { grs, assessmentWording } = assessment;

  // Fallback function to derive certainty from GRS if not provided by the API
  const getCertaintyFromGrs = (score: number): string => {
    if (score <= 20) return "very high";
    if (score <= 49) return "high";
    if (score <= 75) return "low";
    return "very low";
  };

  // Provide fallbacks if assessmentWording or its properties are missing from the API response
  const certainty = assessmentWording?.certainty || getCertaintyFromGrs(grs);
  const topic = assessmentWording?.topic || '[undetermined topic]';

  const grsScore = Math.round(grs);

  const finalWording = `With a GRS of ${grsScore}, there is ${certainty} certainty that the study adds reliable information on ${topic} (Kidhardt P., 2025).`;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalWording).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Assessment Suggestion</h3>
      <p className="text-sm text-gray-600 mb-2">
        Use this auto-generated sentence for your research assessment, paper, or report.
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Analysis may not be perfect. Always consult a human expert.
      </p>


      <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
        <p className="text-sm text-gray-800 font-mono select-all">{finalWording}</p>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={handleCopy}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
};
