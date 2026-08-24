import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Métricas de audiência dos sites publicados.
 * Cada visita gera um evento `view` e, ao sair da página, um `heartbeat`
 * com o tempo total de permanência.
 */

export interface SiteEvent {
  site_id: string;
  slug: string | null;
  session_id: string;
  event_type: string;
  duration_ms: number;
  referrer: string | null;
  device: string | null;
  created_at: string;
}

export interface SiteMetrics {
  views: number;
  visitors: number;
  avgTimeMs: number;
  totalTimeMs: number;
  lastVisitAt: string | null;
  daily: { date: string; views: number }[];
  devices: { device: string; views: number }[];
  referrers: { referrer: string; views: number }[];
}

const SESSION_KEY = "sintetica.visitor";

export const emptyMetrics = (): SiteMetrics => ({
  views: 0,
  visitors: 0,
  avgTimeMs: 0,
  totalTimeMs: 0,
  lastVisitAt: null,
  daily: [],
  devices: [],
  referrers: [],
});

function sessionId(): string {
  try {
    const found = localStorage.getItem(SESSION_KEY);
    if (found) return found;
    const created = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return "anon";
  }
}

function deviceKind(): string {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/** Registra uma visita e devolve uma função de encerramento que grava o tempo na página. */
export function trackVisit(siteId: string, slug: string | null): () => void {
  const start = Date.now();
  const session = sessionId();
  const device = deviceKind();
  const referrer =
    typeof document !== "undefined" && document.referrer ? document.referrer : "direto";

  void supabase.from("site_events").insert({
    site_id: siteId,
    slug,
    session_id: session,
    event_type: "view",
    device,
    referrer,
  });

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    const duration = Date.now() - start;
    if (duration < 1000) return;
    void supabase.from("site_events").insert({
      site_id: siteId,
      slug,
      session_id: session,
      event_type: "heartbeat",
      duration_ms: duration,
      device,
      referrer,
    });
  };

  const onHide = () => {
    if (document.visibilityState === "hidden") close();
  };
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", close);

  return () => {
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", close);
    close();
  };
}

function topCounts(rows: SiteEvent[], key: "device" | "referrer") {
  const map = new Map<string, number>();
  for (const row of rows) {
    if (row.event_type !== "view") continue;
    const value = row[key] ?? "desconhecido";
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, views]) => ({ device: name, referrer: name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);
}

export function aggregate(rows: SiteEvent[]): SiteMetrics {
  const views = rows.filter((r) => r.event_type === "view");
  const durations = rows.filter((r) => r.event_type === "heartbeat" && r.duration_ms > 0);
  const totalTimeMs = durations.reduce((sum, r) => sum + r.duration_ms, 0);

  const byDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of views) {
    const day = row.created_at.slice(0, 10);
    if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  return {
    views: views.length,
    visitors: new Set(views.map((r) => r.session_id)).size,
    avgTimeMs: durations.length ? Math.round(totalTimeMs / durations.length) : 0,
    totalTimeMs,
    lastVisitAt: views.length ? (views[0]?.created_at ?? null) : null,
    daily: [...byDay.entries()].map(([date, count]) => ({ date, views: count })),
    devices: topCounts(rows, "device").map((d) => ({ device: d.device, views: d.views })),
    referrers: topCounts(rows, "referrer").map((d) => ({ referrer: d.referrer, views: d.views })),
  };
}

async function fetchEvents(): Promise<SiteEvent[]> {
  const { data, error } = await supabase
    .from("site_events")
    .select("site_id, slug, session_id, event_type, duration_ms, referrer, device, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as SiteEvent[];
}

/** Todos os eventos, com métricas por site e globais. */
export function useAnalytics() {
  const query = useQuery({
    queryKey: ["site-events"],
    queryFn: fetchEvents,
    staleTime: 30_000,
  });

  const rows = query.data ?? [];
  const bySite = new Map<string, SiteEvent[]>();
  for (const row of rows) {
    const list = bySite.get(row.site_id);
    if (list) list.push(row);
    else bySite.set(row.site_id, [row]);
  }

  return {
    loading: query.isLoading,
    rows,
    total: aggregate(rows),
    metricsFor: (siteId: string) => aggregate(bySite.get(siteId) ?? []),
  };
}

export function formatDuration(ms: number): string {
  if (!ms) return "0s";
  const total = Math.round(ms / 1000);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  if (min === 0) return `${sec}s`;
  return `${min}min ${String(sec).padStart(2, "0")}s`;
}

export function formatDay(date: string): string {
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}
