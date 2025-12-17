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

export type ForgotPasswordData = {
  email: string;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectAfterLogin = async () => {
    try {
      const res = await api.get("/auth/profile");
      const user = res.data.user;

      if (user.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else if (user.role === "company") {
        navigate({ to: "/company/assignments" });
      } else {
        navigate({ to: "/assessments" });
      }
    } catch (err) {
      navigate({ to: "/assessments" });
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", data);
      navigate({ to: "/login" });
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
      await redirectAfterLogin();
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

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });

      alert("If your email is registered, you’ll receive an OTP shortly.");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send OTP";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };
  const sendLoginOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/login/otp", { email });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send OTP";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/login/verify", { email, otp });
      await redirectAfterLogin();
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid OTP";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const sendRegisterOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register/otp", { email });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send OTP";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyRegisterOtp = async (dto: { email: string; otp: string; full_name: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register/verify", dto);
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid OTP";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    register,
    login,
    logout,
    forgotPassword,
    sendLoginOtp,
    verifyLoginOtp,
    sendRegisterOtp,
    verifyRegisterOtp,
    loading,
    error,
  };
};
