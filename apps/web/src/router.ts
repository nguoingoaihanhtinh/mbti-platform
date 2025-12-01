import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen"; // ← file này sẽ được sinh tự động

export const router = createRouter({ routeTree });

// Đăng ký global type cho TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
