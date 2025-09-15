import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  GraduationCap,
  Settings,
  Upload,
  Award,
  Target,
  Calendar,
  MessageSquare,
  FileText,
  Video,
  Download,
  PlayCircle,
  TrendingUp,
  Brain,
  LineChart
} from "lucide-react";
import { toast } from "sonner";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { TeacherTraining } from "@/components/TeacherTraining";
import { StudentAnalytics } from "@/components/StudentAnalytics";

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const classStats = [
    { label: "Total Students", value: 42, icon: Users, color: "gamify-teal" },
    { label: "Active Courses", value: 6, icon: BookOpen, color: "gamify-green" },
    { label: "Assignments Due", value: 8, icon: FileText, color: "gamify-orange" },
    { label: "Avg. Performance", value: "87%", icon: Trophy, color: "gamify-purple" },
  ];

  const recentActivities = [
    { student: "Aman Kumar", action: "Completed Virtual Lab: Acid-Base Reactions", time: "2 hours ago", points: 50 },
    { student: "Priya Sharma", action: "Submitted Assignment: Chemical Equations", time: "4 hours ago", points: 45 },
    { student: "Rahul Singh", action: "Started Course: Organic Chemistry", time: "1 day ago", points: 0 },
    { student: "Neha Patel", action: "Achieved Badge: Lab Expert", time: "2 days ago", points: 75 },
  ];

  const courseProgress = [
    { name: "Chemistry Fundamentals", students: 38, completion: 73, assignments: 12 },
    { name: "Organic Chemistry", students: 25, completion: 45, assignments: 8 },
    { name: "Physical Chemistry", students: 32, completion: 89, assignments: 15 },
    { name: "Analytical Chemistry", students: 28, completion: 62, assignments: 10 },
  ];

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
      {/* ML Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-lab text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Learning Patterns</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-white/80">Pattern Recognition</p>
              </div>
              <Brain className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Performance Trend</p>
                <p className="text-2xl font-bold">↗ 12%</p>
                <p className="text-xs text-white/80">This Month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-gamify text-white border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm">Prediction Accuracy</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-white/80">Success Rate</p>
              </div>
              <LineChart className="h-8 w-8 text-white/90" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Insights */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-gamify-purple" />
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">✓ Positive Trend Detected</h4>
              <p className="text-sm text-muted-foreground">Students showing 15% improvement in Chemistry fundamentals over the last 2 weeks. Interactive labs are particularly effective.</p>
            </div>
            
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-medium text-warning mb-2">⚠ Attention Needed</h4>
              <p className="text-sm text-muted-foreground">3 students showing declining engagement in Organic Chemistry. Consider personalized intervention or alternative teaching methods.</p>
            </div>
            
            <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
              <h4 className="font-medium text-info mb-2">💡 Recommendation</h4>
              <p className="text-sm text-muted-foreground">Peak learning hours detected between 2-4 PM. Schedule important concepts during this time for maximum retention.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Pattern Graph Placeholder */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gamify-teal" />
            <span>Learning Patterns & Predictions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-accent/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Interactive ML Analytics Dashboard</p>
              <p className="text-sm text-muted-foreground">Real-time learning pattern analysis and performance predictions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {classStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`bg-${stat.color} text-white border-0 shadow-card`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-white/90" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions with Real Functionality */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-gamify-purple" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-24 flex-col space-y-2"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx,.ppt,.pptx';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    // Simulate upload
                    toast.success(`Uploading ${file.name}...`);
                    setTimeout(() => toast.success('Content uploaded successfully!'), 2000);
                  }
                };
                input.click();
              }}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Content</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2"
              onClick={() => toast.success('Rewards assigned to top performers!')}
            >
              <Award className="h-6 w-6" />
              <span>Assign Rewards</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2"
              onClick={() => toast.info('Assignment creation portal opened!')}
            >
              <FileText className="h-6 w-6" />
              <span>Create Assignment</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2"
              onClick={() => toast.info('Course assignment panel opened!')}
            >
              <BookOpen className="h-6 w-6" />
              <span>Assign Courses</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gamify-teal" />
            <span>Course Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map((course, index) => (
              <div key={index} className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.students} students • {course.assignments} assignments
                    </p>
                  </div>
                  <Badge variant="secondary">{course.completion}% complete</Badge>
                </div>
                <Progress value={course.completion} className="h-2" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{course.completion}% completed</span>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Student Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gamify-green" />
            <span>Recent Student Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-start p-3 hover:bg-accent rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{activity.student}</span>
                    {activity.points > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        +{activity.points} pts
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <TeacherSidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === "dashboard" && "Teacher Dashboard"}
                {currentView === "students" && "Students Data"}
                {currentView === "training" && "Teacher Training"}
                {currentView === "assignments" && "Assignments"}
                {currentView === "analytics" && "Analytics"}
              </h1>
              <p className="text-muted-foreground">
                {currentView === "dashboard" && "Manage your classes and track student progress"}
                {currentView === "students" && "View detailed student performance data"}
                {currentView === "training" && "Learn how to use the platform effectively"}
                {currentView === "assignments" && "Create and manage assignments"}
                {currentView === "analytics" && "Analyze class performance and trends"}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Content */}
          {currentView === "dashboard" && renderDashboardContent()}
          {currentView === "training" && <TeacherTraining />}
          {currentView === "students" && <StudentAnalytics />}
          {currentView === "assignments" && renderDashboardContent()}
          {currentView === "analytics" && renderAnalyticsContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;