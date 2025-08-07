import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useQuiz } from '@/hooks/use-quiz';
import { useFirebaseGenres } from '@/hooks/useFirebaseData';
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
  MapPin,
  Loader2,
  AlertCircle,
  BookOpen,
  Play,
  Scroll,
  Laptop
} from 'lucide-react';
import { migrateDataToFirebase } from '@/utils/dataMigration';

// Icon mapping for genres
const iconMap: Record<string, React.ComponentType<any>> = {
  'Atom': Atom,
  'Scroll': Scroll,
  'Globe': Globe,
  'Trophy': Trophy,
  'Laptop': Laptop,
  'Music': Music,
  'Palette': Palette,
  'Calculator': Calculator
};

const GenreSelection = () => {
  const { user, logout } = useAuth();
  const { setCurrentGenre } = useQuiz();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>('');
  
  const { genres: firebaseGenres, loading: genresLoading, error: genresError } = useFirebaseGenres();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsVisible(true);
  }, [user, navigate]);

  useEffect(() => {
    const handleDataSetup = async () => {
      if (genresLoading) return;
      
      if (genresError || firebaseGenres.length === 0) {
        console.log('No genres found in Firebase, attempting migration...');
        setMigrationStatus('Setting up quiz data...');
        
        const result = await migrateDataToFirebase();
        if (result.success) {
          setMigrationStatus('Setup completed! Refreshing page...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setMigrationStatus('Setup failed. Please refresh the page.');
        }
      }
    };

    handleDataSetup();
  }, [firebaseGenres, genresLoading, genresError]);

  const handleGenreSelect = (genreId: string) => {
    setCurrentGenre(genreId);
    navigate(`/instructions/${genreId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  if (genresLoading || migrationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">{migrationStatus || 'Loading quiz genres...'}</p>
        </div>
      </div>
    );
  }

  if (genresError || firebaseGenres.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-400" />
          <p className="text-lg mb-4">Failed to load quiz genres</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
              {firebaseGenres.map((genre, index) => {
                const IconComponent = iconMap[genre.icon] || BookOpen;
                return (
                  <Card 
                    key={genre.id}
                    className={`glass-effect border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                      isVisible ? `animate-slide-up` : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${genre.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`h-8 w-8 ${genre.color}`} />
                      </div>
                      <CardTitle className="text-white text-xl">{genre.name}</CardTitle>
                      <CardDescription className="text-white/60">
                        {genre.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleGenreSelect(genre.id)}
                          className={`flex-1 quiz-button bg-gradient-to-r ${genre.bgColor} hover:opacity-90 text-white border-0`}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Quiz
                        </Button>
                        <Link to={`/learn/${genre.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full glass-effect text-white border-white/30 hover:bg-white/10"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Learn
                          </Button>
                        </Link>
                      </div>
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