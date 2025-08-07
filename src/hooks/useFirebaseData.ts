import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Question } from '@/contexts/QuizContextType';

interface Genre {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const useFirebaseQuestions = (genre?: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const questionsRef = collection(db, 'questions');
        let snapshot;
        
        if (genre) {
          const q = query(questionsRef, where('genre', '==', genre));
          snapshot = await getDocs(q);
        } else {
          snapshot = await getDocs(questionsRef);
        }
        const questionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];
        
        console.log(`Loaded ${questionsData.length} questions for genre: ${genre || 'all'}`);
        setQuestions(questionsData);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [genre]);

  return { questions, loading, error };
};

export const useFirebaseGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const genresRef = collection(db, 'genres');
        const snapshot = await getDocs(genresRef);
        const genresData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Genre[];
        
        console.log(`Loaded ${genresData.length} genres from Firebase`);
        setGenres(genresData);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};