import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { router } from "./router";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    login();
  }, [login]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
