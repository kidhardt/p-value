import React from 'react';
import { Tooltip } from './Tooltip';

interface QuantitativeResultsProps {
  pmi: number;
  grs: number;
}

const RiskBar: React.FC<{ value: number }> = ({ value }) => {
  const percentage = Math.max(0, Math.min(100, value));
  let color = 'bg-green-500';
  if (percentage > 33) color = 'bg-yellow-500';
  if (percentage > 66) color = 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
      <div className={`${color} h-4 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export const QuantitativeResults: React.FC<QuantitativeResultsProps> = ({ pmi, grs }) => {
  // Normalize PMI for the bar display. A score of 30 is considered very high.
  const PMI_MAX_FOR_BAR = 30;
  const pmiPercentage = (pmi / PMI_MAX_FOR_BAR) * 100;

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantitative Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="font-semibold">PMI</span>
              <Tooltip text="P-Value Misuse Index: A cumulative score based on the severity and confidence of detected p-value misuses. Higher scores indicate more significant misuse." />
            </div>
            <span className='font-mono text-2xl font-bold text-indigo-600'>{pmi.toFixed(0)}</span>
          </div>
          <RiskBar value={pmiPercentage} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                  <span className="font-semibold">GRS</span>
                  <Tooltip text="Generalizability Risk Score (0-100): An overall risk assessment. Higher scores indicate a greater risk that the findings won't hold up in new samples due to p-value misuse." />
              </div>
              <span className="font-mono text-2xl font-bold text-indigo-600">{grs.toFixed(0)}</span>
          </div>
          <RiskBar value={grs} />
        </div>
      </div>
    </div>
  );
};