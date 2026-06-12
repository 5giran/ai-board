import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type AuthPoint = {
  marker: string;
  title: string;
  description: string;
};

type AuthShellProps = {
  points: AuthPoint[];
  children: ReactNode;
};

export function AuthShell({ points, children }: AuthShellProps) {
  return (
    <main className="auth-wrap">
      <aside className="auth-aside">
        <Link className="logo" to="/">
          <span className="logo-mark" aria-hidden="true" />
          Extendly
        </Link>
        <div className="auth-points">
          {points.map((point) => (
            <div className="auth-point" key={point.title}>
              <span className="n">{point.marker}</span>
              <p>
                <b>{point.title}</b> {point.description}
              </p>
            </div>
          ))}
        </div>
        <span className="auth-foot">extendly · ai-powered extension registry</span>
      </aside>
      <div className="auth-main">
        <div className="auth-card">{children}</div>
      </div>
    </main>
  );
}
