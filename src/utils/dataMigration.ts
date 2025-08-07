import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { quizQuestions } from '@/data/quizQuestions';

// Genre data from GenreSelection component
const genresData = [
  {
    id: 'science',
    name: 'Science',
    description: 'Test your knowledge of physics, chemistry, biology, and general scientific concepts',
    icon: 'Atom',
    color: 'text-blue-300',
    bgColor: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'history',
    name: 'History',
    description: 'Explore major historical events, figures, and civilizations throughout time',
    icon: 'Scroll',
    color: 'text-amber-300',
    bgColor: 'from-amber-600 to-orange-600'
  },
  {
    id: 'geography',
    name: 'Geography',
    description: 'Discover world capitals, landmarks, countries, and geographical features',
    icon: 'Globe',
    color: 'text-green-300',
    bgColor: 'from-green-600 to-emerald-600'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Challenge yourself with sports trivia, rules, and famous athletes',
    icon: 'Trophy',
    color: 'text-red-300',
    bgColor: 'from-red-600 to-rose-600'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Stay up to date with tech trends, programming, and digital innovations',
    icon: 'Laptop',
    color: 'text-purple-300',
    bgColor: 'from-purple-600 to-violet-600'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Test your musical knowledge with questions about artists, genres, and theory',
    icon: 'Music',
    color: 'text-pink-300',
    bgColor: 'from-pink-600 to-fuchsia-600'
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Explore famous artworks, artists, and art movements throughout history',
    icon: 'Palette',
    color: 'text-indigo-300',
    bgColor: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Challenge your math skills with algebra, geometry, and problem-solving',
    icon: 'Calculator',
    color: 'text-teal-300',
    bgColor: 'from-teal-600 to-cyan-600'
  }
];

export const migrateDataToFirebase = async () => {
  console.log('Starting data migration to Firebase...');
  
  try {
    // Check if data already exists
    const questionsSnapshot = await getDocs(collection(db, 'questions'));
    const genresSnapshot = await getDocs(collection(db, 'genres'));
    
    if (questionsSnapshot.size > 0 && genresSnapshot.size > 0) {
      console.log('Data already exists in Firebase. Skipping migration.');
      return { success: true, message: 'Data already exists' };
    }

    // Migrate genres first
    console.log('Migrating genres...');
    for (const genre of genresData) {
      await setDoc(doc(db, 'genres', genre.id), genre);
      console.log(`Added genre: ${genre.name}`);
    }

    // Migrate questions
    console.log('Migrating questions...');
    let totalQuestions = 0;
    
    for (const [genreName, questions] of Object.entries(quizQuestions)) {
      for (const question of questions) {
        const questionData = {
          ...question,
          genre: genreName
        };
        
        await addDoc(collection(db, 'questions'), questionData);
        totalQuestions++;
      }
      console.log(`Added ${questions.length} questions for ${genreName}`);
    }

    console.log(`Migration completed! Added ${genresData.length} genres and ${totalQuestions} questions.`);
    return { 
      success: true, 
      message: `Successfully migrated ${genresData.length} genres and ${totalQuestions} questions` 
    };
    
  } catch (error) {
    console.error('Error during migration:', error);
    return { success: false, message: 'Migration failed', error };
  }
};

export const checkFirebaseData = async () => {
  try {
    const questionsSnapshot = await getDocs(collection(db, 'questions'));
    const genresSnapshot = await getDocs(collection(db, 'genres'));
    
    console.log('Firebase Data Check:');
    console.log(`Questions in Firebase: ${questionsSnapshot.size}`);
    console.log(`Genres in Firebase: ${genresSnapshot.size}`);
    
    return {
      questions: questionsSnapshot.size,
      genres: genresSnapshot.size
    };
  } catch (error) {
    console.error('Error checking Firebase data:', error);
    return { error };
  }
};