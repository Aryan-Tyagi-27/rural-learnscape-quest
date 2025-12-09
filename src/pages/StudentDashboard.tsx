import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Users, 
  BookOpen, 
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  Play,
  Download,
  Settings,
  LogOut
} from "lucide-react";
import { StudentSidebar } from "@/components/StudentSidebar";
import { VirtualLab } from "@/components/VirtualLab";
import { QuizComponent } from "@/components/QuizComponent";
import { GamificationTracker } from "@/components/GamificationTracker";
import { EducationalReels } from "@/components/EducationalReels";
import { InteractiveLabs } from "@/components/InteractiveLabs";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { useBadges } from "@/hooks/useBadges";
import { toast } from "sonner";

// Hardcoded student data for gamification (will be dynamic later)
const mockStudents = [
  { id: 1, name: "Aman Kumar", points: 2850, avatar: "AK", streak: 15, badges: 12, rank: 1 },
  { id: 2, name: "Priya Sharma", points: 2720, avatar: "PS", streak: 22, badges: 10, rank: 2 },
  { id: 3, name: "Rahul Singh", points: 2650, avatar: "RS", streak: 8, badges: 9, rank: 3 },
  { id: 4, name: "Neha Patel", points: 2580, avatar: "NP", streak: 18, badges: 11, rank: 4 },
  { id: 5, name: "Arjun Verma", points: 2400, avatar: "AV", streak: 12, badges: 8, rank: 5 },
];

interface CourseType {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty_level: string;
  content: {
    modules?: { title: string; duration: number }[];
    videoUrl?: string;
  } | null;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const { signOut, profile } = useAuth();
  const { courses, loading: coursesLoading, updateProgress } = useCourses();
  const { badges, earnedBadges, loading: badgesLoading } = useBadges();
  const currentStudent = mockStudents[0]; // Current user

  const handleContinueCourse = (course: CourseType) => {
    setSelectedCourse(course);
    setVideoDialogOpen(true);
    toast.success(`Opening ${course.title} lesson`);
    
    // Simulate progress update
    if (course.progress !== undefined && course.progress < 100) {
      const newProgress = Math.min(100, (course.progress || 0) + 10);
      updateProgress(course.id, newProgress);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <Card className="lg:col-span-2 bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || "Student"}! 👋</h2>
                <p className="text-white/90">You're doing great! Keep up the momentum.</p>
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-gamify-orange" />
                    <span>{currentStudent.streak} day streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-gamify-gold" />
                    <span>Rank #{currentStudent.rank}</span>
                  </div>
                </div>
              </div>
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl bg-white/20">
                  {currentStudent.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        {/* Points Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-gamify-gold" />
              <span>Total Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{currentStudent.points.toLocaleString()}</div>
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">+125 this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coursesLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : courses.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No courses available yet</p>
            ) : (
              courses.slice(0, 3).map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{course.title}</h4>
                    <Badge variant="secondary">{course.progress || 0}%</Badge>
                  </div>
                  <Progress value={course.progress || 0} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {course.completedLessons || 0}/{course.totalLessons || 0} lessons completed
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {badgesLoading ? (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : earnedBadges.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 col-span-2">
                  Complete activities to earn badges!
                </p>
              ) : (
                earnedBadges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-2xl mb-2">{badge.icon || '🏆'}</div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">+{badge.points_required || 0} pts</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Class Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStudents.slice(0, 5).map((student, index) => (
              <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg ${student.id === currentStudent.id ? 'bg-primary/10 border border-primary/20' : 'bg-accent'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-gamify-gold text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200'}`}>
                    {index + 1}
                  </div>
                  <Avatar>
                    <AvatarFallback>{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name} {student.id === currentStudent.id && '(You)'}</p>
                    <p className="text-sm text-muted-foreground">{student.points.toLocaleString()} points</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-gamify-orange" />
                    <span className="text-sm">{student.streak}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-gamify-gold" />
                    <span className="text-sm">{student.badges}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/FSyAehMdpyI"
              title="Chemistry Fundamentals - Featured Lesson"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </CardContent>
      </Card>

      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No courses available yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant="secondary">{course.difficulty_level}</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0" onClick={() => handleContinueCourse(course)}>
                    <Play className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                <Progress value={course.progress || 0} className="h-2 mb-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.completedLessons || 0}/{course.totalLessons || 0} lessons</span>
                  <span>{course.progress || 0}% complete</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Star className="h-8 w-8 text-gamify-gold mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentStudent.points.toLocaleString()}</div>
            <p className="text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="h-8 w-8 text-gamify-purple mx-auto mb-2" />
            <div className="text-2xl font-bold">{earnedBadges.length}</div>
            <p className="text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Flame className="h-8 w-8 text-gamify-orange mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentStudent.streak}</div>
            <p className="text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* All Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {badgesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : badges.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No badges available yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className={`text-center p-4 rounded-lg border-2 ${badge.earned ? 'bg-accent border-primary/20' : 'bg-muted/30 border-border opacity-60'}`}>
                  <div className="text-3xl mb-2">{badge.icon || '🏅'}</div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.points_required || 0} points</p>
                  {badge.earned && <Badge className="mt-2" variant="secondary">Earned!</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <StudentSidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="flex-1 p-6">
          {/* Video Dialog */}
          <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedCourse?.title} - Lesson Video</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Educational Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Lesson Progress</h3>
                <Progress value={selectedCourse?.progress || 0} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {selectedCourse?.completedLessons}/{selectedCourse?.totalLessons} lessons completed
                </p>
              </div>
            </DialogContent>
          </Dialog>
        
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === "dashboard" && "Dashboard"}
                {currentView === "courses" && "My Courses"}
                {currentView === "virtuallab" && "Interactive Labs"}
                {currentView === "rewards" && "Rewards & Badges"}
                {currentView === "quiz" && "Interactive Quiz"}
                {currentView === "gamification" && "Gamification Tracker"}
                {currentView === "reels" && "Educational Reels"}
              </h1>
              <p className="text-muted-foreground">
                {currentView === "dashboard" && `Welcome back, ${profile?.full_name || "Student"}! Ready to learn?`}
                {currentView === "courses" && "Continue your learning journey"}
                {currentView === "virtuallab" && "Conduct experiments safely in our interactive labs"}
                {currentView === "rewards" && "Track your achievements and collect badges"}
                {currentView === "quiz" && "Test your knowledge with interactive quizzes"}
                {currentView === "gamification" && "Track your progress and achievements"}
                {currentView === "reels" && "Learn through engaging educational shorts"}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Content */}
          {currentView === "dashboard" && renderDashboard()}
          {currentView === "courses" && renderCourses()}
          {currentView === "virtuallab" && <InteractiveLabs />}
          {currentView === "rewards" && renderRewards()}
          {currentView === "quiz" && <QuizComponent />}
          {currentView === "gamification" && <GamificationTracker />}
          {currentView === "reels" && <EducationalReels />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;