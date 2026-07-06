import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/deals")({
  component: DealsAdmin,
});

type Draft = {
  id?: string;
  title: string;
  description: string;
  deal_price: string;
  active: boolean;
  expires_at: string;
  product_ids: string[];
};

const empty: Draft = { title: "", description: "", deal_price: "0", active: true, expires_at: "", product_ids: [] };

function DealsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: deals = [] } = useQuery({
    queryKey: ["admin", "deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*, deal_products(product_id, products(id,name))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products-min"],
    queryFn: async () => (await supabase.from("products").select("id,name").order("name")).data ?? [],
  });

  const save = async () => {
    if (!draft) return;
    const title = draft.title.trim();
    if (!title) return toast.error("Title required");
    const price = Number(draft.deal_price);
    if (!Number.isFinite(price) || price < 0) return toast.error("Invalid deal price");
    const row = {
      title,
      description: draft.description || null,
      deal_price: price,
      active: draft.active,
      expires_at: draft.expires_at ? new Date(draft.expires_at).toISOString() : null,
    };
    let dealId = draft.id;
    if (dealId) {
      const { error } = await supabase.from("deals").update(row).eq("id", dealId);
      if (error) return toast.error(error.message);
    } else {
      const { data, error } = await supabase.from("deals").insert(row).select("id").single();
      if (error) return toast.error(error.message);
      dealId = data.id;
    }
    await supabase.from("deal_products").delete().eq("deal_id", dealId);
    if (draft.product_ids.length > 0) {
      const { error } = await supabase
        .from("deal_products")
        .insert(draft.product_ids.map((pid) => ({ deal_id: dealId!, product_id: pid })));
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin", "deals"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "deals"] });
  };

  const startEdit = (d: any) =>
    setDraft({
      id: d.id,
      title: d.title,
      description: d.description ?? "",
      deal_price: String(d.deal_price),
      active: d.active,
      expires_at: d.expires_at ? d.expires_at.slice(0, 16) : "",
      product_ids: (d.deal_products ?? []).map((dp: any) => dp.product_id),
    });

  const toggleProduct = (id: string) => {
    if (!draft) return;
    const has = draft.product_ids.includes(id);
    setDraft({
      ...draft,
      product_ids: has ? draft.product_ids.filter((x) => x !== id) : [...draft.product_ids, id],
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Deals</h1>
        <Button onClick={() => setDraft({ ...empty })}>New deal</Button>
      </div>

      {draft && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-border p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div>
            <Label>Deal price</Label>
            <Input type="number" step="0.01" value={draft.deal_price} onChange={(e) => setDraft({ ...draft, deal_price: e.target.value })} />
          </div>
          <div>
            <Label>Expires at</Label>
            <Input type="datetime-local" value={draft.expires_at} onChange={(e) => setDraft({ ...draft, expires_at: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Products in deal</Label>
            <div className="mt-1 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded border border-border p-2 text-sm">
              {products.map((p: any) => (
                <label key={p.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.product_ids.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
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
            <th className="py-2">Title</th>
            <th>Price</th>
            <th>Products</th>
            <th>Expires</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {deals.length === 0 && <tr><td colSpan={6} className="py-3 text-muted-foreground">No deals.</td></tr>}
          {deals.map((d: any) => (
            <tr key={d.id} className="border-b border-border">
              <td className="py-2">{d.title}</td>
              <td>${Number(d.deal_price).toFixed(2)}</td>
              <td>{(d.deal_products ?? []).length}</td>
              <td>{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : "—"}</td>
              <td>{d.active ? "Yes" : "No"}</td>
              <td className="text-right">
                <button className="mr-3 underline" onClick={() => startEdit(d)}>Edit</button>
                <button className="text-destructive underline" onClick={() => del(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}