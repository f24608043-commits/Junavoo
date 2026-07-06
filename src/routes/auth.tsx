import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — My Store" },
      { name: "description", content: "Sign in or create an account at My Store." },
    ],
  }),
  component: AuthPage,
});

const registerSchema = z.object({
  username: z.string().trim().min(2).max(50),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" />;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      if (mode === "register") {
        const parsed = registerSchema.safeParse({
          username: fd.get("username"),
          email: fd.get("email"),
          password: fd.get("password"),
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { username: parsed.data.username },
          },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Account created");
        navigate({ to: "/" });
      } else {
        const parsed = loginSchema.safeParse({
          email: fd.get("email"),
          password: fd.get("password"),
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) {
          toast.error(error.message);
          return;
        }
        navigate({ to: "/" });
      }
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {mode === "login" ? "Welcome back." : "No email verification required."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {mode === "register" && (
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={6} />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {mode === "login" ? "Sign in" : "Register"}
        </Button>
      </form>

      <div className="my-4 text-center text-xs text-muted-foreground">or</div>
      <Button type="button" variant="outline" className="w-full" onClick={onGoogle} disabled={busy}>
        Continue with Google
      </Button>

      <button
        type="button"
        className="mt-6 w-full text-sm underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Don't have an account? Register" : "Have an account? Sign in"}
      </button>
    </div>
  );
}