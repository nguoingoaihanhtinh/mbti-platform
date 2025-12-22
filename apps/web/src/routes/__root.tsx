// src/routes/__root.tsx
import { createRootRoute, Outlet, ScrollRestoration } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ScrollRestoration />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),

  notFoundComponent: () => {
    window.location.pathname = "/not-found";
    return null;
  },
});
