import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useQuiz } from '@/hooks/use-quiz';
import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/data/quizQuestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Clock, Target, Trophy, AlertCircle, CheckCircle } from 'lucide-react';

const QuizInstructions = () => {
  const { genre } = useParams<{ genre: string }>();
  const { user } = useAuth();
  const { setQuestions, setCurrentGenre } = useQuiz();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!genre) {
      navigate('/genres');
      return;
    }

    // Set current genre and prepare real questions
    setCurrentGenre(genre);
    
    // Get real questions for the selected genre
    const genreQuestions = quizQuestions[genre] || [];
    setQuestions(genreQuestions);
    
    setTimeout(() => setIsReady(true), 500);
  }, [user, genre, navigate, setCurrentGenre, setQuestions]);

  const startQuiz = () => {
    navigate(`/quiz/${genre}`);
  };

  const genreDisplayName = genre?.charAt(0).toUpperCase() + genre?.slice(1) || 'Quiz';

  if (!user || !genre) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6 flex items-center">
          <Link to="/genres">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Genres
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className={`max-w-2xl mx-auto transition-all duration-1000 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {genreDisplayName} Quiz
              </h1>
              <p className="text-xl text-white/80">
                Ready to test your knowledge? Here's what you need to know.
              </p>
            </div>

            {/* Instructions Card */}
            <Card className="glass-effect border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-blue-400" />
                  Quiz Instructions
                </CardTitle>
                <CardDescription className="text-white/60">
                  Please read carefully before starting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">5 Questions</h3>
                      <p className="text-white/60 text-sm">Each quiz contains exactly 5 questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">No Time Limit</h3>
                      <p className="text-white/60 text-sm">Take your time, but we track total time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Multiple Choice</h3>
                      <p className="text-white/60 text-sm">Select the best answer from 4 options</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Trophy className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">Leaderboard</h3>
                      <p className="text-white/60 text-sm">Your score will be added to the leaderboard</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2">Scoring System</h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Each correct answer: 1 point</li>
                    <li>• Total possible score: 5 points</li>
                    <li>• Faster completion time gives you better ranking</li>
                    <li>• Results are saved to your profile</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Start Button */}
            <div className="text-center">
              <Button 
                onClick={startQuiz}
                size="lg"
                className="quiz-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-4 text-lg font-semibold shadow-2xl animate-pulse-glow"
              >
                <Play className="mr-2 h-5 w-5" />
                Start {genreDisplayName} Quiz
              </Button>
              
              <p className="mt-4 text-white/60 text-sm">
                Click the button above when you're ready to begin
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizInstructions;
