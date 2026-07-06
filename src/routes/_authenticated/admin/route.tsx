import { createFileRoute, Outlet, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — My Store" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { role, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  if (role !== "admin") return <Navigate to="/" />;

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside className="w-56 shrink-0 border-r border-border pr-4">
        <nav className="flex flex-col gap-1 text-sm">
          <AdminLink to="/admin">Dashboard</AdminLink>
          <AdminLink to="/admin/products">Products</AdminLink>
          <AdminLink to="/admin/categories">Categories</AdminLink>
          <AdminLink to="/admin/brands">Brands</AdminLink>
          <AdminLink to="/admin/deals">Deals</AdminLink>
          <AdminLink to="/admin/orders">Orders</AdminLink>
          <AdminLink to="/admin/coupons">Coupons</AdminLink>
          <AdminLink to="/admin/reviews">Reviews</AdminLink>
          <AdminLink to="/admin/blog">Blog</AdminLink>
          <AdminLink to="/admin/subscribers">Subscribers</AdminLink>
          <AdminLink to="/admin/settings">Settings</AdminLink>
        </nav>
      </aside>
      <section className="flex-1 min-w-0">
        <Outlet />
      </section>
    </div>
  );
}

function AdminLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/admin" }}
      activeProps={{ className: "font-semibold underline" }}
      className="rounded px-2 py-1 hover:bg-secondary"
    >
      {children}
    </Link>
  );
}