import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import api from "../libs/api";

export type RegisterData = {
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", data);
      navigate({ to: "/assessments" });
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/login", data);
      navigate({ to: "/assessments" });
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    navigate({ to: "/login" });
  };

  return {
    register,
    login,
    logout,
    loading,
    error,
  };
};
