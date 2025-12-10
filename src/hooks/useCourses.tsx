import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty_level: string;
  content: {
    modules?: { title: string; duration: number }[];
    videoUrl?: string;
  } | null;
  teacher_id: string | null;
  created_at: string;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

interface StudentProgress {
  course_id: string;
  progress_percentage: number;
  completed: boolean;
  points_earned: number;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch student progress if user is logged in
      let progressData: StudentProgress[] = [];
      if (user) {
        const { data: progress, error: progressError } = await supabase
          .from('student_progress')
          .select('*')
          .eq('student_id', user.id);

        if (!progressError && progress) {
          progressData = progress as StudentProgress[];
        }
      }

      // Merge courses with progress
      const coursesWithProgress = (coursesData || []).map(course => {
        const progress = progressData.find(p => p.course_id === course.id);
        const content = course.content as Course['content'];
        const totalLessons = content?.modules?.length || 0;
        const progressPercentage = progress?.progress_percentage || 0;
        const completedLessons = Math.round((progressPercentage / 100) * totalLessons);

        return {
          ...course,
          content,
          progress: progressPercentage,
          completedLessons,
          totalLessons
        };
      });

      setCourses(coursesWithProgress);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId: string, progressPercentage: number) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('student_progress')
        .select('id, points_earned')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      // Calculate points based on progress (10 points per 10% progress)
      const pointsForProgress = Math.floor(progressPercentage / 10) * 10;

      if (existing) {
        await supabase
          .from('student_progress')
          .update({ 
            progress_percentage: progressPercentage,
            completed: progressPercentage >= 100,
            last_accessed: new Date().toISOString(),
            points_earned: pointsForProgress
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('student_progress')
          .insert({
            student_id: user.id,
            course_id: courseId,
            progress_percentage: progressPercentage,
            completed: progressPercentage >= 100,
            points_earned: pointsForProgress
          });
      }

      // Refresh courses
      await fetchCourses();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const markCourseComplete = async (courseId: string) => {
    await updateProgress(courseId, 100);
  };

  return { courses, loading, error, refetch: fetchCourses, updateProgress, markCourseComplete };
};
