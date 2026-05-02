-- Content Enhancements for Detailed Pages
-- Run this SQL inside the Supabase SQL Editor

-- Add rich content and additional fields to content_items table
ALTER TABLE public.content_items 
ADD COLUMN IF NOT EXISTS content text,
ADD COLUMN IF NOT EXISTS cover_image_url text,
ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS content_items_slug_type_idx ON public.content_items(slug, type) WHERE slug IS NOT NULL;

-- Function to generate slugs automatically
CREATE OR REPLACE FUNCTION public.generate_slug(title text, type text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  unique_slug text;
  counter integer := 1;
BEGIN
  -- Generate base slug from title
  base_slug := lower(regexp_replace(trim(title), '[^a-z0-9]+', '-', 'g'));
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
  base_slug := coalesce(nullif(base_slug, ''), 'untitled');
  
  -- Start with base slug
  unique_slug := base_slug;
  
  -- Check if slug exists and make it unique if needed
  WHILE EXISTS (SELECT 1 FROM public.content_items WHERE slug = unique_slug AND type = type) LOOP
    unique_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN unique_slug;
END;
$$;

-- Trigger to automatically generate slugs
CREATE OR REPLACE FUNCTION public.update_content_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only generate slug if it's not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title, NEW.type);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic slug generation
CREATE TRIGGER content_items_slug_trigger
  BEFORE INSERT OR UPDATE ON public.content_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_content_slug();

-- Update existing items to have slugs
UPDATE public.content_items 
SET slug = public.generate_slug(title, type) 
WHERE slug IS NULL OR slug = '';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS content_items_slug_idx ON public.content_items(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS content_items_type_slug_idx ON public.content_items(type, slug) WHERE slug IS NOT NULL;

-- Grant permissions
GRANT ALL ON public.content_items TO authenticated;
GRANT SELECT ON public.content_items TO anon;
