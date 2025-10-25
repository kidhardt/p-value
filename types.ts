export type InputMode = 'url' | 'file' | 'text';

export interface Violation {
  principle: string;
  quote: string;
  explanation: string;
  severity: number;
  confidence: number;
}

export interface AssessmentWording {
  certainty: string; // e.g., "very high", "high", "low", "very low"
  topic: string; // The main topic of the study, e.g., "the effects of caffeine on memory"
}

export interface AssessmentResult {
  overallSummary: string;
  violations: Violation[];
  pmi: number;
  grs: number;
  assessmentWording: AssessmentWording;
}