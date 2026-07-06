import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [products, orders, customers, posts, pending, lowStock, recent, revenue] =
        await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("blog_posts").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("products").select("id,name,stock").lte("stock", 5).order("stock").limit(10),
          supabase
            .from("orders")
            .select("id,customer_name,total_price,status,created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("orders").select("total_price").neq("status", "cancelled"),
        ]);
      const totalRevenue = (revenue.data ?? []).reduce(
        (s, r) => s + Number(r.total_price ?? 0),
        0,
      );
      return {
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        customers: customers.count ?? 0,
        posts: posts.count ?? 0,
        pending: pending.count ?? 0,
        lowStock: lowStock.data ?? [],
        recent: recent.data ?? [],
        revenue: totalRevenue,
      };
    },
  });

  if (stats.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const s = stats.data!;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Products" value={s.products} />
        <StatCard label="Orders" value={s.orders} />
        <StatCard label="Revenue" value={`$${s.revenue.toFixed(2)}`} />
        <StatCard label="Pending orders" value={s.pending} />
        <StatCard label="Customers" value={s.customers} />
        <StatCard label="Blog posts" value={s.posts} />
      </div>

      <h2 className="mt-8 text-lg font-semibold">Recent orders</h2>
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2">Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {s.recent.length === 0 && (
            <tr><td colSpan={5} className="py-3 text-muted-foreground">No orders yet.</td></tr>
          )}
          {s.recent.map((o) => (
            <tr key={o.id} className="border-b border-border">
              <td className="py-2 font-mono text-xs">{o.id.slice(0, 8)}</td>
              <td>{o.customer_name}</td>
              <td>${Number(o.total_price).toFixed(2)}</td>
              <td>{o.status}</td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8 text-lg font-semibold">Low stock (≤ 5)</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {s.lowStock.length === 0 && <li className="text-muted-foreground">All good.</li>}
        {s.lowStock.map((p) => (
          <li key={p.id}>{p.name} — {p.stock} left</li>
        ))}
      </ul>
    </div>
  );
}