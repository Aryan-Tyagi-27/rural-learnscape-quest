import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, XCircle, Trophy, BookOpen } from "lucide-react";
import { useQuizzes } from "@/hooks/useQuizzes";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  points?: number;
}

export const QuizComponent = () => {
  const { quizzes, loading, submitQuizAttempt } = useQuizzes();
  const [selectedQuiz, setSelectedQuiz] = useState<typeof quizzes[0] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showResults && quizStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, quizStarted]);

  const handleStartQuiz = (quiz: typeof quizzes[0]) => {
    setSelectedQuiz(quiz);
    setTimeLeft((quiz.time_limit || 10) * 60);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;
    
    let correctAnswers = 0;
    selectedQuiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
    
    try {
      await submitQuizAttempt(selectedQuiz.id, selectedAnswers, correctAnswers);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    setShowResults(false);
  };

  // Show quiz list if no quiz selected
  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Available Quizzes</h2>
          <p className="text-muted-foreground">Test your knowledge with these interactive quizzes</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No quizzes available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStartQuiz(quiz)}>
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline">
                      {quiz.questions.length} Questions
                    </Badge>
                    <Badge variant="secondary">
                      {quiz.total_points} Points
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{quiz.time_limit || 10} minutes</span>
                  </div>
                  <Button className="w-full mt-4">Start Quiz</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show results
  if (showResults && selectedQuiz) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    return (
      <div className="space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Trophy className="h-6 w-6 text-gamify-gold" />
              <span>Quiz Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-primary">{percentage}%</div>
            <p className="text-lg">You scored {score} out of {selectedQuiz.questions.length}</p>
            <Progress value={percentage} className="h-4" />
            <div className="flex justify-center space-x-4">
              <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
              </Badge>
            </div>
            <Button onClick={handleBackToList} className="mt-4">
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>

        {/* Review Answers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Answers</h3>
          {selectedQuiz.questions.map((question) => {
            const userAnswer = selectedAnswers[question.id];
            const isCorrect = userAnswer === question.correct;
            return (
              <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="space-y-1 text-sm">
                        <p>Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{question.options[userAnswer] || 'Not answered'}</span></p>
                        <p>Correct answer: <span className="text-green-600">{question.options[question.correct]}</span></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = selectedQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
          <p className="text-muted-foreground">Test your knowledge</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            Exit Quiz
          </Button>
          <div className="flex items-center space-x-2 text-primary">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswers[currentQ.id]?.toString()} 
            onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentQuestion === selectedQuiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};