-- Create table for storing text analysis history
CREATE TABLE IF NOT EXISTS analysis_history (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    analyzed_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries by language and date
CREATE INDEX IF NOT EXISTS idx_analysis_language ON analysis_history(language);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON analysis_history(created_at DESC);