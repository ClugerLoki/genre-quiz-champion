
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  ArrowLeft, 
  User, 
  LogOut, 
  Trophy, 
  Microscope, 
  Clock, 
  Globe, 
  Gamepad2, 
  Music, 
  Palette, 
  Calculator,
  Atom,
  MapPin
} from 'lucide-react';

const genres = [
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, Chemistry, Biology',
    icon: Microscope,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 'history',
    name: 'History',
    description: 'World History & Events',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 'geography',
    name: 'Geography',
    description: 'Countries, Capitals & Maps',
    icon: Globe,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Games, Players & Records',
    icon: Trophy,
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Computing & Innovation',
    icon: Gamepad2,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Artists, Genres & Theory',
    icon: Music,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10'
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Artists, Movements & History',
    icon: Palette,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Numbers, Equations & Logic',
    icon: Calculator,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-500/10'
  }
];

const GenreSelection = () => {
  const { user, logout } = useAuth();
  const { setCurrentGenre } = useQuiz();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsVisible(true);
  }, [user, navigate]);

  const handleGenreSelect = (genreId: string) => {
    setCurrentGenre(genreId);
    navigate(`/instructions/${genreId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

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
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                QuizMaster
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5" />
              <span>{user.name}</span>
              {user.isGuest && <span className="text-xs text-white/60">(Guest)</span>}
            </div>
            <Link to="/leaderboard">
              <Button variant="outline" className="glass-effect text-white border-white/20">
                <Trophy className="mr-2 h-4 w-4" />
                Leaderboard
              </Button>
            </Link>
            {!user.isGuest && (
              <Link to="/profile">
                <Button variant="outline" className="glass-effect text-white border-white/20">
                  Profile
                </Button>
              </Link>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="glass-effect text-white border-white/20 hover:bg-red-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className={`max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Title Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Choose Your Challenge
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Select a genre and test your knowledge with 5 challenging questions
              </p>
            </div>

            {/* Genre Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {genres.map((genre, index) => {
                const IconComponent = genre.icon;
                return (
                  <Card 
                    key={genre.id}
                    className={`glass-effect border-white/10 quiz-card cursor-pointer group hover:border-white/30 transition-all duration-300 ${genre.bgColor} animate-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleGenreSelect(genre.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${genre.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-white group-hover:text-blue-200 transition-colors">
                        {genre.name}
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        {genre.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button 
                        className={`w-full quiz-button bg-gradient-to-r ${genre.color} hover:shadow-lg text-white`}
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center space-x-8 glass-effect px-8 py-4 rounded-full border border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-sm text-white/60">Questions</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-white/60">Time Limit</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">⭐</div>
                  <div className="text-sm text-white/60">Leaderboard</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GenreSelection;
