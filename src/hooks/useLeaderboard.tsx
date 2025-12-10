import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  total_points: number;
  streak: number;
  badges_count: number;
  rank: number;
  isCurrentUser: boolean;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserStats, setCurrentUserStats] = useState<LeaderboardEntry | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // Fetch all student profiles ordered by points
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, avatar_url, total_points, streak, role')
        .eq('role', 'student')
        .order('total_points', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      // Fetch badge counts for each student
      const userIds = (profiles || []).map(p => p.user_id);
      
      let badgeCounts: Record<string, number> = {};
      if (userIds.length > 0) {
        const { data: badges, error: badgesError } = await supabase
          .from('student_badges')
          .select('student_id');
        
        if (!badgesError && badges) {
          badgeCounts = badges.reduce((acc, badge) => {
            if (badge.student_id) {
              acc[badge.student_id] = (acc[badge.student_id] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);
        }
      }

      // Build leaderboard with ranks
      const leaderboardData: LeaderboardEntry[] = (profiles || []).map((profile, index) => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name || 'Student',
        avatar_url: profile.avatar_url,
        total_points: profile.total_points || 0,
        streak: profile.streak || 0,
        badges_count: badgeCounts[profile.user_id] || 0,
        rank: index + 1,
        isCurrentUser: user?.id === profile.user_id
      }));

      setLeaderboard(leaderboardData);

      // Set current user stats
      const currentUser = leaderboardData.find(entry => entry.isCurrentUser);
      setCurrentUserStats(currentUser || null);

    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return { leaderboard, loading, error, currentUserStats, refetch: fetchLeaderboard };
};
