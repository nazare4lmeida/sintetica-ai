import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Gauge, Users, Globe, BarChart3, ArrowUpRight, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { AuthGuard } from "@/components/AuthGuard";
import { AdminProvider } from "@/lib/admin-store";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Sintética" },
      { name: "description", content: "Painel administrativo da Sintética: usuários, sites e relatórios." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AuthGuard role="admin">
      <AdminLayout />
    </AuthGuard>
  );
}

const NAV = [
  { to: "/admin", label: "Visão geral", icon: Gauge, exact: true },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
  { to: "/admin/sites", label: "Sites", icon: Globe },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
] as const;

function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const sair = () => {
    logout();
    void navigate({ to: "/entrar" });
  };

  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-ink text-ink-foreground">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink-line/70 px-3 py-6 lg:flex">
          <Link to="/" className="mb-1 flex items-center gap-2 px-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-ink-foreground">
              <span className="size-3 rounded-full bg-accent" />
            </span>
            <span className="font-display text-base font-bold tracking-tight">SINTÉTICA</span>
          </Link>
          <span className="mb-8 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            console admin
          </span>

          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon, ...rest }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: "exact" in rest ? rest.exact : false }}
                activeProps={{ className: "bg-ink-soft text-ink-foreground" }}
                inactiveProps={{ className: "text-ink-muted hover:bg-ink-soft/60" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto mb-2 flex items-center justify-between rounded-lg border border-ink-line/70 px-3 py-2 text-xs text-ink-muted">
            Tema do console
            <ThemeToggle tone="ink" className="size-8" />
          </div>

          <Link
            to="/painel"
            className="flex items-center justify-between rounded-lg border border-ink-line/70 px-3 py-2.5 text-xs text-ink-muted transition-colors hover:text-ink-foreground"
          >
            Voltar ao painel do cliente
            <ArrowUpRight className="size-3.5" />
          </Link>

          <div className="mt-2 truncate px-3 text-[10px] text-ink-muted">{user?.email}</div>
          <button
            onClick={sair}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-ink-soft hover:text-ink-foreground"
          >
            <LogOut className="size-3.5" /> Sair da conta
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-2 overflow-x-auto border-b border-ink-line/70 px-4 py-3 lg:hidden">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "bg-ink-soft text-ink-foreground" }}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={sair}
              aria-label="Sair"
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-ink-line/70 px-3 py-1.5 text-xs text-ink-muted"
            >
              <LogOut className="size-3.5" /> Sair
            </button>
            <ThemeToggle tone="ink" className="shrink-0" />
          </header>
          <Outlet />
        </div>
      </div>
    </AdminProvider>
  );
}
