import { cn } from "@/lib/cn";

/** Largura máxima e gutters — único lugar que define a medida do conteúdo. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-shell px-6 md:px-10", className)}>{children}</div>
  );
}
