import { useContext } from 'react';
import { QuizContext } from '@/contexts/QuizContextType';

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};