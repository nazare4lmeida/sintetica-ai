import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  LayoutTemplate,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useSites } from "@/lib/sites-store";
import { useAuth } from "@/lib/auth-store";
import { AuthGuard } from "@/components/AuthGuard";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/painel")({
  component: PainelRoute,
});

const NAV = [
  { to: "/painel", label: "Início", icon: LayoutDashboard, exact: true },
  { to: "/painel/sites", label: "Meus sites", icon: Globe },
  { to: "/criar", label: "Criar novo site", icon: Sparkles },
  { to: "/painel/modelos", label: "Modelos", icon: LayoutTemplate },
  { to: "/painel/configuracoes", label: "Configurações", icon: Settings },
] as const;

function PainelRoute() {
  return (
    <AuthGuard>
      <PainelLayout />
    </AuthGuard>
  );
}

function PainelLayout() {
  const { userName } = useSites();
  const { isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const sair = () => {
    logout();
    void navigate({ to: "/entrar" });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background px-4 py-6 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground">
            <span className="size-3 rounded-full bg-accent" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">SINTÉTICA</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: "exact" in rest ? rest.exact : false }}
              activeProps={{ className: "bg-surface-2 text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-surface" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              activeProps={{ className: "bg-surface-2 text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-surface" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              <ShieldCheck className="size-4" />
              Administração
            </Link>
          )}
        </nav>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <ThemeToggle className="order-last ml-auto shrink-0" />
            <span className="flex size-9 items-center justify-center rounded-full bg-espresso text-sm font-bold text-espresso-foreground">
              {userName.charAt(0)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{userName}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={sair}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-1 items-center gap-3 overflow-x-auto">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "bg-surface-2 text-foreground" }}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                Administração
              </Link>
            )}
          </div>
          <ThemeToggle className="shrink-0" />
          <button
            onClick={sair}
            aria-label="Sair"
            title="Sair"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
