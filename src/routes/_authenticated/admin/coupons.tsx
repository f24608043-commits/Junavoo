import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  component: CouponsAdmin,
});

type Draft = {
  id?: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: string;
  min_order_value: string;
  usage_limit: string;
  expires_at: string;
  active: boolean;
};

const empty: Draft = {
  code: "",
  discount_type: "percent",
  discount_value: "10",
  min_order_value: "0",
  usage_limit: "",
  expires_at: "",
  active: true,
};

function CouponsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = async () => {
    if (!draft) return;
    const code = draft.code.trim().toUpperCase();
    if (!code) return toast.error("Code required");
    const value = Number(draft.discount_value);
    if (!Number.isFinite(value) || value <= 0) return toast.error("Invalid discount value");
    if (draft.discount_type === "percent" && value > 100) return toast.error("Percent must be ≤ 100");
    const row = {
      code,
      discount_type: draft.discount_type,
      discount_value: value,
      min_order_value: Number(draft.min_order_value) || 0,
      usage_limit: draft.usage_limit ? parseInt(draft.usage_limit, 10) : null,
      expires_at: draft.expires_at ? new Date(draft.expires_at).toISOString() : null,
      active: draft.active,
    };
    const { error } = draft.id
      ? await supabase.from("coupons").update(row).eq("id", draft.id)
      : await supabase.from("coupons").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
  };

  const startEdit = (c: any) =>
    setDraft({
      id: c.id,
      code: c.code,
      discount_type: c.discount_type,
      discount_value: String(c.discount_value),
      min_order_value: String(c.min_order_value),
      usage_limit: c.usage_limit ? String(c.usage_limit) : "",
      expires_at: c.expires_at ? c.expires_at.slice(0, 16) : "",
      active: c.active,
    });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <Button onClick={() => setDraft({ ...empty })}>New coupon</Button>
      </div>

      {draft && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-border p-4 md:grid-cols-2">
          <div>
            <Label>Code</Label>
            <Input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
          </div>
          <div>
            <Label>Discount type</Label>
            <select
              className="block w-full rounded border border-input bg-background p-2 text-sm"
              value={draft.discount_type}
              onChange={(e) => setDraft({ ...draft, discount_type: e.target.value as any })}
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div>
            <Label>Discount value</Label>
            <Input type="number" step="0.01" value={draft.discount_value} onChange={(e) => setDraft({ ...draft, discount_value: e.target.value })} />
          </div>
          <div>
            <Label>Min order value</Label>
            <Input type="number" step="0.01" value={draft.min_order_value} onChange={(e) => setDraft({ ...draft, min_order_value: e.target.value })} />
          </div>
          <div>
            <Label>Usage limit (blank = unlimited)</Label>
            <Input type="number" value={draft.usage_limit} onChange={(e) => setDraft({ ...draft, usage_limit: e.target.value })} />
          </div>
          <div>
            <Label>Expires at</Label>
            <Input type="datetime-local" value={draft.expires_at} onChange={(e) => setDraft({ ...draft, expires_at: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
            <Label>Active</Label>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2">Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min order</th>
            <th>Used</th>
            <th>Limit</th>
            <th>Expires</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={9} className="py-3 text-muted-foreground">No coupons.</td></tr>}
          {rows.map((c: any) => (
            <tr key={c.id} className="border-b border-border">
              <td className="py-2 font-mono">{c.code}</td>
              <td>{c.discount_type}</td>
              <td>{c.discount_type === "percent" ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
              <td>${Number(c.min_order_value).toFixed(2)}</td>
              <td>{c.used_count}</td>
              <td>{c.usage_limit ?? "∞"}</td>
              <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "—"}</td>
              <td>{c.active ? "Yes" : "No"}</td>
              <td className="text-right">
                <button className="mr-3 underline" onClick={() => startEdit(c)}>Edit</button>
                <button className="text-destructive underline" onClick={() => del(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}