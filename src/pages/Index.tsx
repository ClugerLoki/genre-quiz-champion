
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Trophy, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QuizMaster
            </span>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white/80">Welcome, {user.name}!</span>
              <Link to="/profile">
                <Button variant="outline" className="glass-effect text-white border-white/20">
                  Profile
                </Button>
              </Link>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Challenge Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Knowledge
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                Test your skills across multiple genres, compete with others,
                <br />
                and climb the leaderboard in real-time!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="glass-effect border-white/10 quiz-card">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Multiple Genres</h3>
                  <p className="text-white/60">Science, History, Sports & more</p>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 quiz-card">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Live Leaderboard</h3>
                  <p className="text-white/60">Compete in real-time</p>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 quiz-card">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Timed Challenges</h3>
                  <p className="text-white/60">Beat the clock!</p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/genres">
                  <Button 
                    size="lg" 
                    className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Quiz
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              <Link to="/leaderboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="quiz-button glass-effect text-white border-white/20 hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-white/60">
            Built with React, Vite & Firebase • © 2024 QuizMaster
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
