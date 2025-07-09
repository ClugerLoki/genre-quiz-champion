
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResult {
  genre: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
}

interface QuizContextType {
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

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: number }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const selectAnswer = (questionId: string, answer: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, selectedAnswer: answer }
            : a
        );
      }
      return [...prev, { questionId, selectedAnswer: answer }];
    });
  };

  const startQuiz = () => {
    setStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const endQuiz = (): QuizResult => {
    const endTime = Date.now();
    setEndTime(endTime);
    
    const timeSpent = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    
    const resultAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correct: question ? question.correctAnswer === answer.selectedAnswer : false
      };
    });
    
    const score = resultAnswers.filter(a => a.correct).length;
    
    return {
      genre: currentGenre || '',
      score,
      totalQuestions: questions.length,
      timeSpent,
      answers: resultAnswers
    };
  };

  const resetQuiz = () => {
    setCurrentGenre(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <QuizContext.Provider value={{
      currentGenre,
      questions,
      currentQuestionIndex,
      answers,
      startTime,
      endTime,
      setCurrentGenre,
      setQuestions,
      nextQuestion,
      previousQuestion,
      selectAnswer,
      startQuiz,
      endQuiz,
      resetQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};
