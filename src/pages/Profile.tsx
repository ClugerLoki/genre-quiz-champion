import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Trophy, Clock, Target, Star, LogOut } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QuizHistoryItem {
  id: string;
  genre: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: Date;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalTime: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.isGuest) {
      navigate('/genres');
      return;
    }
    setIsVisible(true);

    // Set up real-time listener for quiz history
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(
      leaderboardRef,
      where('userId', '==', user.id),
      orderBy('score', 'desc'),
      orderBy('timeSpent', 'asc'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: QuizHistoryItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          genre: data.genre,
          score: data.score,
          totalQuestions: 5, // Quiz always has 5 questions
          timeSpent: data.timeSpent,
          timestamp: data.timestamp.toDate()
        });
      });

      setQuizHistory(history);

      // Calculate stats
      if (history.length > 0) {
        setStats({
          totalQuizzes: history.length,
          averageScore: Math.round((history.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / history.length) || 0),
          bestScore: Math.max(...history.map(quiz => quiz.score)),
          totalTime: history.reduce((sum, quiz) => sum + quiz.timeSpent, 0)
        });
      }
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user || user.isGuest) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <Link to="/genres">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Genres
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="glass-effect text-white border-white/20 hover:bg-red-500/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Profile Header */}
            <div className="text-center mb-8">
              <Avatar className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600">
                <AvatarFallback className="text-2xl font-bold text-white bg-transparent">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {user.name}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect border-white/10 text-center quiz-card">
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stats.totalQuizzes}</div>
                  <div className="text-white/60 text-sm">Total Quizzes</div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/10 text-center quiz-card">
                <CardContent className="p-6">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stats.averageScore}%</div>
                  <div className="text-white/60 text-sm">Average Score</div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/10 text-center quiz-card">
                <CardContent className="p-6">
                  <Trophy className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stats.bestScore}/5</div>
                  <div className="text-white/60 text-sm">Best Score</div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/10 text-center quiz-card">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{formatTime(stats.totalTime)}</div>
                  <div className="text-white/60 text-sm">Total Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Quiz History */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Quiz History
                </CardTitle>
                <CardDescription className="text-white/60">
                  Your recent quiz attempts and scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizHistory.length > 0 ? (
                  <div className="space-y-4">
                    {quizHistory.map((quiz) => (
                      <div 
                        key={quiz.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            quiz.score === quiz.totalQuestions ? 'bg-green-500' :
                            quiz.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            <span className="text-white font-bold">{quiz.score}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-lg capitalize">{quiz.genre}</div>
                            <div className="text-white/60 text-sm">{formatDate(quiz.timestamp)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-white font-semibold">
                              {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                            </div>
                            <div className="text-white/60 text-sm">
                              {formatTime(quiz.timeSpent)}
                            </div>
                          </div>
                          <Badge 
                            variant={quiz.score === quiz.totalQuestions ? "default" : 
                                   quiz.score >= 3 ? "secondary" : "destructive"}
                          >
                            {quiz.score === quiz.totalQuestions ? 'Perfect' :
                             quiz.score >= 3 ? 'Good' : 'Needs Practice'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Quiz History</h3>
                    <p className="text-white/60 mb-6">
                      Start taking quizzes to see your progress here!
                    </p>
                    <Link to="/genres">
                      <Button className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                        Take Your First Quiz
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/genres">
                <Button className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
                  Take Another Quiz
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button 
                  variant="outline"
                  className="glass-effect text-white border-white/20 hover:bg-white/10 px-8"
                >
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
