import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Brain,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const genreTopics: Record<string, string> = {
  science: 'Science (Physics, Chemistry, Biology)',
  history: 'World History and Historical Events',
  geography: 'Geography, Countries, and Capitals',
  sports: 'Sports, Games, and Athletes',
  technology: 'Technology and Computing',
  music: 'Music, Artists, and Musical Theory',
  art: 'Art, Artists, and Art History',
  mathematics: 'Mathematics and Mathematical Concepts'
};

const AILearning = () => {
  const { genre } = useParams<{ genre: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!genre || !genreTopics[genre]) {
      navigate('/genres');
      return;
    }

    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: `Welcome to AI Learning for ${genreTopics[genre]}! I'm here to help you learn about this topic. Ask me anything you'd like to know, and I'll provide detailed explanations and insights. What would you like to learn about?`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user, genre, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (message: string) => {
    const API_KEY = 'AIzaSyC-JxrelJKFnGWEx6w8QB4qLezHNKTw9Os';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert teacher in ${genreTopics[genre!]}. Please provide a detailed, educational response to this question: ${message}. Make your response engaging, informative, and easy to understand. Include examples where relevant.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Sorry, I encountered an error. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user || !genre || !genreTopics[genre]) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center space-x-4">
            <Link to="/genres">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Genres
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Learning
              </span>
            </div>
          </div>
          
          <div className="text-white">
            <h2 className="text-lg font-semibold">{genreTopics[genre]}</h2>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
          <Card className="flex-1 glass-effect border-white/10 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                AI Learning Assistant
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {!message.isUser && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                          {message.isUser && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about this topic..."
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/60"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AILearning;