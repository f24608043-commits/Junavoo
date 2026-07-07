import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, AlertTriangle, Users, TrendingUp, Clock, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalProfit: 0,
    lowStock: 0, outOfStock: 0, totalUsers: 0, pendingOrders: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [products, orders, profiles] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("orders").select("*"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const prods = products.data || [];
      const ords = orders.data || [];
      const revenue = ords.reduce((s, o) => s + Number(o.total), 0);
      const cost = ords.reduce((s, o) => s + Number(o.subtotal) * 0.7, 0);

      setStats({
        totalProducts: prods.length,
        totalOrders: ords.length,
        totalRevenue: revenue,
        totalProfit: revenue - cost,
        lowStock: prods.filter(p => p.stock > 0 && p.stock <= (p.min_stock_alert || 5)).length,
        outOfStock: prods.filter(p => p.stock === 0).length,
        totalUsers: profiles.count || 0,
        pendingOrders: ords.filter(o => o.status === "pending").length,
      });

      // Revenue by month
      const monthly: Record<string, number> = {};
      ords.forEach(o => {
        const m = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        monthly[m] = (monthly[m] || 0) + Number(o.total);
      });
      setRevenueData(Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })));

      // Order status distribution
      const statusMap: Record<string, number> = {};
      ords.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
      setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

      // Recent orders
      setRecentOrders(ords.slice(0, 5));

      // Top products by stock (as proxy for best sellers)
      setTopProducts(prods.sort((a, b) => b.rating - a.rating).slice(0, 5));
    };
    fetchAll();
  }, []);

  const cards = [
    { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600" },
    { label: "Profit", value: `$${stats.totalProfit.toFixed(2)}`, icon: TrendingUp, color: "text-green-600" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { label: "Pending", value: stats.pendingOrders, icon: Clock, color: "text-orange-500" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "text-primary" },
    { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "text-orange-500" },
    { label: "Out of Stock", value: stats.outOfStock, icon: AlertTriangle, color: "text-destructive" },
    { label: "Users", value: stats.totalUsers, icon: Users, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {cards.map(c => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent><p className="text-xl font-bold">{c.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Revenue Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Order Status</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map(o => (
                <div key={o.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{o.billing_name || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(o.total).toFixed(2)}</p>
                    <p className="text-xs capitalize text-muted-foreground">{o.status}</p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Top Rated Products</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Stock: {p.stock}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-orange-500" />
                    <span className="text-sm">{p.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
