import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, SECURITY_MESSAGES, validateStrictInput } from "@/lib/security";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { z } from "zod";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { isBlocked, remainingAttempts, checkRateLimit } = useRateLimit(`admin_login_${email}`);

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        if (data) navigate("/admin/dashboard");
      }
    };
    checkAdmin();
  }, [navigate]);

  const validateInput = () => {
    try {
      const validatedEmail = validateStrictInput(email, loginSchema.shape.email, "email");
      const validatedPassword = validateStrictInput(password, z.string().min(1), "password");
      
      setValidationErrors({});
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Validation failed";
      setValidationErrors({ general: errorMessage });
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input first
    if (!validateInput()) {
      return;
    }

    // Check rate limiting
    const rateLimitResult = checkRateLimit();
    if (!rateLimitResult.allowed) {
      setError(SECURITY_MESSAGES.RATE_LIMITED);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const validatedEmail = validateStrictInput(email, loginSchema.shape.email, "email");
      const validatedPassword = validateStrictInput(password, z.string().min(1), "password");

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: validatedEmail,
        password: validatedPassword,
      });

      if (authError) {
        setError(SECURITY_MESSAGES.INVALID_CREDENTIALS);
        setLoading(false);
        return;
      }

      // Check admin role
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });

      if (!isAdmin) {
        await supabase.auth.signOut();
        setError(SECURITY_MESSAGES.ACCESS_DENIED);
        setLoading(false);
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(SECURITY_MESSAGES.LOGIN_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Junavo Admin</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {isBlocked && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {SECURITY_MESSAGES.RATE_LIMITED}
              </div>
            )}
            
            {validationErrors.general && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{validationErrors.general}</p>
            )}
            
            {error && !validationErrors.general && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBlocked}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isBlocked}
                required
              />
            </div>

            {!isBlocked && remainingAttempts < 5 && (
              <p className="text-xs text-muted-foreground">
                {remainingAttempts} attempts remaining
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading || isBlocked}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
