-- Add columns for automatic recurring payments (billing keys)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS customer_key TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS billing_key TEXT;
