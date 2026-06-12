import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { label: "Explore", to: "/" },
  { label: "Submit", to: "/extensions/new" },
  { label: "AI Curator", to: "/curator" },
] as const;

export function AppHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="bar">
      <div className="bar-in">
        <Link className="logo" to="/">
          <span className="logo-mark" aria-hidden="true" />
          Extendly
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              className={isActive(pathname, item.to) ? "on" : undefined}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="bar-r">
          <Link className="btn btn-ghost btn-sm" to="/login">
            Login
          </Link>
          <Link className="btn btn-primary btn-sm" to="/signup">
            Sign up
          </Link>
          <Link
            className={`my-link${pathname === "/me" ? " on" : ""}`}
            to="/me"
            aria-label="My Page"
          >
            <span className="av">YR</span>
            <span>My Page</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/") {
    return pathname === "/" || pathname.startsWith("/extensions/") && pathname !== "/extensions/new";
  }

  return pathname === to;
}
