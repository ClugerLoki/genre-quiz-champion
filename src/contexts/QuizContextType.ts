import { createContext } from 'react';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  genre: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
}

export interface QuizContextType {
  currentGenre: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: { questionId: string; selectedAnswer: number }[];
  startTime: number | null;
  endTime: number | null;
  setCurrentGenre: (genre: string) => void;
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  selectAnswer: (questionId: string, answer: number) => void;
  startQuiz: () => void;
  endQuiz: () => QuizResult;
  resetQuiz: () => void;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);