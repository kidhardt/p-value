import React from 'react';
import { Spinner } from './Spinner';
import { AssessmentResult, Violation } from '../types';

interface ResultDisplayProps {
  isLoading: boolean;
  assessment: AssessmentResult | null;
  error: string | null;
}

const SeverityBadge: React.FC<{ level: number }> = ({ level }) => {
  const config = {
    1: { text: 'Minor', color: 'bg-green-100 text-green-800' },
    2: { text: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
    3: { text: 'Severe', color: 'bg-red-100 text-red-800' },
  }[level] || { text: 'N/A', color: 'bg-gray-100 text-gray-800' };

  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>;
};

const ConfidenceBadge: React.FC<{ level: number }> = ({ level }) => {
    const config = {
      1: { text: 'Low', color: 'bg-gray-100 text-gray-800' },
      2: { text: 'Medium', color: 'bg-blue-100 text-blue-800' },
      3: { text: 'High', color: 'bg-indigo-100 text-indigo-800' },
    }[level] || { text: 'N/A', color: 'bg-gray-100 text-gray-800' };
  
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>;
  };


const ViolationCard: React.FC<{ violation: Violation }> = ({ violation }) => (
  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <h4 className="font-semibold text-gray-800">Principle Violated:</h4>
      <p className="text-sm text-gray-600 flex-1">{violation.principle}</p>
    </div>
    <div className="flex items-center gap-4">
        <div>
            <span className="text-xs text-gray-500 mr-2">Severity:</span>
            <SeverityBadge level={violation.severity} />
        </div>
        <div>
            <span className="text-xs text-gray-500 mr-2">Confidence:</span>
            <ConfidenceBadge level={violation.confidence} />
        </div>
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 text-sm mb-1">Quote from Text:</h4>
      <blockquote className="border-l-4 border-indigo-200 pl-4 py-1 text-gray-700 bg-indigo-50 rounded-r-md">
        <p className="italic">"{violation.quote}"</p>
      </blockquote>
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 text-sm mb-1">Explanation:</h4>
      <p className="text-gray-600 text-sm">{violation.explanation}</p>
    </div>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, assessment, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <Spinner className="text-indigo-500 h-8 w-8" />
        <p className="mt-4 text-lg">Analyzing content... This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <h3 className="font-bold">An Error Occurred</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-lg">Your assessment results will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Summary</h2>
        <p className="text-gray-600">{assessment.overallSummary}</p>
      </div>

      {assessment.violations && assessment.violations.length > 0 ? (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Potential Violations of ASA Principles</h3>
            {assessment.violations.map((v, index) => (
                <ViolationCard key={index} violation={v} />
            ))}
        </div>
      ) : (
        <div className="p-6 text-center text-green-700 bg-green-50 border-2 border-dashed border-green-200 rounded-lg">
            <p className="font-semibold">No potential violations of the ASA principles were detected.</p>
        </div>
      )}
    </div>
  );
};