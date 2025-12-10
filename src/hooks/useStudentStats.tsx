import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface StudentStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  streak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyRank: number;
  totalStudents: number;
  completedCourses: number;
  completedQuizzes: number;
  earnedBadges: number;
}

interface ModuleProgress {
  name: string;
  progress: number;
  points: number;
  status: 'completed' | 'in-progress' | 'locked';
}

interface RecentReward {
  type: 'badge' | 'streak' | 'quiz' | 'level' | 'course';
  name: string;
  earned: string;
  points: number;
}

export const useStudentStats = () => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [modules, setModules] = useState<ModuleProgress[]>([]);
  const [recentRewards, setRecentRewards] = useState<RecentReward[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points, streak')
        .eq('user_id', user.id)
        .single();

      // Fetch student progress for courses
      const { data: progress } = await supabase
        .from('student_progress')
        .select('*, courses(title)')
        .eq('student_id', user.id);

      // Fetch earned badges
      const { data: earnedBadges } = await supabase
        .from('student_badges')
        .select('*, badges(name, points_required)')
        .eq('student_id', user.id)
        .order('earned_at', { ascending: false });

      // Fetch quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('student_id', user.id);

      // Count total students for ranking
      const { count: totalStudents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Get user's rank
      const { data: higherRanked } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'student')
        .gt('total_points', profile?.total_points || 0);

      const totalPoints = profile?.total_points || 0;
      const streak = profile?.streak || 0;
      const level = Math.floor(totalPoints / 200) + 1;
      const nextLevelPoints = level * 200;
      const completedCourses = (progress || []).filter(p => p.completed).length;
      const completedQuizzes = (quizAttempts || []).length;
      const earnedBadgesCount = (earnedBadges || []).length;

      // Calculate weekly progress (points earned in last 7 days)
      const weeklyProgress = (progress || [])
        .filter(p => {
          const lastAccessed = new Date(p.last_accessed || '');
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return lastAccessed > weekAgo;
        })
        .reduce((sum, p) => sum + (p.points_earned || 0), 0);

      setStats({
        totalPoints,
        level,
        nextLevelPoints,
        streak,
        longestStreak: streak, // Would need separate tracking
        weeklyGoal: 300,
        weeklyProgress,
        monthlyRank: (higherRanked?.length || 0) + 1,
        totalStudents: totalStudents || 0,
        completedCourses,
        completedQuizzes,
        earnedBadges: earnedBadgesCount
      });

      // Build module progress from courses
      const moduleProgress: ModuleProgress[] = (progress || []).map(p => ({
        name: (p.courses as any)?.title || 'Course',
        progress: p.progress_percentage || 0,
        points: p.points_earned || 0,
        status: p.completed ? 'completed' : p.progress_percentage > 0 ? 'in-progress' : 'locked'
      }));
      setModules(moduleProgress);

      // Build recent rewards
      const rewards: RecentReward[] = [];
      
      // Add badges as rewards
      (earnedBadges || []).slice(0, 3).forEach(badge => {
        rewards.push({
          type: 'badge',
          name: (badge.badges as any)?.name || 'Badge',
          earned: formatTimeAgo(new Date(badge.earned_at || '')),
          points: (badge.badges as any)?.points_required || 0
        });
      });

      // Add streak reward if active
      if (streak > 0) {
        rewards.push({
          type: 'streak',
          name: `${streak}-Day Streak Bonus`,
          earned: 'Today',
          points: streak * 5
        });
      }

      setRecentRewards(rewards.slice(0, 4));

    } catch (err) {
      console.error('Error fetching student stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const updateStreak = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak, last_activity_date')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      const lastActivity = profile.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = profile.streak || 0;
      
      if (lastActivity === yesterdayStr) {
        newStreak += 1;
      } else if (lastActivity !== today) {
        newStreak = 1;
      }

      await supabase
        .from('profiles')
        .update({ 
          streak: newStreak, 
          last_activity_date: today 
        })
        .eq('user_id', user.id);

      fetchStats();
    }
  };

  return { stats, modules, recentRewards, loading, refetch: fetchStats, updateStreak };
};
