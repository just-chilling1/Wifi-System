-- Saved generations for Done-For-You Profit and Unlimited.
-- Run in the shared Supabase project (SQL Editor). Safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.premium_generation_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  feature text NOT NULL CHECK (feature IN ('dfy_profit', 'dfy_vault')),
  name text NOT NULL,
  affiliate_url text NOT NULL,
  niche text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  used_keys jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT premium_generation_sets_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT premium_generation_sets_url_not_blank CHECK (length(trim(affiliate_url)) > 0),
  CONSTRAINT premium_generation_sets_payload_is_object CHECK (jsonb_typeof(payload) = 'object'),
  CONSTRAINT premium_generation_sets_used_keys_is_object CHECK (jsonb_typeof(used_keys) = 'object')
);

CREATE UNIQUE INDEX IF NOT EXISTS premium_generation_sets_user_feature_name_uidx
  ON public.premium_generation_sets (user_id, feature, lower(trim(name)));

CREATE INDEX IF NOT EXISTS premium_generation_sets_user_updated_idx
  ON public.premium_generation_sets (user_id, feature, updated_at DESC);

ALTER TABLE public.premium_generation_sets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own premium generation sets" ON public.premium_generation_sets;
CREATE POLICY "Users can view own premium generation sets"
  ON public.premium_generation_sets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own premium generation sets" ON public.premium_generation_sets;
CREATE POLICY "Users can insert own premium generation sets"
  ON public.premium_generation_sets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own premium generation sets" ON public.premium_generation_sets;
CREATE POLICY "Users can update own premium generation sets"
  ON public.premium_generation_sets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own premium generation sets" ON public.premium_generation_sets;
CREATE POLICY "Users can delete own premium generation sets"
  ON public.premium_generation_sets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.premium_generation_sets TO authenticated;
GRANT ALL ON TABLE public.premium_generation_sets TO service_role;
