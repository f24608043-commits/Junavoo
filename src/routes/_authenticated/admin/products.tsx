import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsAdmin,
});

type Draft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  image_url_1: string;
  image_url_2: string;
  image_url_3: string;
  brand_id: string | null;
  category_id: string | null;
  stock: string;
  featured: boolean;
};

const emptyDraft: Draft = {
  name: "",
  slug: "",
  description: "",
  price: "0",
  original_price: "",
  image_url_1: "",
  image_url_2: "",
  image_url_3: "",
  brand_id: null,
  category_id: null,
  stock: "0",
  featured: false,
};

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, brand:brands(name), category:categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: brands = [] } = useQuery({
    queryKey: ["brands-min"],
    queryFn: async () => (await supabase.from("brands").select("id,name").order("name")).data ?? [],
  });
  const { data: cats = [] } = useQuery({
    queryKey: ["cats-min"],
    queryFn: async () => (await supabase.from("categories").select("id,name").order("name")).data ?? [],
  });

  const [draft, setDraft] = useState<Draft | null>(null);

  const save = async () => {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) return toast.error("Name required");
    const price = Number(draft.price);
    if (!Number.isFinite(price) || price < 0) return toast.error("Invalid price");
    const stock = parseInt(draft.stock, 10);
    const row = {
      name,
      slug: (draft.slug || slugify(name)).trim(),
      description: draft.description || null,
      price,
      original_price: draft.original_price ? Number(draft.original_price) : null,
      image_url_1: draft.image_url_1 || null,
      image_url_2: draft.image_url_2 || null,
      image_url_3: draft.image_url_3 || null,
      brand_id: draft.brand_id || null,
      category_id: draft.category_id || null,
      stock: Number.isFinite(stock) ? stock : 0,
      featured: !!draft.featured,
    };
    const { error } = draft.id
      ? await supabase.from("products").update(row).eq("id", draft.id)
      : await supabase.from("products").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  const startEdit = (p: any) => {
    setDraft({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      image_url_1: p.image_url_1 ?? "",
      image_url_2: p.image_url_2 ?? "",
      image_url_3: p.image_url_3 ?? "",
      brand_id: p.brand_id,
      category_id: p.category_id,
      stock: String(p.stock),
      featured: !!p.featured,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button onClick={() => setDraft({ ...emptyDraft })}>New product</Button>
      </div>

      {draft && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-border p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Name</Label>
            <Input
              value={draft.name}
              onChange={(e) =>
                setDraft({ ...draft, name: e.target.value, slug: draft.slug || slugify(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" step="0.01" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
          </div>
          <div>
            <Label>Original price (optional)</Label>
            <Input type="number" step="0.01" value={draft.original_price} onChange={(e) => setDraft({ ...draft, original_price: e.target.value })} />
          </div>
          <div>
            <Label>Brand</Label>
            <select
              className="block w-full rounded border border-input bg-background p-2 text-sm"
              value={draft.brand_id ?? ""}
              onChange={(e) => setDraft({ ...draft, brand_id: e.target.value || null })}
            >
              <option value="">— None —</option>
              {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Category</Label>
            <select
              className="block w-full rounded border border-input bg-background p-2 text-sm"
              value={draft.category_id ?? ""}
              onChange={(e) => setDraft({ ...draft, category_id: e.target.value || null })}
            >
              <option value="">— None —</option>
              {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          {(["image_url_1", "image_url_2", "image_url_3"] as const).map((k, i) => (
            <div key={k} className="md:col-span-2">
              <Label>Image URL {i + 1}</Label>
              <Input value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Switch checked={draft.featured} onCheckedChange={(v) => setDraft({ ...draft, featured: v })} />
            <Label>Featured</Label>
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
            <th className="py-2">Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Featured</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={7} className="py-3 text-muted-foreground">No products yet.</td></tr>
          )}
          {products.map((p: any) => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2">{p.name}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>{p.brand?.name ?? "—"}</td>
              <td>{p.category?.name ?? "—"}</td>
              <td>{p.featured ? "Yes" : ""}</td>
              <td className="text-right">
                <button className="mr-3 underline" onClick={() => startEdit(p)}>Edit</button>
                <button className="text-destructive underline" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}