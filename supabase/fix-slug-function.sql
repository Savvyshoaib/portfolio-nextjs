-- Fix for ambiguous column reference in slug generation function
-- Run this SQL in Supabase SQL Editor to fix the issue

-- Drop the existing function and recreate with proper parameter naming
DROP FUNCTION IF EXISTS public.generate_slug(text, text);

-- Recreate the function with non-conflicting parameter names
CREATE OR REPLACE FUNCTION public.generate_slug(item_title text, item_type text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  unique_slug text;
  counter integer := 1;
BEGIN
  -- Generate base slug from title
  base_slug := lower(regexp_replace(trim(item_title), '[^a-z0-9]+', '-', 'g'));
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
  base_slug := coalesce(nullif(base_slug, ''), 'untitled');
  
  -- Start with base slug
  unique_slug := base_slug;
  
  -- Check if slug exists and make it unique if needed
  WHILE EXISTS (SELECT 1 FROM public.content_items WHERE slug = unique_slug AND type = item_type) LOOP
    unique_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN unique_slug;
END;
$$;

-- Drop and recreate the trigger function
DROP FUNCTION IF EXISTS public.update_content_slug();

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

-- Recreate the trigger
DROP TRIGGER IF EXISTS content_items_slug_trigger ON public.content_items;

CREATE TRIGGER content_items_slug_trigger
  BEFORE INSERT OR UPDATE ON public.content_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_content_slug();

-- Update existing items that don't have slugs
UPDATE public.content_items 
SET slug = public.generate_slug(title, type) 
WHERE slug IS NULL OR slug = '';

-- Verify the fix by checking a few items
SELECT id, title, type, slug FROM public.content_items WHERE type = 'portfolio' LIMIT 5;
