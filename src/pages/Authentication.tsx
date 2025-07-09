
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Brain, ArrowLeft, User, Mail, Lock, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Authentication = () => {
  const navigate = useNavigate();
  const { login, register, guestLogin, loading } = useAuth();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [guestName, setGuestName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate('/genres');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerData.name, registerData.email, registerData.password);
      toast({
        title: "Account created!",
        description: "Welcome to QuizMaster!",
      });
      navigate('/genres');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again with different details.",
        variant: "destructive"
      });
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      guestLogin(guestName.trim());
      toast({
        title: "Welcome, guest!",
        description: `Logged in as ${guestName}`,
      });
      navigate('/genres');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-2 ml-6">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QuizMaster
            </span>
          </div>
        </header>

        {/* Authentication Content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md animate-slide-up">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-effect border-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Card className="glass-effect border-white/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white flex items-center justify-center">
                      <Mail className="mr-2 h-5 w-5" />
                      Login to Continue
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="glass-effect border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="glass-effect border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        disabled={loading}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Card className="glass-effect border-white/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white flex items-center justify-center">
                      <UserCheck className="mr-2 h-5 w-5" />
                      Create Account
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Join QuizMaster and start your journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                          className="glass-effect border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email" className="text-white">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="Enter your email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          className="glass-effect border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-white">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="glass-effect border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full quiz-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        disabled={loading}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Guest Login Section */}
            <Card className="mt-6 glass-effect border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-white flex items-center justify-center">
                  <User className="mr-2 h-5 w-5" />
                  Continue as Guest
                </CardTitle>
                <CardDescription className="text-white/60">
                  No account needed, just enter your name
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGuestLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest-name" className="text-white">Your Name</Label>
                    <Input
                      id="guest-name"
                      type="text"
                      placeholder="Enter your name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="glass-effect border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="outline"
                    className="w-full quiz-button glass-effect text-white border-white/20 hover:bg-white/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Continue as Guest
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Authentication;
