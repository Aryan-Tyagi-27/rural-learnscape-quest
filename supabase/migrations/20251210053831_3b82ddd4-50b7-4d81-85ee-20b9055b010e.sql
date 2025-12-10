-- Create user_roles table for secure role management
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'teacher');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Trigger to create user_role when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, NEW.role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_add_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_role();

-- Add total_points and streak columns to profiles for leaderboard
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date date DEFAULT CURRENT_DATE;

-- Update RLS on profiles to allow teachers to view student profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'teacher'));

-- Function to update student points when progress changes
CREATE OR REPLACE FUNCTION public.update_profile_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total integer;
BEGIN
  SELECT COALESCE(SUM(points_earned), 0) INTO total
  FROM public.student_progress
  WHERE student_id = COALESCE(NEW.student_id, OLD.student_id);
  
  UPDATE public.profiles
  SET total_points = total
  WHERE user_id = COALESCE(NEW.student_id, OLD.student_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_progress_update_points
  AFTER INSERT OR UPDATE OR DELETE ON public.student_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_points();

-- Update student_progress to auto-calculate points
ALTER TABLE public.student_progress 
ALTER COLUMN points_earned SET DEFAULT 0;

-- Allow teachers to view student progress
CREATE POLICY "Teachers can view all student progress"
ON public.student_progress
FOR SELECT
USING (public.has_role(auth.uid(), 'teacher'));

-- Allow teachers to view student badges
CREATE POLICY "Teachers can view all student badges"
ON public.student_badges
FOR SELECT
USING (public.has_role(auth.uid(), 'teacher'));

-- Add sample courses and badges if not exists
INSERT INTO public.courses (title, description, category, difficulty_level, content) 
VALUES 
  ('Chemistry Fundamentals', 'Learn the basics of chemistry including atoms, molecules, and reactions', 'Science', 'Beginner', '{"modules": [{"title": "Introduction to Atoms", "duration": 15}, {"title": "Chemical Bonds", "duration": 20}, {"title": "Basic Reactions", "duration": 25}], "videoUrl": "https://www.youtube.com/embed/FSyAehMdpyI"}'),
  ('Physics Mechanics', 'Understanding motion, forces, and energy', 'Science', 'Intermediate', '{"modules": [{"title": "Newton''s Laws", "duration": 20}, {"title": "Motion and Forces", "duration": 25}, {"title": "Energy Conservation", "duration": 30}], "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"}'),
  ('Mathematics Algebra', 'Master algebraic expressions and equations', 'Mathematics', 'Beginner', '{"modules": [{"title": "Variables and Expressions", "duration": 15}, {"title": "Linear Equations", "duration": 20}, {"title": "Quadratic Equations", "duration": 25}], "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"}'),
  ('Biology Basics', 'Introduction to cells, genetics, and ecosystems', 'Science', 'Beginner', '{"modules": [{"title": "Cell Structure", "duration": 20}, {"title": "DNA and Genetics", "duration": 25}, {"title": "Ecosystems", "duration": 20}], "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"}')
ON CONFLICT DO NOTHING;

INSERT INTO public.badges (name, description, category, icon, points_required) 
VALUES 
  ('First Steps', 'Complete your first lesson', 'Learning', '🎯', 10),
  ('Week Warrior', 'Maintain a 7-day streak', 'Streak', '🔥', 100),
  ('Quiz Master', 'Score 90%+ on 5 quizzes', 'Quiz', '🧠', 200),
  ('Lab Expert', 'Complete 10 virtual experiments', 'Lab', '🧪', 150),
  ('Bookworm', 'Complete 3 courses', 'Learning', '📚', 300),
  ('Rising Star', 'Earn 500 total points', 'Points', '⭐', 500),
  ('Champion', 'Earn 1000 total points', 'Points', '🏆', 1000)
ON CONFLICT DO NOTHING;

INSERT INTO public.quizzes (title, course_id, questions, total_points, time_limit)
SELECT 
  'Chemistry Quiz 1',
  id,
  '[{"question": "What is the symbol for water?", "options": ["H2O", "CO2", "NaCl", "O2"], "correct": 0}, {"question": "How many protons does hydrogen have?", "options": ["0", "1", "2", "3"], "correct": 1}, {"question": "What is the pH of pure water?", "options": ["5", "7", "9", "14"], "correct": 1}]'::jsonb,
  30,
  15
FROM public.courses WHERE title = 'Chemistry Fundamentals'
ON CONFLICT DO NOTHING;