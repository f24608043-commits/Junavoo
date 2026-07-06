import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersAdmin,
});

const STATUSES = ["pending", "shipped", "delivered", "cancelled"] as const;

function OrdersAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders", filter],
    queryFn: async () => {
      let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter as any);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const { data: items = [] } = useQuery({
    queryKey: ["admin", "order-items", openId],
    enabled: !!openId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", openId!);
      if (error) throw error;
      return data;
    },
  });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <select
          className="rounded border border-input bg-background p-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={7} className="py-3 text-muted-foreground">No orders.</td></tr>
            )}
            {orders.map((o: any) => (
              <Fragment key={o.id}>
                <tr className="border-b border-border">
                  <td className="py-2 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_email}</td>
                  <td>${Number(o.total_price).toFixed(2)}</td>
                  <td>
                    <select
                      className="rounded border border-input bg-background p-1 text-xs"
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="text-right">
                    <button className="underline" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                      {openId === o.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {openId === o.id && (
                  <tr className="border-b border-border bg-muted/40">
                    <td colSpan={7} className="p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-medium uppercase text-muted-foreground">Shipping</div>
                          <div className="mt-1 text-sm">
                            {o.address_line1}{o.address_line2 ? `, ${o.address_line2}` : ""}<br />
                            {o.city}{o.state ? `, ${o.state}` : ""} {o.postal_code}<br />
                            {o.country}<br />
                            {o.customer_phone && <>Phone: {o.customer_phone}<br /></>}
                          </div>
                          <div className="mt-2 text-xs">Subtotal: ${Number(o.subtotal).toFixed(2)}</div>
                          <div className="text-xs">Discount: ${Number(o.discount).toFixed(2)}{o.coupon_code ? ` (${o.coupon_code})` : ""}</div>
                          <div className="text-xs font-medium">Total: ${Number(o.total_price).toFixed(2)}</div>
                          {o.notes && <div className="mt-2 text-xs">Notes: {o.notes}</div>}
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase text-muted-foreground">Items</div>
                          <ul className="mt-1 space-y-1 text-sm">
                            {items.map((it: any) => (
                              <li key={it.id}>
                                {it.product_name} × {it.quantity} — ${Number(it.line_total).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}