import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, fieldClass, submitClass } from "@/components/AuthShell";
import { CONTA_ADMIN, CONTA_DEMO, useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Sintética" },
      {
        name: "description",
        content: "Acesse sua conta e continue criando o site do seu negócio.",
      },
      { property: "og:title", content: "Entrar — Sintética" },
      { property: "og:description", content: "Acesse sua conta Sintética." },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const preencher = (conta: { email: string; senha: string }) => {
    setEmail(conta.email);
    setSenha(conta.senha);
    setErro(null);
  };

  return (
    <AuthShell
      title="Bem-vindo(a) de volta"
      subtitle="Entre para continuar de onde parou."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-foreground underline underline-offset-4">
            Criar conta
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const result = login(email, senha);
          if (!result.ok) {
            setErro(result.error ?? "Não foi possível entrar.");
            return;
          }
          navigate({ to: result.papel === "admin" ? "/admin" : "/painel" });
        }}
      >
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={fieldClass}
            autoComplete="current-password"
            required
          />
        </div>

        {erro && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {erro}
          </p>
        )}

        <div className="flex justify-end">
          <Link
            to="/recuperar-senha"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Esqueci minha senha
          </Link>
        </div>
        <button type="submit" className={submitClass}>
          Entrar
        </button>
      </form>
    </AuthShell>
  );
}
