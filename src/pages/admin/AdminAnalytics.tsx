import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminAnalytics() {
  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([]);
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [categoryPerf, setCategoryPerf] = useState<any[]>([]);
  const [couponUsage, setCouponUsage] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [orders, products, categories, coupons] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("products").select("*"),
        supabase.from("categories").select("*"),
        supabase.from("coupons").select("*"),
      ]);

      const ords = orders.data || [];
      const prods = products.data || [];
      const cats = categories.data || [];

      // Revenue & Orders by month
      const monthlyRev: Record<string, number> = {};
      const monthlyOrd: Record<string, number> = {};
      ords.forEach(o => {
        const m = new Date(o.created_at).toLocaleDateString("en-US", { month: "short" });
        monthlyRev[m] = (monthlyRev[m] || 0) + Number(o.total);
        monthlyOrd[m] = (monthlyOrd[m] || 0) + 1;
      });
      setRevenueByMonth(Object.entries(monthlyRev).map(([m, v]) => ({ month: m, revenue: v })));
      setOrdersByMonth(Object.entries(monthlyOrd).map(([m, v]) => ({ month: m, orders: v })));

      // Category performance (product count per category)
      const catMap: Record<string, string> = {};
      cats.forEach(c => { catMap[c.id] = c.name; });
      const catCount: Record<string, number> = {};
      prods.forEach(p => {
        const name = catMap[p.category_id] || "Uncategorized";
        catCount[name] = (catCount[name] || 0) + 1;
      });
      setCategoryPerf(Object.entries(catCount).map(([name, value]) => ({ name, value })));

      // Coupon usage
      setCouponUsage((coupons.data || []).filter(c => (c.usage_count || 0) > 0).map(c => ({ name: c.code, usage: c.usage_count || 0 })));
    };
    fetch();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Revenue by Month</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Orders by Month</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Category Distribution</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryPerf} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {categoryPerf.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Coupon Usage</CardTitle></CardHeader>
          <CardContent className="h-64">
            {couponUsage.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-8 text-center">No coupon usage data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={couponUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
