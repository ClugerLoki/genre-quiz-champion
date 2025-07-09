
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QuizProvider } from "./contexts/QuizContext";
import Index from "./pages/Index";
import Authentication from "./pages/Authentication";
import GenreSelection from "./pages/GenreSelection";
import QuizInstructions from "./pages/QuizInstructions";
import QuizInterface from "./pages/QuizInterface";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <QuizProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Authentication />} />
              <Route path="/genres" element={<GenreSelection />} />
              <Route path="/instructions/:genre" element={<QuizInstructions />} />
              <Route path="/quiz/:genre" element={<QuizInterface />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QuizProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
