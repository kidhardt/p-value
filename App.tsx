import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultDisplay } from './components/ResultDisplay';
import { QuantitativeResults } from './components/QuantitativeResults';
import { ResearchAssessmentWording } from './components/CitationHelper';
import { assessText, assessUrl } from './services/geminiService';
import { InputMode, AssessmentResult } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssess = useCallback(async (mode: InputMode, value: string) => {
    if (!value) {
      setError("Please provide a URL, a file, or paste text to assess.");
      return;
    }

    setIsLoading(true);
    setAssessment(null);
    setError(null);

    try {
      let result: AssessmentResult;
      if (mode === 'url') {
        result = await assessUrl(value);
      } else {
        result = await assessText(value);
      }
      setAssessment(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get assessment. ${errorMessage}. Please check your API key, network connection, and ensure the model is returning valid JSON.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="space-y-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 space-y-8">
            <InputArea onAssess={handleAssess} isLoading={isLoading} />
            {assessment && <QuantitativeResults pmi={assessment.pmi} grs={assessment.grs} />}
            <ResultDisplay isLoading={isLoading} assessment={assessment} error={error} />
            {assessment && !error && <ResearchAssessmentWording assessment={assessment} />}
          </div>
        </div>
        <footer className="text-center text-sm text-gray-400 mt-8">
          <p>Powered by Google Gemini. Analysis may not be perfect. Always consult a human expert.</p>
          <p>&copy; 2024 P-Value Misuse Assessor</p>
        </footer>
      </main>
    </div>
  );
};

export default App;