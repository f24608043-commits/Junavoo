import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/brands")({
  component: BrandsAdmin,
});

function BrandsAdmin() {
  const qc = useQueryClient();
  const { data: brands = [] } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<{ id?: string; name: string; slug: string } | null>(null);

  const save = async () => {
    if (!editing) return;
    const name = editing.name.trim();
    const slug = editing.slug.trim() || slugify(name);
    if (!name) return toast.error("Name required");
    const row = { name, slug };
    const { error } = editing.id
      ? await supabase.from("brands").update(row).eq("id", editing.id)
      : await supabase.from("brands").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin", "brands"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "brands"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <Button onClick={() => setEditing({ name: "", slug: "" })}>New brand</Button>
      </div>

      {editing && (
        <div className="mt-4 space-y-3 rounded border border-border p-4">
          <div>
            <Label>Name</Label>
            <Input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2">Name</th>
            <th>Slug</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {brands.length === 0 && (
            <tr><td colSpan={3} className="py-3 text-muted-foreground">No brands yet.</td></tr>
          )}
          {brands.map((b) => (
            <tr key={b.id} className="border-b border-border">
              <td className="py-2">{b.name}</td>
              <td className="text-muted-foreground">{b.slug}</td>
              <td className="text-right">
                <button className="mr-3 underline" onClick={() => setEditing({ id: b.id, name: b.name, slug: b.slug })}>Edit</button>
                <button className="text-destructive underline" onClick={() => del(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}