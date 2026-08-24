import { Moon, Sun } from "lucide-react";
import { useAppearance } from "@/lib/appearance";
import { cn } from "@/lib/utils";

/**
 * Alternador claro/escuro do produto.
 * `tone="ink"` é usado sobre painéis escuros (editor e admin).
 */
export function ThemeToggle({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "ink";
}) {
  const { appearance, toggle } = useAppearance();
  const isDark = appearance === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border transition-colors",
        tone === "ink"
          ? "border-ink-line/70 text-ink-muted hover:bg-ink-soft hover:text-ink-foreground"
          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
