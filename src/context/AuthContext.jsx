import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("currentUser");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuth();
      }
    }
    setLoading(false);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const saveAuth = (authData) => {
    localStorage.setItem("accessToken", authData.accessToken);
    if (authData.refreshToken) {
      localStorage.setItem("refreshToken", authData.refreshToken);
    }

    const userData = {
      id: authData.userId,
      email: authData.email,
      name: `${authData.firstName || ""} ${authData.lastName || ""}`.trim() || authData.email,
      role: (authData.role || "").toLowerCase(),
      avatar: getAvatar(authData.role),
    };

    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const getAvatar = (role) => {
    const r = (role || "").toLowerCase();
    if (r === "admin") return "👑";
    if (r === "lender") return "🏦";
    if (r === "analyst") return "📊";
    return "👤";
  };

  const login = async (email, password, captchaId, captchaAnswer) => {
    const response = await authService.login({
      email,
      password,
      captchaId,
      captchaAnswer,
    });

    if (response.success && response.data) {
      saveAuth(response.data);
      return true;
    }

    throw new Error(response.message || "Login failed");
  };

  const register = async (formData) => {
    const response = await authService.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName || formData.name?.split(" ")[0] || formData.name,
      lastName: formData.lastName || formData.name?.split(" ").slice(1).join(" ") || "User",
      role: (formData.role || "BORROWER").toUpperCase(),
    });
    return response;
  };

  const verifyOtp = async (email, otp) => {
    const response = await authService.verifyOtp(email, otp);
    if (response.success && response.data) {
      saveAuth(response.data);
      return true;
    }
    throw new Error(response.message || "OTP verification failed");
  };

  const sendLoginOtp = async (email) => {
    return await authService.sendLoginOtp(email);
  };

  const demoLogin = async (email, password) => {
    const response = await authService.demoLogin(email, password);
    if (response.success && response.data) {
      saveAuth(response.data);
      return true;
    }
    throw new Error(response.message || "Demo login failed");
  };

  const logout = useCallback(() => {
    clearAuth();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
      }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, verifyOtp, sendLoginOtp, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};