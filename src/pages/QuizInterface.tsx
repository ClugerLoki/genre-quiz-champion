import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useQuiz } from '@/hooks/use-quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, CheckCircle, Trophy, RotateCcw, X, ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;  // Changed from 'correct' to 'isCorrect' to match the context
  }>;
}

const QuizInterface = () => {
  const { genre } = useParams<{ genre: string }>();
  const { user } = useAuth();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    startTime,
    selectAnswer, 
    nextQuestion, 
    previousQuestion, 
    startQuiz, 
    endQuiz,
    resetQuiz
  } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!genre) {
      navigate('/genres');
      return;
    }

    if (questions.length === 0) {
      navigate(`/instructions/${genre}`);
      return;
    }

    // Start the quiz when component mounts
    if (!startTime) {
      startQuiz();
    }
  }, [user, genre, questions, startTime, navigate, startQuiz]);

  // Timer effect
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Update selected answer when question changes
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
      setSelectedAnswer(existingAnswer ? existingAnswer.selectedAnswer : null);
    }
  }, [currentQuestionIndex, answers, questions]);

  const handleQuizComplete = async () => {
    const result = endQuiz();
    setQuizResult(result);
    setShowResults(true);
    
    // Save or update result in Firebase (upsert logic)
    try {
      const leaderboardRef = collection(db, 'leaderboard');
      
      // For guest users, always create a new entry with timestamp-based ID
      if (user?.isGuest) {
        const guestId = `guest_${user.id}_${Date.now()}`;
        await setDoc(doc(leaderboardRef, guestId), {
          userId: user.id,
          name: user.name,
          score: result.score,
          totalQuestions: result.totalQuestions,
          timeSpent: result.timeSpent,
          genre: genre?.toLowerCase(),
          isGuest: true,
          timestamp: serverTimestamp(),
          answers: result.answers.map(a => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect
          }))
        });
      } else {
        // For authenticated users, check for existing entry and update if better
        const q = query(
          leaderboardRef,
          where('userId', '==', user?.id),
          where('genre', '==', genre?.toLowerCase()),
          where('isGuest', '==', false)
        );
        const querySnapshot = await getDocs(q);
        let shouldUpdate = false;
        let docId = null;
        let prevScore = -1;
        let prevTime = Number.MAX_SAFE_INTEGER;
        
        querySnapshot.forEach((docSnap) => {
          shouldUpdate = true;
          docId = docSnap.id;
          prevScore = docSnap.data().score;
          prevTime = docSnap.data().timeSpent;
        });
        
        // Only update if new score is higher, or if score is equal and time is better
        if (shouldUpdate && docId !== null) {
          if (
            result.score > prevScore ||
            (result.score === prevScore && result.timeSpent < prevTime)
          ) {
            await updateDoc(doc(leaderboardRef, docId), {
              score: result.score,
              totalQuestions: result.totalQuestions,
              timeSpent: result.timeSpent,
              timestamp: serverTimestamp(),
              answers: result.answers.map(a => ({
                questionId: a.questionId,
                selectedAnswer: a.selectedAnswer,
                isCorrect: a.isCorrect
              }))
            });
            toast({
              title: "New Best Score!",
              description: `Improved your score to ${result.score}/${result.totalQuestions}!`,
            });
          } else {
            toast({
              title: "Quiz Completed!",
              description: `You scored ${result.score}/${result.totalQuestions}. Your best is still ${prevScore}/${result.totalQuestions}.`,
            });
          }
        } else {
          // No previous entry, create new
          await addDoc(leaderboardRef, {
            userId: user?.id,
            name: user?.name,
            score: result.score,
            totalQuestions: result.totalQuestions,
            timeSpent: result.timeSpent,
            genre: genre?.toLowerCase(),
            isGuest: false,
            timestamp: serverTimestamp(),
            answers: result.answers.map(a => ({
              questionId: a.questionId,
              selectedAnswer: a.selectedAnswer,
              isCorrect: a.isCorrect
            }))
          });
          toast({
            title: "First Quiz Completed!",
            description: `Great start with ${result.score}/${result.totalQuestions} correct answers!`,
          });
        }
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast({
        title: "Error",
        description: "Failed to save your score. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    selectAnswer(currentQuestion.id, answer);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    }
  };

  const handleSubmit = () => {
    handleQuizComplete();
  };

  const handleExitQuiz = () => {
    resetQuiz();
    navigate('/genres');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goToLeaderboard = () => {
    resetQuiz();
    navigate('/leaderboard');
  };

  const retakeQuiz = () => {
    resetQuiz();
    navigate(`/instructions/${genre}`);
  };

  if (!user || !questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                {genre?.charAt(0).toUpperCase() + genre?.slice(1)} Quiz
              </h1>
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white/80">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExitQuiz}
                className="glass-effect text-white border-white/20 hover:bg-red-500/20"
              >
                <X className="h-4 w-4 mr-2" />
                Exit Quiz
              </Button>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>
        </div>

        {/* Question Card */}
        <main className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-effect border-white/10 animate-slide-up">
              <CardHeader>
                <CardTitle className="text-white text-xl md:text-2xl">
                  {currentQuestion?.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full text-left p-6 h-auto glass-effect border-white/20 text-white hover:bg-white/10 transition-all duration-300 ${
                      selectedAnswer === index 
                        ? 'bg-blue-500/30 border-blue-400 shadow-lg' 
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                        selectedAnswer === index
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : 'border-white/40 text-white/60'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base">{option}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="glass-effect text-white border-white/20 hover:bg-white/10"
              >
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      answers.find(a => a.questionId === questions[index]?.id)
                        ? 'bg-green-400' 
                        : index === currentQuestionIndex 
                        ? 'bg-blue-400' 
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="quiz-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Next
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="glass-effect border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-400" />
              Quiz Completed!
            </DialogTitle>
            <DialogDescription className="text-white/80 text-center">
              Thank you for participating in the quiz
            </DialogDescription>
          </DialogHeader>
          
          {quizResult && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {quizResult.score}/{quizResult.totalQuestions}
                </div>
                <p className="text-white/80">Correct Answers</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-white">
                    {formatTime(quizResult.timeSpent)}
                  </div>
                  <p className="text-white/60 text-sm">Time Taken</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-white">
                    {Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%
                  </div>
                  <p className="text-white/60 text-sm">Accuracy</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={goToLeaderboard}
                  className="flex-1 quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
                <Button 
                  onClick={retakeQuiz}
                  variant="outline"
                  className="flex-1 glass-effect text-white border-white/20 hover:bg-white/10"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizInterface;
