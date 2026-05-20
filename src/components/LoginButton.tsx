"use client";

import { signInWithGoogle } from "@/lib/auth";

export default function LoginButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <button onClick={handleLogin} className={className}>
      {children}
    </button>
  );
}
