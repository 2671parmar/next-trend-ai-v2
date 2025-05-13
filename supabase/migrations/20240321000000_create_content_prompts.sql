-- Create content_prompts table
CREATE TABLE IF NOT EXISTS content_prompts (
    id BIGSERIAL PRIMARY KEY,
    headline TEXT NOT NULL,
    hook TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial content prompts
INSERT INTO content_prompts (headline, hook, category) VALUES
    ('What''s the most important mortgage term for your clients?', 'Understanding this term can help them make better decisions when financing their homes.', 'mortgage_terms'),
    ('How can you explain the difference between a fixed-rate and adjustable-rate mortgage?', 'This can help clients choose the right loan for their needs.', 'mortgage_types'),
    ('What are some common mortgage terms that clients often ask about?', 'This can help you provide more personalized and helpful responses.', 'mortgage_terms'),
    ('What are the key benefits of refinancing in today''s market?', 'Help clients understand when refinancing might be a good option for them.', 'refinancing'),
    ('How can first-time homebuyers prepare for the mortgage process?', 'Guide new buyers through the essential steps of getting a mortgage.', 'first_time_buyers'),
    ('What should clients know about down payment assistance programs?', 'Inform clients about available programs that can help with down payments.', 'down_payment'),
    ('How do credit scores affect mortgage rates?', 'Help clients understand the relationship between credit and mortgage rates.', 'credit'),
    ('What are the advantages of VA loans for veterans?', 'Educate veterans about their unique mortgage benefits.', 'va_loans'),
    ('How can clients improve their debt-to-income ratio?', 'Provide actionable steps to improve mortgage qualification chances.', 'dti'),
    ('What''s the difference between pre-qualification and pre-approval?', 'Help clients understand these important first steps in the mortgage process.', 'pre_approval');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_prompts_updated_at
    BEFORE UPDATE ON content_prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 