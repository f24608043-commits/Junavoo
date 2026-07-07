import { useEffect, useState, ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Ticket, Mail,
  LogOut, Tag, Star, FileText, Users, BarChart3, Shield, Settings,
  ScrollText, ChevronLeft, ChevronRight
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", path: "/admin/products", icon: Package },
      { label: "Categories", path: "/admin/categories", icon: FolderOpen },
      { label: "Brands", path: "/admin/brands", icon: Tag },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
      { label: "Coupons", path: "/admin/coupons", icon: Ticket },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Reviews", path: "/admin/reviews", icon: Star },
      { label: "Blog", path: "/admin/blog", icon: FileText },
      { label: "Subscribers", path: "/admin/subscribers", icon: Mail },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Users", path: "/admin/users", icon: Users },
      { label: "Settings", path: "/admin/settings", icon: Settings, superOnly: true },
      { label: "System Logs", path: "/admin/logs", icon: ScrollText, superOnly: true },
      { label: "Security", path: "/admin/security", icon: Shield, superOnly: true },
    ],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin"); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id, _role: "admin",
      });
      const { data: isSuper } = await supabase.rpc("has_role", {
        _user_id: session.user.id, _role: "super_admin",
      });
      if (!isAdmin && !isSuper) { navigate("/admin"); return; }
      setIsSuperAdmin(!!isSuper);
      setLoading(false);
    };
    check();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className={`${collapsed ? "w-16" : "w-56"} border-r bg-card flex flex-col transition-all duration-200`}>
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed && <Link to="/admin/dashboard" className="text-lg font-bold">Junavo</Link>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-muted rounded">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(i => !i.superOnly || isSuperAdmin);
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title} className="mb-2">
                {!collapsed && (
                  <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </p>
                )}
                {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={`flex items-center gap-2 mx-2 px-3 py-2 rounded text-sm ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="border-t p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
