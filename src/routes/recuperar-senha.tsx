import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, fieldClass, submitClass } from "@/components/AuthShell";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Sintética" },
      { name: "description", content: "Receba um link para criar uma nova senha da sua conta." },
      { property: "og:title", content: "Recuperar senha — Sintética" },
      { property: "og:description", content: "Enviamos um link para redefinir sua senha." },
    ],
  }),
  component: Recuperar,
});

function Recuperar() {
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviamos um link para você criar uma nova senha."
      footer={
        <Link to="/entrar" className="font-medium text-foreground underline underline-offset-4">
          Voltar para o login
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-sm">
          <p className="font-semibold text-accent">Link enviado!</p>
          <p className="mt-2 text-muted-foreground">
            Confira sua caixa de entrada e siga as instruções para criar uma nova senha.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail da conta
            </label>
            <input type="email" className={fieldClass} required />
          </div>
          <button type="submit" className={submitClass}>
            Enviar link de recuperação
          </button>
        </form>
      )}
    </AuthShell>
  );
}
