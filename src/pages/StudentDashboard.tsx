import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Star, 
  Zap, 
  FlaskConical,
  Download,
  Wifi,
  WifiOff,
  Users,
  Award,
  Clock
} from "lucide-react";
import { VirtualLab } from "@/components/VirtualLab";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isOffline, setIsOffline] = useState(false);
  const [totalPoints] = useState(484);

  const courses = [
    {
      id: 1,
      title: "Programming 101",
      instructor: "Lawrence Turton",
      progress: 75,
      points: 50,
      color: "gamify-green",
      image: "🌱"
    },
    {
      id: 2,
      title: "HTML5 and CSS3 Fundamentals",
      instructor: "Steve Rice eLearning",
      progress: 60,
      points: 45,
      color: "gamify-orange",
      image: "💻"
    },
    {
      id: 3,
      title: "Microsoft Excel Pivot Tables",
      instructor: "Abel Joesuran",
      progress: 90,
      points: 70,
      color: "gamify-teal",
      image: "📊"
    },
    {
      id: 4,
      title: "Code Your First Game",
      instructor: "Chris DeLeon",
      progress: 30,
      points: 25,
      color: "gamify-purple",
      image: "🎮"
    }
  ];

  const achievements = [
    { name: "First Course", icon: "🏆", color: "gamify-orange" },
    { name: "Quiz Master", icon: "🧠", color: "gamify-purple" },
    { name: "Lab Expert", icon: "🔬", color: "gamify-teal" },
    { name: "Streak Hero", icon: "⚡", color: "gamify-green" },
  ];

  const recentActivity = [
    { action: "Completed Quiz: Chemical Reactions", time: "2 hours ago", points: 20 },
    { action: "Started Virtual Lab: Acid-Base Reactions", time: "1 day ago", points: 0 },
    { action: "Earned Achievement: Lab Expert", time: "2 days ago", points: 50 },
  ];

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-gamify text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
              <Trophy className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Courses</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <BookOpen className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-lab text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Lab Sessions</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <FlaskConical className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-foreground">7 days</p>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-5 w-5 text-gamify-orange" />
                <span className="text-gamify-orange font-semibold">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-gamify-purple" />
            <span>Weekly Learning Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Study 5 hours this week</span>
                <span>3.5/5 hours</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Complete 3 quizzes</span>
                <span>2/3 complete</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
            <CardContent className="p-0">
              <div className={`h-32 bg-${course.color} rounded-t-lg flex items-center justify-center text-4xl`}>
                {course.image}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-sm leading-tight">{course.title}</h3>
                <p className="text-xs text-muted-foreground">{course.instructor}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>{course.progress}% Complete</span>
                    <Badge variant="secondary" className="text-xs">
                      {course.points} pts
                    </Badge>
                  </div>
                  <Progress value={course.progress} className="h-1" />
                </div>
                <Button size="sm" className="w-full">Continue Course</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gamify-teal" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.points > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{activity.points} pts
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-gamify-orange" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div key={index} className={`bg-${achievement.color} rounded-lg p-3 text-center text-white`}>
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className="text-xs font-medium">{achievement.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <StudentSidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === "dashboard" && "Student Dashboard"}
                {currentView === "lab" && "Virtual Laboratory"}
                {currentView === "courses" && "My Courses"}
                {currentView === "rewards" && "Rewards & Progress"}
              </h1>
              <p className="text-muted-foreground">
                {currentView === "dashboard" && "Track your learning progress and achievements"}
                {currentView === "lab" && "Conduct virtual experiments safely"}
                {currentView === "courses" && "Continue your learning journey"}
                {currentView === "rewards" && "View your points and achievements"}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOffline(!isOffline)}
                className={isOffline ? "text-destructive" : "text-success"}
              >
                {isOffline ? <WifiOff className="h-4 w-4 mr-2" /> : <Wifi className="h-4 w-4 mr-2" />}
                {isOffline ? "Offline Mode" : "Online"}
              </Button>
              
              {isOffline && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Content
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          {currentView === "dashboard" && renderDashboardContent()}
          {currentView === "lab" && <VirtualLab />}
          {currentView === "courses" && renderDashboardContent()}
          {currentView === "rewards" && renderDashboardContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;