import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Users, BookOpen, List } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  genre: string;
}

interface Genre {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form states
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    genre: ''
  });

  const [newGenre, setNewGenre] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
    bgColor: ''
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    console.log('Checking admin access for user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (!user.email) {
      console.log('User has no email, redirecting to auth');
      navigate('/auth');
      return;
    }

    try {
      console.log('Querying users collection for email:', user.email);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      console.log('Query results - empty:', querySnapshot.empty, 'size:', querySnapshot.size);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log('User data from Firebase:', userData);
        console.log('isAdmin value:', userData.isAdmin, 'type:', typeof userData.isAdmin);
        
        if (userData.isAdmin === true) {
          console.log('Admin access granted');
          setIsAdmin(true);
          loadData();
        } else {
          console.log('User is not admin, isAdmin value:', userData.isAdmin);
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive"
          });
          navigate('/');
        }
      } else {
        console.log('User email not found in users collection');
        toast({
          title: "Access Denied",
          description: "Your email is not in the admin list.",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load questions
      const questionsSnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Question[];
      setQuestions(questionsData);

      // Load genres
      const genresSnapshot = await getDocs(collection(db, 'genres'));
      const genresData = genresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Genre[];
      setGenres(genresData);

      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive"
      });
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.question || !newQuestion.genre || newQuestion.options.some(opt => !opt)) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, 'questions'), newQuestion);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        genre: ''
      });
      loadData();
      toast({
        title: "Success",
        description: "Question added successfully."
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question.",
        variant: "destructive"
      });
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      await deleteDoc(doc(db, 'questions', questionId));
      loadData();
      toast({
        title: "Success",
        description: "Question deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question.",
        variant: "destructive"
      });
    }
  };

  const addGenre = async () => {
    if (!newGenre.name || !newGenre.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, 'genres'), newGenre);
      setNewGenre({
        name: '',
        description: '',
        icon: '',
        color: '',
        bgColor: ''
      });
      loadData();
      toast({
        title: "Success",
        description: "Genre added successfully."
      });
    } catch (error) {
      console.error('Error adding genre:', error);
      toast({
        title: "Error",
        description: "Failed to add genre.",
        variant: "destructive"
      });
    }
  };

  const deleteGenre = async (genreId: string) => {
    try {
      await deleteDoc(doc(db, 'genres', genreId));
      loadData();
      toast({
        title: "Success",
        description: "Genre deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting genre:', error);
      toast({
        title: "Error",
        description: "Failed to delete genre.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <List size={16} />
              Questions
            </TabsTrigger>
            <TabsTrigger value="add-question" className="flex items-center gap-2">
              <Plus size={16} />
              Add Question
            </TabsTrigger>
            <TabsTrigger value="genres" className="flex items-center gap-2">
              <BookOpen size={16} />
              Genres
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Manage Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Correct Answer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="max-w-md truncate">{question.question}</TableCell>
                        <TableCell>{question.genre}</TableCell>
                        <TableCell>{question.options[question.correctAnswer]}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-question">
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    placeholder="Enter the question"
                  />
                </div>

                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <select
                    id="genre"
                    value={newQuestion.genre}
                    onChange={(e) => setNewQuestion({...newQuestion, genre: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.name.toLowerCase()}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {newQuestion.options.map((option, index) => (
                  <div key={index}>
                    <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                    <Input
                      id={`option-${index}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({...newQuestion, options: newOptions});
                      }}
                      placeholder={`Enter option ${index + 1}`}
                    />
                  </div>
                ))}

                <div>
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <select
                    id="correct-answer"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-md"
                  >
                    {newQuestion.options.map((_, index) => (
                      <option key={index} value={index}>
                        Option {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    placeholder="Enter explanation for the correct answer"
                  />
                </div>

                <Button onClick={addQuestion} className="w-full">
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genres">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Genre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="genre-name">Name</Label>
                    <Input
                      id="genre-name"
                      value={newGenre.name}
                      onChange={(e) => setNewGenre({...newGenre, name: e.target.value})}
                      placeholder="Enter genre name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre-description">Description</Label>
                    <Textarea
                      id="genre-description"
                      value={newGenre.description}
                      onChange={(e) => setNewGenre({...newGenre, description: e.target.value})}
                      placeholder="Enter genre description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre-icon">Icon</Label>
                    <Input
                      id="genre-icon"
                      value={newGenre.icon}
                      onChange={(e) => setNewGenre({...newGenre, icon: e.target.value})}
                      placeholder="Enter icon name (e.g., Beaker)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre-color">Color</Label>
                    <Input
                      id="genre-color"
                      value={newGenre.color}
                      onChange={(e) => setNewGenre({...newGenre, color: e.target.value})}
                      placeholder="Enter color class (e.g., text-blue-600)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre-bg-color">Background Color</Label>
                    <Input
                      id="genre-bg-color"
                      value={newGenre.bgColor}
                      onChange={(e) => setNewGenre({...newGenre, bgColor: e.target.value})}
                      placeholder="Enter bg color class (e.g., bg-blue-100)"
                    />
                  </div>

                  <Button onClick={addGenre} className="w-full">
                    Add Genre
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <div key={genre.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{genre.name}</h3>
                          <p className="text-sm text-muted-foreground">{genre.description}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteGenre(genre.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Admin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;