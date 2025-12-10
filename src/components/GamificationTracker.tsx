import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useStudentStats } from "@/hooks/useStudentStats";
import { useBadges } from "@/hooks/useBadges";
import { toast } from "sonner";

export const GamificationTracker = () => {
  const { stats, modules, recentRewards, loading } = useStudentStats();
  const { badges, earnedBadges } = useBadges();

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "badge": return <Award className="h-4 w-4 text-gamify-purple" />;
      case "streak": return <Flame className="h-4 w-4 text-gamify-orange" />;
      case "quiz": return <Target className="h-4 w-4 text-gamify-teal" />;
      case "level": return <Crown className="h-4 w-4 text-gamify-green" />;
      case "course": return <CheckCircle className="h-4 w-4 text-gamify-teal" />;
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

  const handleClaimBonus = () => {
    toast.success("Streak bonus claimed! +50 points");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const level = stats?.level || 1;
  const totalPoints = stats?.totalPoints || 0;
  const nextLevelPoints = stats?.nextLevelPoints || 200;
  const streak = stats?.streak || 0;

  return (
    <div className="space-y-6">
      {/* Level and Progress */}
      <Card className="shadow-card bg-gradient-gamify text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Level {level}</h2>
                <p className="text-white/90">
                  {level < 5 ? 'Beginner Learner' : level < 10 ? 'Rising Star' : 'Chemistry Explorer'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-white/90 text-sm">Total Points</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{totalPoints}/{nextLevelPoints}</span>
            </div>
            <Progress 
              value={(totalPoints / nextLevelPoints) * 100} 
              className="h-3 bg-white/20"
            />
            <p className="text-xs text-white/80">{nextLevelPoints - totalPoints} points to next level</p>
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
              <div className="text-4xl font-bold text-gamify-orange">{streak}</div>
              <p className="text-sm text-muted-foreground">Days in a row!</p>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <span>Keep learning daily!</span>
              </div>
              <Button size="sm" className="w-full" onClick={handleClaimBonus} disabled={streak < 7}>
                <Gift className="h-4 w-4 mr-2" />
                {streak >= 7 ? 'Claim Bonus' : `${7 - streak} days to bonus`}
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
                <span>{stats?.weeklyProgress || 0}/{stats?.weeklyGoal || 300} pts</span>
              </div>
              <Progress value={((stats?.weeklyProgress || 0) / (stats?.weeklyGoal || 300)) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {(stats?.weeklyGoal || 300) - (stats?.weeklyProgress || 0)} points to reach weekly goal
              </p>
              <div className="flex items-center space-x-2 text-xs">
                <Calendar className="h-4 w-4" />
                <span>Complete courses to earn points!</span>
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
                <span className="text-2xl font-bold">#{stats?.monthlyRank || '-'}</span>
              </div>
              <p className="text-sm text-muted-foreground">of {stats?.totalStudents || 0} students</p>
              {stats?.monthlyRank && stats.totalStudents && stats.monthlyRank <= Math.ceil(stats.totalStudents * 0.1) && (
                <Badge className="bg-success/10 text-success border-success/20">
                  Top 10%
                </Badge>
              )}
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
            <span>Course Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Start a course to track your progress!</p>
          ) : (
            <div className="space-y-4">
              {modules.map((module, index) => (
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
          )}
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
          {badges.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Complete activities to unlock achievements!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`p-4 border rounded-lg transition-all ${
                    badge.earned 
                      ? "border-success/20 bg-success/5" 
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`text-2xl ${badge.earned ? "" : "grayscale"}`}>
                      {badge.icon || '🏅'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>
                        {badge.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant={badge.earned ? "secondary" : "outline"}
                          className={badge.earned ? "text-gamify-purple" : ""}
                        >
                          {badge.points_required} pts
                        </Badge>
                        {badge.earned && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {recentRewards.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Complete activities to earn rewards!</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
