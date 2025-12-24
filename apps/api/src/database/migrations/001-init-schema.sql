-- ============================================
-- COMPLETE DATABASE MIGRATION SCRIPT
-- MBTI Assessment Platform
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    website TEXT,
    logo_url TEXT,
    description TEXT,
    address TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_domain ON companies(domain);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate', 'company', 'admin')),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    last_seen_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    education TEXT,
    experience TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    about TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at);

-- OTP table (for password reset and verification)
CREATE TABLE otps (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'password_reset'
);

CREATE INDEX idx_otps_expires_at ON otps(expires_at);

-- ============================================
-- SUBSCRIPTION & PACKAGES
-- ============================================

-- Packages table (managed by admin)
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    max_assignments INT NOT NULL,
    price_per_month INT NOT NULL,
    description TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_packages_is_active ON packages(is_active);
CREATE INDEX idx_packages_code ON packages(code);

-- Company subscriptions table
CREATE TABLE company_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
    used_assignments INT NOT NULL DEFAULT 0,
    carry_over_assignments INT DEFAULT 0,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_unique_company_subscription ON company_subscriptions(company_id);
CREATE INDEX idx_company_subscriptions_status ON company_subscriptions(status);

-- ============================================
-- TESTS & ASSESSMENTS
-- ============================================

-- Tests table
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tests_is_active ON tests(is_active);

-- Test versions table
CREATE TABLE test_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (test_id, version_number)
);

CREATE INDEX idx_test_versions_test_id ON test_versions(test_id);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    test_version_id UUID REFERENCES test_versions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    type TEXT DEFAULT 'likert',
    dimension TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_questions_test_version_id ON questions(test_version_id);
CREATE INDEX idx_questions_order_index ON questions(order_index);

-- Answers table
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    score INTEGER NOT NULL,
    dimension TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_order_index ON answers(order_index);

-- Assessments table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    test_version_id UUID REFERENCES test_versions(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id),
    status TEXT CHECK (status IN ('started', 'completed', 'notStarted')),
    guest_email VARCHAR(255),
    guest_fullname VARCHAR(255),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_test_id ON assessments(test_id);
CREATE INDEX idx_assessments_test_version_id ON assessments(test_version_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_company_id ON assessments(company_id);

-- Responses table
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES answers(id) ON DELETE SET NULL,
    selected_option_index INTEGER,
    free_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_responses_assessment_id ON responses(assessment_id);
CREATE INDEX idx_responses_question_id ON responses(question_id);

-- ============================================
-- MBTI TYPES & RESULTS
-- ============================================

-- MBTI types table
CREATE TABLE mbti_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_code TEXT NOT NULL UNIQUE CHECK (type_code ~ '^[IE][NS][FT][JP]$'),
    type_name TEXT NOT NULL,
    overview TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    weaknesses TEXT[] NOT NULL,
    career_recommendations TEXT[] NOT NULL,
    improvement_areas TEXT[] NOT NULL,
    workplace_needs TEXT[] NOT NULL,
    suitable_roles TEXT[] NOT NULL,
    communication_style TEXT,
    leadership_style TEXT,
    stress_responses TEXT,
    development_tips TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mbti_types_type_code ON mbti_types(type_code);
CREATE INDEX idx_mbti_types_type_name ON mbti_types(type_name);

-- MBTI dimension descriptions table
CREATE TABLE mbti_dimension_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension_code TEXT NOT NULL UNIQUE,
    dimension_name TEXT NOT NULL,
    description TEXT NOT NULL,
    high_trait TEXT NOT NULL,
    high_trait_description TEXT NOT NULL,
    low_trait TEXT NOT NULL,
    low_trait_description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MBTI career paths table
CREATE TABLE mbti_career_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mbti_type_id UUID REFERENCES mbti_types(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    industry TEXT[] NOT NULL,
    skills_needed TEXT[] NOT NULL,
    development_path TEXT,
    salary_range TEXT,
    job_satisfaction_factors TEXT[] NOT NULL,
    potential_challenges TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mbti_career_paths_type_id ON mbti_career_paths(mbti_type_id);

-- Results table
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    mbti_type TEXT CHECK (mbti_type ~ '^[IE][NS][FT][JP]$'),
    mbti_type_id UUID REFERENCES mbti_types(id) ON DELETE SET NULL,
    raw_scores JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_results_assessment_id ON results(assessment_id);
CREATE INDEX idx_results_mbti_type ON results(mbti_type);
CREATE INDEX idx_results_mbti_type_id ON results(mbti_type_id);

-- AI scoring logs table
CREATE TABLE ai_scoring_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    prompt TEXT,
    response TEXT,
    scores JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_assessment_id ON ai_scoring_logs(assessment_id);
CREATE INDEX idx_ai_logs_model ON ai_scoring_logs(model);
CREATE INDEX idx_ai_logs_created_at ON ai_scoring_logs(created_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at 
    BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_versions_updated_at 
    BEFORE UPDATE ON test_versions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at 
    BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at 
    BEFORE UPDATE ON responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at 
    BEFORE UPDATE ON results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_scoring_logs_updated_at 
    BEFORE UPDATE ON ai_scoring_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at 
    BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at 
    BEFORE UPDATE ON company_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mbti_types_updated_at 
    BEFORE UPDATE ON mbti_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mbti_dimension_descriptions_updated_at 
    BEFORE UPDATE ON mbti_dimension_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mbti_career_paths_updated_at 
    BEFORE UPDATE ON mbti_career_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE mbti_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_dimension_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_career_paths ENABLE ROW LEVEL SECURITY;

-- Read access for all users
CREATE POLICY "Enable read access for all users" ON mbti_types
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON mbti_dimension_descriptions
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON mbti_career_paths
    FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Enable insert for admin only" ON mbti_types
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

CREATE POLICY "Enable update for admin only" ON mbti_types
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

CREATE POLICY "Enable insert for admin only" ON mbti_dimension_descriptions
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

CREATE POLICY "Enable update for admin only" ON mbti_dimension_descriptions
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

CREATE POLICY "Enable insert for admin only" ON mbti_career_paths
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

CREATE POLICY "Enable update for admin only" ON mbti_career_paths
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

-- ============================================
-- PERMISSIONS
-- ============================================

GRANT ALL PRIVILEGES ON TABLE mbti_types TO anon;
GRANT ALL PRIVILEGES ON TABLE mbti_types TO authenticated;
GRANT ALL PRIVILEGES ON TABLE mbti_types TO service_role;

GRANT ALL PRIVILEGES ON TABLE mbti_dimension_descriptions TO anon;
GRANT ALL PRIVILEGES ON TABLE mbti_dimension_descriptions TO authenticated;
GRANT ALL PRIVILEGES ON TABLE mbti_dimension_descriptions TO service_role;

GRANT ALL PRIVILEGES ON TABLE mbti_career_paths TO anon;
GRANT ALL PRIVILEGES ON TABLE mbti_career_paths TO authenticated;
GRANT ALL PRIVILEGES ON TABLE mbti_career_paths TO service_role;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert MBTI dimension descriptions
INSERT INTO mbti_dimension_descriptions (
    dimension_code, dimension_name, description,
    high_trait, high_trait_description,
    low_trait, low_trait_description
) VALUES
(
    'E-I',
    'Hướng ngoại - Hướng nội',
    'Trục này mô tả cách bạn tập trung năng lượng và chú ý của mình. Hướng ngoại (E) hướng ra thế giới bên ngoài, trong khi Hướng nội (I) hướng vào thế giới nội tâm.',
    'E (Hướng ngoại)',
    'Người hướng ngoại thích tương tác với thế giới bên ngoài, họ lấy năng lượng từ việc giao tiếp với người khác. Họ thường suy nghĩ bằng cách nói ra và thích làm việc trong nhóm.',
    'I (Hướng nội)',
    'Người hướng nội thích tập trung vào thế giới nội tâm của họ, họ lấy năng lượng từ việc dành thời gian một mình hoặc với một vài người thân thiết. Họ thường suy nghĩ trước khi nói và thích làm việc độc lập.'
),
(
    'S-N',
    'Giác quan - Trực giác',
    'Trục này mô tả cách bạn tiếp nhận và xử lý thông tin. Giác quan (S) tập trung vào thông tin cụ thể và thực tế, trong khi Trực giác (N) tập trung vào các mẫu, mối liên hệ và khả năng tiềm ẩn.',
    'N (Trực giác)',
    'Người trực giác tập trung vào các khái niệm trừu tượng, mô hình và khả năng trong tương lai. Họ thích khám phá ý nghĩa đằng sau các sự kiện và tìm kiếm những cách tiếp cận đổi mới.',
    'S (Giác quan)',
    'Người giác quan tập trung vào thông tin cụ thể, chi tiết và kinh nghiệm thực tế. Họ thích làm việc với những gì có thể quan sát được và có xu hướng thực tế, thích các giải pháp đã được kiểm chứng.'
),
(
    'T-F',
    'Tư duy - Cảm xúc',
    'Trục này mô tả cách bạn đưa ra quyết định. Tư duy (T) tập trung vào logic và tính khách quan, trong khi Cảm xúc (F) tập trung vào các giá trị và tác động đến con người.',
    'F (Cảm xúc)',
    'Người cảm xúc đưa ra quyết định dựa trên các giá trị cá nhân và tác động đến con người. Họ quan tâm đến sự hài hòa trong các mối quan hệ và thường đặt nhu cầu của người khác lên trên logic thuần túy.',
    'T (Tư duy)',
    'Người tư duy đưa ra quyết định dựa trên logic và tính khách quan. Họ tập trung vào sự thật, tính công bằng và hiệu quả. Họ có xu hướng phân tích các tình huống một cách vô tư và không để cảm xúc chi phối quyết định.'
),
(
    'J-P',
    'Nguyên tắc - Linh hoạt',
    'Trục này mô tả cách bạn tiếp cận thế giới bên ngoài và quản lý cuộc sống hàng ngày của bạn. Nguyên tắc (J) thích cấu trúc và kế hoạch, trong khi Linh hoạt (P) thích tự do và tính linh hoạt.',
    'J (Nguyên tắc)',
    'Người nguyên tắc thích có kế hoạch và cấu trúc trong cuộc sống của họ. Họ thích hoàn thành công việc, đưa ra quyết định sớm và kiểm soát môi trường xung quanh. Họ thường có tổ chức và thích tuân theo lịch trình.',
    'P (Linh hoạt)',
    'Người linh hoạt thích giữ các lựa chọn mở và thích ứng với hoàn cảnh. Họ thích bắt đầu các dự án hơn là hoàn thành chúng, trì hoãn quyết định để thu thập thêm thông tin, và thích sự tự phát và linh hoạt trong cuộc sống.'
);

-- ============================================
-- SEED DATA - MBTI TEST
-- ============================================

-- Insert default MBTI test
INSERT INTO tests (id, title, description, is_active)
VALUES (
    '465c0214-ba18-46d7-b56e-325cf252856e',
    'MBTI Personality Assessment',
    'Discover your personality type through 25 validated questions',
    true
);

-- Insert test version
INSERT INTO test_versions (id, test_id, version_number, description)
VALUES (
    '14605646-6380-4a24-9f3b-f1a2d6ee76f3',
    '465c0214-ba18-46d7-b56e-325cf252856e',
    1,
    'Standard 25-question MBTI assessment'
);

-- Insert 25 Questions + 50 Answers
DO $mbti_seed$
DECLARE
    q_id UUID;
    testId UUID := '465c0214-ba18-46d7-b56e-325cf252856e';
    versionId UUID := '14605646-6380-4a24-9f3b-f1a2d6ee76f3';
BEGIN
    -- Question 1
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '1. Bạn là người', 'likert', 'E/I', 1)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'dễ hiểu', 1, 'E', 1),
    (q_id, 'khó hiểu', -1, 'I', 2);

    -- Question 2
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '2. Để hoàn thành một công việc bạn thường phụ thuộc vào', 'likert', 'J/P', 2)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'bắt tay làm sớm để hoàn thành mà vẫn còn thừa thời gian', 1, 'J', 1),
    (q_id, 'tập trung nỗ lực cao độ vào giờ phút chót', -1, 'P', 2);

    -- Question 3
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '3. Bạn thường', 'likert', 'E/I', 3)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'có thể thao thao bất tuyệt với hầu như bất kỳ ai khi cần', 1, 'E', 1),
    (q_id, 'chỉ nói với người hợp hoặc trong điều kiện nhất định', -1, 'I', 2);

    -- Question 4
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '4. Nên xem bạn như là', 'likert', 'S/N', 4)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'một người thực tế', 1, 'S', 1),
    (q_id, 'một người thông thái', -1, 'N', 2);

    -- Question 5
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '5. Nếu bạn đi kêu gọi mọi người đóng góp từ thiện, lời kêu gọi của bạn sẽ là', 'likert', 'T/F', 5)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'ngắn gọn, theo phong cách dân làm ăn', 1, 'T', 1),
    (q_id, 'gần gũi, thân thiện', -1, 'F', 2);

    -- Question 6
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '6. Bạn là người', 'likert', 'E/I', 6)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'hội nhập tốt', 1, 'E', 1),
    (q_id, 'im lặng và kín đáo', -1, 'I', 2);

    -- Question 7
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '7. Khi một việc đột xuất buộc bạn phải thay đổi sinh hoạt thường ngày, bạn sẽ', 'likert', 'J/P', 7)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'không thoải mái vì bị xáo trộn', 1, 'J', 1),
    (q_id, 'hoan nghênh sự thay đổi', -1, 'P', 2);

    -- Question 8
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '8. Đọc sách khi rảnh rỗi, bạn thường', 'likert', 'S/N', 8)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'thích lối viết sáng tạo', -1, 'N', 1),
    (q_id, 'thích nói thẳng vấn đề', 1, 'S', 2);

    -- Question 9
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '9. Bạn thích được gọi là', 'likert', 'T/F', 9)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'người giàu cảm xúc', -1, 'F', 1),
    (q_id, 'người luôn có lý', 1, 'T', 2);

    -- Question 10
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '10. Bạn có xu hướng', 'likert', 'E/I', 10)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'thân với 1 vài người', -1, 'I', 1),
    (q_id, 'quan hệ rộng rãi', 1, 'E', 2);

    -- Question 11
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '11. Bạn thường để', 'likert', 'T/F', 11)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'con tim dẫn dắt', -1, 'F', 1),
    (q_id, 'lý trí dẫn dắt', 1, 'T', 2);

    -- Question 12
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '12. Bạn có thể trò chuyện bất tận', 'likert', 'E/I', 12)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'chỉ với người cùng sở thích', -1, 'I', 1),
    (q_id, 'gần như với bất kỳ ai', 1, 'E', 2);

    -- Question 13
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '13. Làm việc theo lịch định sẵn là', 'likert', 'J/P', 13)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'hứng thú', 1, 'J', 1),
    (q_id, 'trói buộc', -1, 'P', 2);

    -- Question 14
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '14. Khi khởi đầu đề án lớn', 'likert', 'J/P', 14)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'lập danh sách công việc', 1, 'J', 1),
    (q_id, 'bắt tay làm ngay', -1, 'P', 2);

    -- Question 15
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '15. Khi nói chuyện với bạn bè, bạn có', 'likert', 'E/I', 15)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'chia sẻ đôi chút chuyện riêng', 1, 'E', 1),
    (q_id, 'hầu như không chia sẻ', -1, 'I', 2);

    -- Question 16
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '16. Nếu bạn là thầy giáo, bạn thích dạy', 'likert', 'S/N', 16)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'môn thực tiễn', 1, 'S', 1),
    (q_id, 'môn lý thuyết', -1, 'N', 2);

    -- Question 17
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '17. Bạn thường mở lời khi', 'likert', 'T/F', 17)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'khen', 1, 'F', 1),
    (q_id, 'chê', -1, 'T', 2);

    -- Question 18
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '18. Bạn thường', 'likert', 'E/I', 18)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'biểu lộ cảm xúc thoải mái', 1, 'E', 1),
    (q_id, 'kiềm chế cảm xúc', -1, 'I', 2);

    -- Question 19
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '19. Khi được sắp xếp trước việc cần làm', 'likert', 'J/P', 19)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'vui vì có thể lên kế hoạch', 1, 'J', 1),
    (q_id, 'không vui vì bị hạn chế', -1, 'P', 2);

    -- Question 20
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '20. Bạn hợp với', 'likert', 'S/N', 20)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'người giàu trí tưởng tượng', -1, 'N', 1),
    (q_id, 'người thực tế', 1, 'S', 2);

    -- Question 21
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '21. Bạn thấy đó là sai lầm tồi tệ khi', 'likert', 'T/F', 21)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'tỏ ra thiếu cảm thông', -1, 'F', 1),
    (q_id, 'tỏ ra vô lý', 1, 'T', 2);

    -- Question 22
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '22. Khi người lạ chú ý bạn, bạn thấy', 'likert', 'E/I', 22)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'khó chịu', -1, 'I', 1),
    (q_id, 'không phiền', 1, 'E', 2);

    -- Question 23
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '23. Nếu bạn phải hành động, lý lẽ nào hợp với bạn', 'likert', 'T/F', 23)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'mọi người muốn bạn làm điều này', 1, 'F', 1),
    (q_id, 'đây là điều hợp lý nhất', -1, 'T', 2);

    -- Question 24
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '24. Thói quen của bạn là', 'likert', 'E/I', 24)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'không tin ai (hoặc chỉ một người)', -1, 'I', 1),
    (q_id, 'có một vài người bạn tin tưởng', 1, 'E', 2);

    -- Question 25
    INSERT INTO questions (test_id, test_version_id, text, type, dimension, order_index)
    VALUES (testId, versionId, '25. Bạn thích', 'likert', 'J/P', 25)
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, score, dimension, order_index) VALUES
    (q_id, 'sắp xếp trước các buổi hẹn', 1, 'J', 1),
    (q_id, 'thoải mái làm điều mình thích khi đến lúc', -1, 'P', 2);

END $mbti_seed$;

-- Note: MBTI types data (16 personality types) is extensive and should be inserted separately
-- See separate seed file for complete MBTI types data

-- ============================================
-- END OF MIGRATION
-- ============================================