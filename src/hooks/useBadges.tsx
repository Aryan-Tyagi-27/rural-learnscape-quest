import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Badge {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  description: string | null;
  points_required: number | null;
  earned?: boolean;
  earned_at?: string;
}

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBadges();
  }, [user]);

  const fetchBadges = async () => {
    try {
      setLoading(true);

      // Fetch all badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('points_required', { ascending: true });

      if (badgesError) throw badgesError;

      // Fetch user's earned badges
      let studentBadges: { badge_id: string; earned_at: string }[] = [];
      if (user) {
        const { data: earned, error: earnedError } = await supabase
          .from('student_badges')
          .select('badge_id, earned_at')
          .eq('student_id', user.id);

        if (!earnedError && earned) {
          studentBadges = earned;
        }
      }

      // Merge badges with earned status
      const earnedBadgeIds = new Set(studentBadges.map(sb => sb.badge_id));
      const badgesWithStatus = (badgesData || []).map(badge => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id),
        earned_at: studentBadges.find(sb => sb.badge_id === badge.id)?.earned_at
      }));

      setBadges(badgesWithStatus);
      setEarnedBadges(badgesWithStatus.filter(b => b.earned));
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  };

  const awardBadge = async (badgeId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('student_badges')
        .insert({
          student_id: user.id,
          badge_id: badgeId
        })
        .select()
        .single();

      if (error) throw error;

      await fetchBadges();
      return data;
    } catch (err) {
      console.error('Error awarding badge:', err);
      throw err;
    }
  };

  return { badges, earnedBadges, loading, error, refetch: fetchBadges, awardBadge };
};
