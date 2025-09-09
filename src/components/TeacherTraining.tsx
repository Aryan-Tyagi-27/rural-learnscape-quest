import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Video,
  Download,
  Star,
  Award,
  Target,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "video" | "article" | "interactive";
  difficulty: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  progress: number;
  icon: string;
}

export const TeacherTraining = () => {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);

  const trainingModules: TrainingModule[] = [
    {
      id: "platform-intro",
      title: "Platform Introduction",
      description: "Learn the basics of the rural gamified learning platform and its core features",
      duration: "15 mins",
      type: "video",
      difficulty: "beginner",
      completed: true,
      progress: 100,
      icon: "🎯"
    },
    {
      id: "gamification-basics",
      title: "Understanding Gamification",
      description: "How to use points, badges, and rewards to motivate rural students",
      duration: "20 mins",
      type: "interactive",
      difficulty: "beginner",
      completed: true,
      progress: 100,
      icon: "🎮"
    },
    {
      id: "virtual-lab-guide",
      title: "Virtual Laboratory Management",
      description: "Guide students through virtual experiments and ensure safety protocols",
      duration: "25 mins",
      type: "video",
      difficulty: "intermediate",
      completed: false,
      progress: 60,
      icon: "🧪"
    },
    {
      id: "offline-teaching",
      title: "Offline Content Management",
      description: "Managing learning in low-connectivity environments and rural areas",
      duration: "18 mins",
      type: "article",
      difficulty: "intermediate",
      completed: false,
      progress: 0,
      icon: "📱"
    },
    {
      id: "student-progress",
      title: "Student Progress Tracking",
      description: "Monitor student performance, identify struggling learners, and provide support",
      duration: "22 mins",
      type: "interactive",
      difficulty: "intermediate",
      completed: false,
      progress: 30,
      icon: "📊"
    },
    {
      id: "rural-pedagogy",
      title: "Rural Learning Psychology",
      description: "Understanding the unique needs and challenges of rural students",
      duration: "30 mins",
      type: "article",
      difficulty: "advanced",
      completed: false,
      progress: 0,
      icon: "🌾"
    },
    {
      id: "content-creation",
      title: "Creating Engaging Content",
      description: "Best practices for creating educational content for rural learners",
      duration: "35 mins",
      type: "video",
      difficulty: "advanced",
      completed: false,
      progress: 0,
      icon: "✨"
    },
    {
      id: "assessment-strategies",
      title: "Assessment & Evaluation",
      description: "Effective assessment strategies for gamified learning environments",
      duration: "28 mins",
      type: "interactive",
      difficulty: "advanced",
      completed: false,
      progress: 0,
      icon: "📝"
    }
  ];

  const handleModuleStart = (module: TrainingModule) => {
    setSelectedModule(module);
    toast.success(`Started: ${module.title}`);
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules([...completedModules, moduleId]);
    toast.success("Module completed! You earned 25 training points.");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "gamify-green";
      case "intermediate": return "gamify-orange";
      case "advanced": return "gamify-purple";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "interactive": return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const completedCount = trainingModules.filter(m => m.completed).length;
  const totalModules = trainingModules.length;
  const overallProgress = (completedCount / totalModules) * 100;

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Training Progress</p>
                <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
              </div>
              <Target className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Completed</p>
                <p className="text-2xl font-bold">{completedCount}/{totalModules}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-gamify text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Training Points</p>
                <p className="text-2xl font-bold">{completedCount * 25}</p>
              </div>
              <Award className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-lab text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Certification</p>
                <p className="text-lg font-bold">
                  {completedCount >= totalModules ? "Earned" : "In Progress"}
                </p>
              </div>
              <Star className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Path */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gamify-purple" />
            <span>Teacher Training Modules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingModules.map((module) => (
              <Card key={module.id} className="border border-border hover:shadow-hover transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{module.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">{module.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
                      </div>
                    </div>
                    {module.completed && (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {getTypeIcon(module.type)}
                      <span className="ml-1 capitalize">{module.type}</span>
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs bg-${getDifficultyColor(module.difficulty)}/10 text-${getDifficultyColor(module.difficulty)}`}
                    >
                      {module.difficulty}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {module.duration}
                    </div>
                  </div>

                  {module.progress > 0 && !module.completed && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-1" />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {module.completed ? (
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    ) : module.progress > 0 ? (
                      <Button size="sm" className="flex-1" onClick={() => handleModuleStart(module)}>
                        Continue Learning
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleModuleStart(module)}>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Module
                      </Button>
                    )}
                    
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gamify-teal" />
            <span>Quick Tips for Rural Teaching</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">Gamification Strategy</h4>
              <p className="text-sm text-foreground">Use points and badges to motivate students, especially in areas with limited resources.</p>
            </div>
            <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
              <h4 className="font-medium text-info mb-2">Offline Preparation</h4>
              <p className="text-sm text-foreground">Always have downloadable content ready for students with poor connectivity.</p>
            </div>
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-medium text-warning mb-2">Virtual Labs</h4>
              <p className="text-sm text-foreground">Guide students through safety protocols even in virtual environments.</p>
            </div>
            <div className="p-4 bg-gamify-purple/10 border border-gamify-purple/20 rounded-lg">
              <h4 className="font-medium text-gamify-purple mb-2">Community Building</h4>
              <p className="text-sm text-foreground">Encourage peer-to-peer learning and collaboration among rural students.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};