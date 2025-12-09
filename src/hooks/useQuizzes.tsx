import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  course_id: string | null;
  questions: Question[];
  total_points: number;
  time_limit: number;
  created_at: string;
}

interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  answers: Record<number, number>;
  completed_at: string;
}

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuizzes();
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quizzesError) throw quizzesError;

      // Parse questions JSON
      const parsedQuizzes = (quizzesData || []).map(quiz => ({
        ...quiz,
        questions: (quiz.questions as unknown as Question[]) || []
      }));

      setQuizzes(parsedQuizzes);

      // Fetch user's attempts
      if (user) {
        const { data: attemptsData, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('student_id', user.id);

        if (!attemptsError && attemptsData) {
          setAttempts(attemptsData.map(a => ({
            ...a,
            answers: (a.answers as Record<number, number>) || {}
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const submitQuizAttempt = async (quizId: string, answers: Record<number, number>, score: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          student_id: user.id,
          answers: answers,
          score: score
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh attempts
      await fetchQuizzes();
      return data;
    } catch (err) {
      console.error('Error submitting quiz attempt:', err);
      throw err;
    }
  };

  return { quizzes, attempts, loading, error, refetch: fetchQuizzes, submitQuizAttempt };
};
