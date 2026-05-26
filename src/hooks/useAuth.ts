import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function useAuth() {
  const ctx = useContext(AuthContext as any);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
