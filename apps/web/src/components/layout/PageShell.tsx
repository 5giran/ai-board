import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  padded?: boolean;
};

export function PageShell({ children, padded = false }: PageShellProps) {
  return <div className={`wrap${padded ? " page-pad" : ""}`}>{children}</div>;
}
