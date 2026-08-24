import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, fieldClass, submitClass } from "@/components/AuthShell";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Sintética" },
      {
        name: "description",
        content: "Crie sua conta gratuita e monte o site do seu negócio conversando com a IA.",
      },
      { property: "og:title", content: "Criar conta — Sintética" },
      { property: "og:description", content: "Comece grátis e publique seu site hoje." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Leva menos de um minuto e o primeiro site é por nossa conta."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/entrar" className="font-medium text-foreground underline underline-offset-4">
            Entrar
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (senha.length < 6) {
            setErro("A senha precisa ter pelo menos 6 caracteres.");
            return;
          }
          const result = register(nome, email, senha);
          if (!result.ok) {
            setErro(result.error ?? "Não foi possível criar a conta.");
            return;
          }
          navigate({ to: "/criar" });
        }}
      >
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Seu nome
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como podemos te chamar?"
            className={fieldClass}
            required
          />
        </div>
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
            autoComplete="new-password"
            required
          />
        </div>

        {erro && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {erro}
          </p>
        )}

        <button type="submit" className={submitClass}>
          Criar conta gratuita
        </button>
      </form>
    </AuthShell>
  );
}
