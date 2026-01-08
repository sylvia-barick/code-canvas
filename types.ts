
export interface RubricScores {
  visualHierarchy: number;
  clarityOfMessage: number;
  ctaStrength: number;
  layoutConsistency: number;
  aestheticAppeal: number;
}

export interface LandingPageEvaluation {
  scores: RubricScores;
  totalScore: number;
  summary: string;
}

export interface ComparisonResult {
  isValid: boolean;
  validationError?: string;
  imageA?: LandingPageEvaluation;
  imageB?: LandingPageEvaluation;
  overallWinner?: 'A' | 'B' | 'Draw';
  visualDifferences?: string[]; // New: List of specific visual changes identified by AI
}

export interface ImageFile {
  file: File;
  preview: string;
  name: string;
}
