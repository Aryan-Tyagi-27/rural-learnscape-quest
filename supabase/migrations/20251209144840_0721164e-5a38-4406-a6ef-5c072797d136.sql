-- Insert sample badges
INSERT INTO public.badges (name, category, icon, description, points_required) VALUES
('First Steps', 'achievement', '🎯', 'Complete your first lesson', 10),
('Quiz Master', 'achievement', '🏆', 'Score 100% on any quiz', 50),
('Lab Explorer', 'science', '🔬', 'Complete 5 virtual lab experiments', 100),
('Chemistry Whiz', 'science', '⚗️', 'Master all chemistry modules', 200),
('Physics Pro', 'science', '⚛️', 'Master all physics modules', 200),
('Biology Expert', 'science', '🧬', 'Master all biology modules', 200),
('Consistent Learner', 'streak', '🔥', 'Maintain a 7-day streak', 150),
('Knowledge Seeker', 'achievement', '📚', 'Complete 10 courses', 300)
ON CONFLICT DO NOTHING;

-- Insert sample courses (without teacher_id for now as public courses)
INSERT INTO public.courses (id, title, description, category, difficulty_level, content) VALUES
('11111111-1111-1111-1111-111111111111', 'Introduction to Chemistry', 'Learn the fundamentals of chemistry including atoms, molecules, and chemical reactions.', 'Chemistry', 'Beginner', '{"modules": [{"title": "Atoms and Elements", "duration": 30}, {"title": "Chemical Bonds", "duration": 45}, {"title": "Reactions", "duration": 40}], "videoUrl": "https://www.youtube.com/embed/FSyAehMdpyI"}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Physics Fundamentals', 'Explore the basic principles of physics from motion to energy.', 'Physics', 'Beginner', '{"modules": [{"title": "Motion and Forces", "duration": 35}, {"title": "Energy", "duration": 40}, {"title": "Waves", "duration": 30}], "videoUrl": "https://www.youtube.com/embed/ZM8ECpBuQYE"}'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Biology Basics', 'Discover the building blocks of life and how organisms function.', 'Biology', 'Beginner', '{"modules": [{"title": "Cells", "duration": 40}, {"title": "Genetics", "duration": 50}, {"title": "Evolution", "duration": 35}], "videoUrl": "https://www.youtube.com/embed/QnQe0xW_JY4"}'::jsonb),
('44444444-4444-4444-4444-444444444444', 'Organic Chemistry', 'Deep dive into carbon-based compounds and their reactions.', 'Chemistry', 'Intermediate', '{"modules": [{"title": "Hydrocarbons", "duration": 45}, {"title": "Functional Groups", "duration": 50}, {"title": "Organic Reactions", "duration": 55}], "videoUrl": "https://www.youtube.com/embed/bka20Q9TN6M"}'::jsonb),
('55555555-5555-5555-5555-555555555555', 'Quantum Mechanics', 'Introduction to the fascinating world of quantum physics.', 'Physics', 'Advanced', '{"modules": [{"title": "Wave-Particle Duality", "duration": 60}, {"title": "Uncertainty Principle", "duration": 45}, {"title": "Quantum States", "duration": 50}], "videoUrl": "https://www.youtube.com/embed/p7bzE1E5PMY"}'::jsonb),
('66666666-6666-6666-6666-666666666666', 'Human Anatomy', 'Comprehensive study of the human body systems.', 'Biology', 'Intermediate', '{"modules": [{"title": "Skeletal System", "duration": 40}, {"title": "Muscular System", "duration": 35}, {"title": "Nervous System", "duration": 50}], "videoUrl": "https://www.youtube.com/embed/uBGl2BujkPQ"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert sample quizzes
INSERT INTO public.quizzes (id, title, course_id, questions, total_points, time_limit) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'Chemistry Basics Quiz', '11111111-1111-1111-1111-111111111111', 
'[
  {"id": 1, "question": "What is the atomic number of Carbon?", "options": ["4", "6", "8", "12"], "correct": 1, "points": 10},
  {"id": 2, "question": "Which element has the symbol Na?", "options": ["Nitrogen", "Sodium", "Neon", "Nickel"], "correct": 1, "points": 10},
  {"id": 3, "question": "What type of bond involves sharing electrons?", "options": ["Ionic", "Covalent", "Metallic", "Hydrogen"], "correct": 1, "points": 10},
  {"id": 4, "question": "What is the pH of pure water?", "options": ["0", "7", "14", "1"], "correct": 1, "points": 10}
]'::jsonb, 40, 15),
('aaaa2222-2222-2222-2222-222222222222', 'Physics Motion Quiz', '22222222-2222-2222-2222-222222222222',
'[
  {"id": 1, "question": "What is the SI unit of force?", "options": ["Joule", "Newton", "Watt", "Pascal"], "correct": 1, "points": 10},
  {"id": 2, "question": "What is acceleration due to gravity on Earth?", "options": ["9.8 m/s²", "10.8 m/s²", "8.8 m/s²", "11.8 m/s²"], "correct": 0, "points": 10},
  {"id": 3, "question": "Which law states F = ma?", "options": ["First", "Second", "Third", "Fourth"], "correct": 1, "points": 10}
]'::jsonb, 30, 10),
('aaaa3333-3333-3333-3333-333333333333', 'Biology Cells Quiz', '33333333-3333-3333-3333-333333333333',
'[
  {"id": 1, "question": "What is the powerhouse of the cell?", "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], "correct": 1, "points": 10},
  {"id": 2, "question": "What carries genetic information?", "options": ["RNA", "DNA", "Protein", "Lipid"], "correct": 1, "points": 10},
  {"id": 3, "question": "Which organelle is responsible for protein synthesis?", "options": ["Lysosome", "Ribosome", "Vacuole", "Nucleus"], "correct": 1, "points": 10}
]'::jsonb, 30, 10)
ON CONFLICT (id) DO NOTHING;