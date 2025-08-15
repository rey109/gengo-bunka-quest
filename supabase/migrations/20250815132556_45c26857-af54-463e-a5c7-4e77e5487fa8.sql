-- Create questions table
CREATE TABLE public.questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('Gengo', 'Bunka')),
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exams table
CREATE TABLE public.exams (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('Gengo', 'Bunka')),
    duration INTEGER NOT NULL DEFAULT 60, -- duration in minutes
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    exam_code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Gengo', 'Bunka')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    violations INTEGER NOT NULL DEFAULT 0,
    is_submitted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table
CREATE TABLE public.answers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    answer TEXT CHECK (answer IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, question_id)
);

-- Create scores table
CREATE TABLE public.scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, exam_id)
);

-- Create admin users table for authentication
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for students)
CREATE POLICY "Allow public read access to questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access to students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public insert access to answers" ON public.answers FOR ALL USING (true);
CREATE POLICY "Allow public read access to scores" ON public.scores FOR SELECT USING (true);

-- Admin policies (will be restricted later with proper auth)
CREATE POLICY "Allow all access to admin users" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Allow admin access to questions" ON public.questions FOR ALL USING (true);
CREATE POLICY "Allow admin access to exams" ON public.exams FOR ALL USING (true);
CREATE POLICY "Allow admin access to scores" ON public.scores FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$K7ZLWz8VY5o5O5o5O5o5O5o5O5o5O5o5O5o5O5o5O5o5O5o5O5o5O5');

-- Insert default exam configurations
INSERT INTO public.exams (category, duration, is_active) VALUES 
('Gengo', 60, true),
('Bunka', 60, true);