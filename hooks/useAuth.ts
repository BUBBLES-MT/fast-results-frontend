import { useState } from "react";
import api from "@/lib/axios";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/login", { email, password });
      setUser(res.data.user);
      // optionally store token: localStorage.setItem("token", res.data.token)
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    // optionally remove token from localStorage
  };

  return { user, login, logout };
};