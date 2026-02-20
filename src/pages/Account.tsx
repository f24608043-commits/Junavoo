import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Package } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  billing_name: string | null;
};

export default function Account() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authTab, setAuthTab] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState({ display_name: "", email: "", phone: "", address: "" });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) loadUserData(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) loadUserData(session.user);
    });
  }, []);

  const loadUserData = async (u: User) => {
    const [{ data: profileData }, { data: orderData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", u.id).single(),
      supabase.from("orders").select("id,created_at,status,total,billing_name").eq("user_id", u.id).order("created_at", { ascending: false }),
    ]);
    if (profileData) {
      setProfile({
        display_name: profileData.display_name || "",
        email: profileData.email || u.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
    }
    setOrders(orderData || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password });
    if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
    setSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: { data: { display_name: registerForm.name }, emailRedirectTo: window.location.origin },
    });
    if (error) toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    else toast({ title: "Check your email", description: "We sent you a confirmation link." });
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (error) toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      display_name: profile.display_name,
      phone: profile.phone,
      address: profile.address,
    }).eq("user_id", user.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated" });
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full mb-4 gap-2 h-11 border-2"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>

          <Tabs value={authTab} onValueChange={setAuthTab}>
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div><Label className="text-xs">Email</Label><Input type="email" required className="h-10 mt-1" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div><Label className="text-xs">Password</Label><Input type="password" required className="h-10 mt-1" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} /></div>
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div><Label className="text-xs">Full Name</Label><Input required className="h-10 mt-1" value={registerForm.name} onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label className="text-xs">Email</Label><Input type="email" required className="h-10 mt-1" value={registerForm.email} onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div><Label className="text-xs">Password</Label><Input type="password" required className="h-10 mt-1" value={registerForm.password} onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))} /></div>
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />Logout
          </Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="pt-4 space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : orders.map(o => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border bg-card p-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                  <p className="text-sm font-medium mt-0.5">${Number(o.total).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[o.status] || "bg-muted text-muted-foreground"}`}>{o.status}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="profile" className="pt-4 space-y-4 max-w-sm">
            <div><Label className="text-xs">Display Name</Label><Input className="h-10 mt-1" value={profile.display_name} onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))} /></div>
            <div><Label className="text-xs">Email</Label><Input className="h-10 mt-1" type="email" value={profile.email} disabled /></div>
            <div><Label className="text-xs">Phone</Label><Input className="h-10 mt-1" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label className="text-xs">Address</Label><Input className="h-10 mt-1" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} /></div>
            <Button size="sm" onClick={handleUpdateProfile}>Update Profile</Button>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
