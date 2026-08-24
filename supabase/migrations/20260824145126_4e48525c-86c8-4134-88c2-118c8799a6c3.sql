CREATE TABLE public.site_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text,
  session_id text NOT NULL,
  event_type text NOT NULL DEFAULT 'view',
  duration_ms integer NOT NULL DEFAULT 0,
  referrer text,
  device text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX site_events_site_id_idx ON public.site_events (site_id, created_at DESC);
CREATE INDEX site_events_slug_idx ON public.site_events (slug);

GRANT SELECT, INSERT ON public.site_events TO anon;
GRANT SELECT, INSERT ON public.site_events TO authenticated;
GRANT ALL ON public.site_events TO service_role;

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a site visit"
  ON public.site_events FOR INSERT TO anon, authenticated
  WITH CHECK (event_type IN ('view','heartbeat'));

CREATE POLICY "Anyone can read site audience metrics"
  ON public.site_events FOR SELECT TO anon, authenticated
  USING (true);