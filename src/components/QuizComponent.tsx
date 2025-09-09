import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle, XCircle, Trophy } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const sampleQuiz: Question[] = [
  {
    id: 1,
    question: "What happens when acid and base react together?",
    options: ["Salt and water", "Only salt", "Only water", "No reaction"],
    correct: 0,
    explanation: "When acid and base react, they neutralize each other forming salt and water."
  },
  {
    id: 2,
    question: "Which is the universal solvent?",
    options: ["Alcohol", "Oil", "Water", "Vinegar"],
    correct: 2,
    explanation: "Water is called the universal solvent because it can dissolve many substances."
  },
  {
    id: 3,
    question: "What is the pH of pure water?",
    options: ["6", "7", "8", "9"],
    correct: 1,
    explanation: "Pure water has a neutral pH of 7."
  }
];

export const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    sampleQuiz.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const percentage = Math.round((score / sampleQuiz.length) * 100);
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
            <p className="text-lg">You scored {score} out of {sampleQuiz.length}</p>
            <Progress value={percentage} className="h-4" />
            <div className="flex justify-center space-x-4">
              <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Review Answers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Answers</h3>
          {sampleQuiz.map((question) => {
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
                        <p className="text-muted-foreground mt-2">{question.explanation}</p>
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

  const currentQ = sampleQuiz[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuiz.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Chemistry Basics Quiz</h2>
          <p className="text-muted-foreground">Test your knowledge of chemical reactions</p>
        </div>
        <div className="flex items-center space-x-2 text-primary">
          <Clock className="h-4 w-4" />
          <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {sampleQuiz.length}</span>
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
          {currentQuestion === sampleQuiz.length - 1 ? (
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