-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  teacher_id UUID REFERENCES public.profiles(user_id),
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student progress table
CREATE TABLE public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(user_id),
  course_id UUID REFERENCES public.courses(id),
  progress_percentage INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed BOOLEAN DEFAULT false
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_required INTEGER,
  category TEXT
);

-- Create student badges table
CREATE TABLE public.student_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(user_id),
  badge_id UUID REFERENCES public.badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id),
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  total_points INTEGER DEFAULT 0,
  time_limit INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(user_id),
  quiz_id UUID REFERENCES public.quizzes(id),
  score INTEGER DEFAULT 0,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Everyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Teachers can manage their courses" ON public.courses FOR ALL USING (auth.uid() = teacher_id);

-- RLS Policies for student progress
CREATE POLICY "Students can view their own progress" ON public.student_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can update their own progress" ON public.student_progress FOR ALL USING (auth.uid() = student_id);

-- RLS Policies for badges
CREATE POLICY "Everyone can view badges" ON public.badges FOR SELECT USING (true);

-- RLS Policies for student badges
CREATE POLICY "Students can view their own badges" ON public.student_badges FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can earn badges" ON public.student_badges FOR INSERT WITH CHECK (auth.uid() = student_id);

-- RLS Policies for quizzes
CREATE POLICY "Students can view quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Teachers can manage quizzes" ON public.quizzes FOR ALL USING (EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid()));

-- RLS Policies for quiz attempts
CREATE POLICY "Students can view their attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();