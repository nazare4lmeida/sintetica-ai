import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-store";

/**
 * Protege rotas privadas no cliente.
 * `role="admin"` exige uma conta administrativa; qualquer outra conta é
 * redirecionada para o painel do cliente.
 */
export function AuthGuard({ children, role }: { children: ReactNode; role?: "admin" }) {
  const { ready, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const allowed = !!user && (role !== "admin" || isAdmin);

  useEffect(() => {
    if (!ready) return;
    if (!user) void navigate({ to: "/entrar" });
  }, [ready, user, navigate]);

  if (!ready) return <div className="min-h-screen bg-background" />;

  if (!user) return <div className="min-h-screen bg-background" />;

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Esta área é exclusiva para contas administrativas. Entre com uma conta de administrador
          para continuar.
        </p>
        <div className="flex gap-3">
          <Link
            to="/painel"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
          >
            Ir para o painel
          </Link>
          <Link
            to="/entrar"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Entrar como admin
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
