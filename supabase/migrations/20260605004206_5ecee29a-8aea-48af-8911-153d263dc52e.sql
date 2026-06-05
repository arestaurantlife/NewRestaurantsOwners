ALTER TABLE public.feature_pdfs ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS feature_pdfs_tags_gin_idx ON public.feature_pdfs USING GIN (tags);