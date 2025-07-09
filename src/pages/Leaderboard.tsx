
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal, Award, Crown, Clock, Target } from 'lucide-react';
import { ReactNode } from 'react';

// Sample leaderboard data - replace with Firebase data later
const sampleLeaderboard = {
  science: [
    { id: '1', name: 'Alice Johnson', score: 5, timeSpent: 120, isGuest: false },
    { id: '2', name: 'Bob Smith', score: 4, timeSpent: 95, isGuest: true },
    { id: '3', name: 'Charlie Brown', score: 4, timeSpent: 110, isGuest: false },
    { id: '4', name: 'Diana Prince', score: 3, timeSpent: 85, isGuest: false },
    { id: '5', name: 'Eve Wilson', score: 3, timeSpent: 140, isGuest: true },
  ],
  history: [
    { id: '1', name: 'Frank Miller', score: 5, timeSpent: 98, isGuest: false },
    { id: '2', name: 'Grace Lee', score: 4, timeSpent: 102, isGuest: false },
    { id: '3', name: 'Guest123', score: 4, timeSpent: 115, isGuest: true },
  ],
  geography: [
    { id: '1', name: 'Henry Davis', score: 5, timeSpent: 88, isGuest: false },
    { id: '2', name: 'Ivy Chen', score: 4, timeSpent: 92, isGuest: false },
  ],
  sports: [
    { id: '1', name: 'Jack Wilson', score: 5, timeSpent: 105, isGuest: true },
    { id: '2', name: 'Kate Brown', score: 4, timeSpent: 118, isGuest: false },
  ]
};

const genres = [
  { id: 'all', name: 'All Genres' },
  { id: 'science', name: 'Science' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' },
  { id: 'music', name: 'Music' },
  { id: 'art', name: 'Art' },
  { id: 'mathematics', name: 'Mathematics' },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRankIcon = (rank: number): ReactNode => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-white/60 font-semibold">{rank}</span>;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentLeaderboard = () => {
    if (selectedGenre === 'all') {
      // Combine all leaderboards and sort by score and time
      const combined = Object.entries(sampleLeaderboard).flatMap(([genre, entries]) =>
        entries.map(entry => ({ ...entry, genre }))
      );
      return combined
        .sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent)
        .slice(0, 10);
    }
    return sampleLeaderboard[selectedGenre as keyof typeof sampleLeaderboard] || [];
  };

  const leaderboard = getCurrentLeaderboard();

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
            <Link to={user ? "/genres" : "/"}>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {user ? 'Back to Genres' : 'Home'}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white/80">Welcome, {user.name}!</span>
              <Link to="/genres">
                <Button className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Take Quiz
                </Button>
              </Link>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Hall of Fame
              </h1>
              <p className="text-xl text-white/80">
                Top performers across all quiz categories
              </p>
            </div>

            {/* Genre Tabs */}
            <Tabs value={selectedGenre} onValueChange={setSelectedGenre} className="mb-8">
              <TabsList className="glass-effect border-white/10 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1 p-1">
                {genres.map((genre) => (
                  <TabsTrigger 
                    key={genre.id}
                    value={genre.id}
                    className="text-white data-[state=active]:bg-white/20 text-xs md:text-sm"
                  >
                    {genre.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Leaderboard Content */}
              <TabsContent value={selectedGenre} className="space-y-4">
                {leaderboard.length > 0 ? (
                  <>
                    {/* Top 3 Podium */}
                    {leaderboard.slice(0, 3).length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {leaderboard.slice(0, 3).map((player, index) => (
                          <Card 
                            key={player.id}
                            className={`glass-effect border-white/10 text-center quiz-card ${
                              index === 0 ? 'md:order-2 bg-gradient-to-b from-yellow-500/10 to-transparent' :
                              index === 1 ? 'md:order-1 bg-gradient-to-b from-gray-400/10 to-transparent' :
                              'md:order-3 bg-gradient-to-b from-amber-600/10 to-transparent'
                            }`}
                          >
                            <CardHeader className="pb-4">
                              <div className="flex justify-center mb-2">
                                {getRankIcon(index + 1)}
                              </div>
                              <CardTitle className="text-white text-lg">
                                {player.name}
                                {player.isGuest && <Badge variant="secondary" className="ml-2 text-xs">Guest</Badge>}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="text-2xl font-bold text-white">
                                  {player.score}/5
                                </div>
                                <div className="flex items-center justify-center space-x-2 text-white/60">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatTime(player.timeSpent)}</span>
                                </div>
                                {selectedGenre === 'all' && 'genre' in player && (
                                  <Badge variant="outline" className="text-white border-white/20">
                                    {String(player.genre)}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Rest of Leaderboard */}
                    {leaderboard.length > 3 && (
                      <Card className="glass-effect border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Target className="mr-2 h-5 w-5" />
                            All Rankings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {leaderboard.slice(3).map((player, index) => (
                              <div 
                                key={player.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-white/60 font-semibold">{index + 4}</span>
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">
                                      {player.name}
                                      {player.isGuest && <Badge variant="secondary" className="ml-2 text-xs">Guest</Badge>}
                                    </div>
                                    {selectedGenre === 'all' && 'genre' in player && (
                                      <div className="text-white/60 text-sm capitalize">{String(player.genre)}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                  <div className="text-right">
                                    <div className="text-white font-semibold">{player.score}/5</div>
                                    <div className="text-white/60 text-sm">{formatTime(player.timeSpent)}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="glass-effect border-white/10">
                    <CardContent className="text-center py-12">
                      <Trophy className="h-16 w-16 text-white/40 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
                      <p className="text-white/60 mb-6">
                        Be the first to complete a quiz in this category!
                      </p>
                      {user && (
                        <Link to="/genres">
                          <Button className="quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                            Start Quiz
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
