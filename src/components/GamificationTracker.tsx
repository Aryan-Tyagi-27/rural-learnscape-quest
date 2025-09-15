import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Medal,
  Gift,
  CheckCircle
} from "lucide-react";

export const GamificationTracker = () => {
  const userStats = {
    totalPoints: 2450,
    level: 12,
    nextLevelPoints: 2800,
    streak: 12,
    longestStreak: 28,
    weeklyGoal: 300,
    weeklyProgress: 180,
    monthlyRank: 3,
    totalStudents: 45
  };

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: true, points: 50 },
    { id: 2, name: "Week Warrior", description: "Maintain 7-day streak", icon: "🔥", unlocked: true, points: 100 },
    { id: 3, name: "Quiz Master", description: "Score 90%+ on 5 quizzes", icon: "🧠", unlocked: true, points: 150 },
    { id: 4, name: "Lab Expert", description: "Complete 10 virtual experiments", icon: "🧪", unlocked: true, points: 200 },
    { id: 5, name: "Knowledge Seeker", description: "Study for 50 hours", icon: "📚", unlocked: false, points: 250 },
    { id: 6, name: "Perfect Student", description: "Get perfect scores in 3 courses", icon: "⭐", unlocked: false, points: 300 }
  ];

  const recentRewards = [
    { type: "badge", name: "Lab Expert", earned: "2 days ago", points: 200 },
    { type: "streak", name: "12-Day Streak Bonus", earned: "Today", points: 50 },
    { type: "quiz", name: "Perfect Quiz Score", earned: "3 days ago", points: 100 },
    { type: "level", name: "Level 12 Reached", earned: "1 week ago", points: 500 }
  ];

  const weeklyModules = [
    { name: "Chemical Bonding", progress: 100, points: 120, status: "completed" },
    { name: "Organic Reactions", progress: 75, points: 90, status: "in-progress" },
    { name: "Thermodynamics", progress: 0, points: 0, status: "locked" },
    { name: "Electrochemistry", progress: 0, points: 0, status: "locked" }
  ];

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "badge": return <Award className="h-4 w-4 text-gamify-purple" />;
      case "streak": return <Flame className="h-4 w-4 text-gamify-orange" />;
      case "quiz": return <Target className="h-4 w-4 text-gamify-teal" />;
      case "level": return <Crown className="h-4 w-4 text-gamify-green" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "in-progress": return "bg-warning/10 text-warning border-warning/20";
      case "locked": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Level and Progress */}
      <Card className="shadow-card bg-gradient-gamify text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
                <p className="text-white/90">Chemistry Explorer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{userStats.totalPoints}</p>
              <p className="text-white/90 text-sm">Total Points</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>{userStats.totalPoints}/{userStats.nextLevelPoints}</span>
            </div>
            <Progress 
              value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} 
              className="h-3 bg-white/20"
            />
            <p className="text-xs text-white/80">{userStats.nextLevelPoints - userStats.totalPoints} points to next level</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Tracker */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-gamify-orange" />
              <span>Streak Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-gamify-orange">{userStats.streak}</div>
              <p className="text-sm text-muted-foreground">Days in a row!</p>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <span>Record:</span>
                <Badge variant="secondary">{userStats.longestStreak} days</Badge>
              </div>
              <Button size="sm" className="w-full">
                <Gift className="h-4 w-4 mr-2" />
                Claim Bonus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Goal */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-gamify-teal" />
              <span>Weekly Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{userStats.weeklyProgress}/{userStats.weeklyGoal} pts</span>
              </div>
              <Progress value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {userStats.weeklyGoal - userStats.weeklyProgress} points to reach weekly goal
              </p>
              <div className="flex items-center space-x-2 text-xs">
                <Calendar className="h-4 w-4" />
                <span>4 days left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Position */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gamify-green" />
              <span>Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Medal className="h-6 w-6 text-gamify-orange" />
                <span className="text-2xl font-bold">#{userStats.monthlyRank}</span>
              </div>
              <p className="text-sm text-muted-foreground">of {userStats.totalStudents} students</p>
              <Badge className="bg-success/10 text-success border-success/20">
                Top 10%
              </Badge>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-gamify-purple" />
            <span>Module Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{module.name}</h4>
                    <Badge className={getModuleStatusColor(module.status)}>
                      {module.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  {module.status !== "locked" && (
                    <Progress value={module.progress} className="h-2" />
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gamify-purple">
                    {module.points} pts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {module.progress}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-gamify-orange" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 border rounded-lg transition-all ${
                  achievement.unlocked 
                    ? "border-success/20 bg-success/5" 
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge 
                        variant={achievement.unlocked ? "secondary" : "outline"}
                        className={achievement.unlocked ? "text-gamify-purple" : ""}
                      >
                        {achievement.points} pts
                      </Badge>
                      {achievement.unlocked && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Rewards */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-gamify-pink" />
            <span>Recent Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-accent rounded-lg transition-colors">
                {getRewardIcon(reward.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.earned}</p>
                </div>
                <Badge variant="secondary" className="text-gamify-purple">
                  +{reward.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};