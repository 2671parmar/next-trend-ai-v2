-- Create content_generation_usage table
CREATE TABLE IF NOT EXISTS content_generation_usage (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- 'mbs_commentary', 'trending_topics', 'general_terms', 'custom'
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS content_generation_usage_user_id_idx ON content_generation_usage(user_id);
CREATE INDEX IF NOT EXISTS content_generation_usage_generated_at_idx ON content_generation_usage(generated_at);
CREATE INDEX IF NOT EXISTS content_generation_usage_content_type_idx ON content_generation_usage(content_type);

-- Create a function to get usage count for a user in the last N days
CREATE OR REPLACE FUNCTION get_content_generation_usage_count(
    p_user_id UUID,
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    content_type TEXT,
    usage_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cgu.content_type,
        COUNT(*) as usage_count
    FROM content_generation_usage cgu
    WHERE 
        cgu.user_id = p_user_id
        AND cgu.generated_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY cgu.content_type;
END;
$$ LANGUAGE plpgsql; 