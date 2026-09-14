-- Singleton row for admin-editable promotional links (Exclusive Offers, training URLs, etc.)
CREATE TABLE IF NOT EXISTS public.site_promo_settings (
    id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    exclusive_offers_enabled boolean NOT NULL DEFAULT true,
    exclusive_offers jsonb NOT NULL DEFAULT '[]'::jsonb,
    external_training_url text NOT NULL,
    external_training_title text NOT NULL DEFAULT 'Wake Up With An Extra $1,000–$5,000 In Your Bank Account Tomorrow',
    external_training_cta_label text NOT NULL DEFAULT 'Watch The Free Training >>',
    video_withdraw_url text NOT NULL,
    scale_training_url text NOT NULL,
    scale_training_title text NOT NULL DEFAULT 'Scale Your Wifi Code To $1,000+ Per Day',
    scale_training_cta_label text NOT NULL DEFAULT 'Click Here To Access Training >>',
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_promo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read promo settings" ON public.site_promo_settings;
CREATE POLICY "Authenticated users can read promo settings"
    ON public.site_promo_settings
    FOR SELECT
    TO authenticated
    USING (true);

INSERT INTO public.site_promo_settings (
    id,
    exclusive_offers_enabled,
    exclusive_offers,
    external_training_url,
    external_training_title,
    external_training_cta_label,
    video_withdraw_url,
    scale_training_url,
    scale_training_title,
    scale_training_cta_label
) VALUES (
    1,
    true,
    '[
        {"title": "Create your Q-LAPS2000 account", "href": "https://jvz4.com/c/3547097/442443/", "cta": "Create Now", "icon": "UserPlus"},
        {"title": "Watch this Free training", "href": "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea", "cta": "Watch Now", "icon": "Play"},
        {"title": "Create your Cashapp Account", "href": "https://jvz1.com/c/3547097/443257/", "cta": "CashTap AI", "icon": "Wallet"}
    ]'::jsonb,
    'https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea',
    'Wake Up With An Extra $1,000–$5,000 In Your Bank Account Tomorrow',
    'Watch The Free Training >>',
    'https://jvz1.com/c/3547097/442055/',
    'https://www.jvzoo.com/c/86517/415009',
    'Scale Your Wifi Code To $1,000+ Per Day',
    'Click Here To Access Training >>'
)
ON CONFLICT (id) DO NOTHING;

NOTIFY pgrst, 'reload schema';
