-- Create MCQ Questions Table
CREATE TABLE IF NOT EXISTS mcq_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Format: {"A": "text", "B": "text", "C": "text", "D": "text"}
    correct_option TEXT NOT NULL, -- "A", "B", "C", or "D"
    explanations JSONB, -- Format: {"A": "expl", "B": "expl", ...}
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mcq_questions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage mcq_questions" ON mcq_questions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.id = auth.uid()
            AND roles.name IN ('super_admin', 'normal_admin')
        )
    );

-- Students can only read active questions
CREATE POLICY "Students can view active mcq_questions" ON mcq_questions
    FOR SELECT
    TO authenticated
    USING (
        status = 'active'
        AND EXISTS (
            SELECT 1 FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.id = auth.uid()
            AND roles.name = 'student'
        )
    );

-- Create the update_modified_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_mcq_questions_modtime ON mcq_questions;
CREATE TRIGGER update_mcq_questions_modtime
    BEFORE UPDATE ON mcq_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
