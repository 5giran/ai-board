import { Outlet, createRootRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/layout/AppHeader";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}
