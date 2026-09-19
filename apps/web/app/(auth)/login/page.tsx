"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { apiFetch } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { accessToken } = await apiFetch<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(accessToken);
      router.replace("/dashboard");
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setError(null);
    try {
      const { accessToken } = await apiFetch<{ accessToken: string }>("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      setAccessToken(accessToken);
      router.replace("/dashboard");
    } catch {
      setError("Không thể đăng nhập bằng Google. Vui lòng thử lại");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-extrabold text-ink-900">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 rounded-xl border border-border-strong bg-surface px-3 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 rounded-xl border border-border-strong bg-surface px-3 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
          <>
          <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
            <span className="h-px flex-1 bg-border" />
            hoặc
            <span className="h-px flex-1 bg-border" />
          </div>

          <GoogleLoginButton onCredential={handleGoogleCredential} />
          </>
        ) : null}
      </Card>
    </main>
  );
}
